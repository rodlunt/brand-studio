require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const KEYS = {
  anthropic: process.env.ANTHROPIC_API_KEY || '',
  openai: process.env.OPENAI_API_KEY || '',
  gemini: process.env.GEMINI_API_KEY || ''
};

// Available models per provider — client sends the model ID
const ALLOWED_MODELS = {
  anthropic: ['claude-sonnet-4-20250514','claude-haiku-4-5-20251001','claude-opus-4-20250514'],
  openai: ['gpt-4o','gpt-4o-mini','gpt-4.1','gpt-4.1-mini','gpt-4.1-nano'],
  gemini: ['gemini-2.5-flash','gemini-2.5-pro','gemini-2.0-flash']
};

const BILLING_URLS = {
  anthropic: 'https://console.anthropic.com/settings/billing',
  openai: 'https://platform.openai.com/settings/organization/billing/overview',
  gemini: 'https://aistudio.google.com/apikey'
};

app.use(express.json({ limit: '1mb' }));
app.use(express.static('.'));

// Health check — tells the client which providers are available
app.get('/api/health', (_req, res) => {
  res.json({
    proxy: true,
    providers: {
      anthropic: !!KEYS.anthropic,
      openai: !!KEYS.openai,
      gemini: !!KEYS.gemini
    },
    default: process.env.DEFAULT_PROVIDER || 'anthropic'
  });
});

// Unified proxy — translates between providers
app.post('/api/messages', async (req, res) => {
  const provider = req.headers['x-provider'] || 'anthropic';
  const key = KEYS[provider];
  // Validate model if provided
  const requestedModel = req.headers['x-model'];
  if (requestedModel && ALLOWED_MODELS[provider] && !ALLOWED_MODELS[provider].includes(requestedModel)) {
    return res.status(400).json({ error: { message: `Model "${requestedModel}" not available for ${provider}` } });
  }

  if (!key) {
    const billing = BILLING_URLS[provider] || '';
    return res.status(401).json({ error: { message: `No API key for ${provider}. Add ${provider.toUpperCase()}_API_KEY to your .env file and restart the server.${billing ? ' Get a key: ' + billing : ''}` } });
  }

  try {
    let result;
    const model = requestedModel;
    if (provider === 'anthropic') {
      result = await callAnthropic(key, req.body, model);
    } else if (provider === 'openai') {
      result = await callOpenAI(key, req.body, model);
    } else if (provider === 'gemini') {
      result = await callGemini(key, req.body, model);
    } else {
      return res.status(400).json({ error: { message: `Unknown provider: ${provider}` } });
    }
    res.json(result);
  } catch (err) {
    const status = err.status || 502;
    const billing = BILLING_URLS[provider];
    let message = err.message || `${provider} API error`;
    if (billing && (status === 402 || status === 429 || /quota|billing|payment|insufficient|rate.limit|credit/i.test(message))) {
      message += ` — Add credits: ${billing}`;
    }
    if (billing && status === 401) {
      message += ` — Check your key or billing: ${billing}`;
    }
    res.status(status).json({ error: { message } });
  }
});

// ── Anthropic ──
async function callAnthropic(key, body, model) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: model || 'claude-sonnet-4-20250514', max_tokens: body.max_tokens || 2500, system: body.system, messages: body.messages })
  });
  const data = await r.json();
  if (!r.ok) throw { status: r.status, message: data.error?.message || `Anthropic API ${r.status}` };
  return { content: data.content };
}

// ── OpenAI ──
async function callOpenAI(key, body, model) {
  const messages = [];
  if (body.system) messages.push({ role: 'system', content: body.system });
  for (const m of body.messages) {
    messages.push({ role: m.role, content: m.content });
  }

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: model || 'gpt-4o', max_tokens: body.max_tokens || 2500, messages })
  });
  const data = await r.json();
  if (!r.ok) throw { status: r.status, message: data.error?.message || `OpenAI API ${r.status}` };
  return { content: [{ type: 'text', text: data.choices[0].message.content }] };
}

// ── Gemini ──
async function callGemini(key, body, model) {
  const contents = body.messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const payload = { contents };
  if (body.system) {
    payload.systemInstruction = { parts: [{ text: body.system }] };
  }
  payload.generationConfig = { maxOutputTokens: body.max_tokens || 2500 };

  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-2.5-flash'}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await r.json();
  if (!r.ok) throw { status: r.status, message: data.error?.message || `Gemini API ${r.status}` };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return { content: [{ type: 'text', text }] };
}

app.listen(PORT, () => {
  console.log(`\n  Brand Studio running at http://localhost:${PORT}\n`);
  const active = Object.entries(KEYS).filter(([, v]) => v).map(([k]) => k);
  if (active.length) {
    console.log('  API keys loaded:', active.join(', '));
  } else {
    console.log('  No API keys in .env — add at least one provider key and restart');
  }
  console.log();
});
