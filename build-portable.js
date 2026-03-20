#!/usr/bin/env node
/**
 * Build script — generates brand-studio-portable.js
 * A single file with zero npm dependencies that runs the full app.
 * Usage: node build-portable.js
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const favicon = fs.readFileSync(path.join(__dirname, 'favicon.svg'), 'utf8');

// Windows .cmd polyglot header — batch runs node on itself, Node sees it as a no-op + comment
const cmdHeader = '0<0// 2>nul & @echo off & node "%~f0" %* & exit /b\r\n';

// Linux/Mac shell script header
const shHeader = '#!/usr/bin/env node\n';

const coreCode = `/**
 * Brand Studio — Portable Single-File Edition
 * AI-powered brand identity tool. Zero dependencies.
 *
 * Windows: Double-click brand-studio.cmd
 * Mac/Linux: ./brand-studio (chmod +x first)
 * Or: node brand-studio.cmd
 *
 * First run will prompt for an API key.
 * Keys are saved to .env next to this file.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ENV_PATH = path.join(path.dirname(process.argv[1]), '.env');

// ── Embedded assets ──
const INDEX_HTML = ${JSON.stringify(html)};
const FAVICON_SVG = ${JSON.stringify(favicon)};

// ── Load .env ──
function loadEnv() {
  const keys = { anthropic: '', openai: '', gemini: '', deepseek: '', groq: '' };
  const envMap = { ANTHROPIC_API_KEY: 'anthropic', OPENAI_API_KEY: 'openai', GEMINI_API_KEY: 'gemini', DEEPSEEK_API_KEY: 'deepseek', GROQ_API_KEY: 'groq' };
  try {
    const content = fs.readFileSync(ENV_PATH, 'utf8');
    content.split('\\n').forEach(line => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && envMap[m[1].trim()]) keys[envMap[m[1].trim()]] = m[2].trim();
    });
  } catch {}
  return keys;
}

let KEYS = loadEnv();

// ── Provider configs ──
const ALLOWED_MODELS = {
  anthropic: ['claude-sonnet-4-20250514','claude-haiku-4-5-20251001','claude-opus-4-20250514'],
  openai: ['gpt-4o','gpt-4o-mini','gpt-4.1','gpt-4.1-mini','gpt-4.1-nano'],
  gemini: ['gemini-2.5-flash','gemini-2.5-pro','gemini-2.0-flash'],
  deepseek: ['deepseek-chat','deepseek-reasoner'],
  groq: ['llama-3.3-70b-versatile','llama-3.1-8b-instant','meta-llama/llama-4-scout-17b-16e-instruct','qwen/qwen3-32b']
};

const BILLING_URLS = {
  anthropic: 'https://console.anthropic.com/settings/billing',
  openai: 'https://platform.openai.com/settings/organization/billing/overview',
  gemini: 'https://aistudio.google.com/apikey',
  deepseek: 'https://platform.deepseek.com/top_up',
  groq: 'https://console.groq.com/settings/billing'
};

const OPENAI_COMPAT = {
  openai:   { url: 'https://api.openai.com/v1/chat/completions',      defaultModel: 'gpt-4o' },
  deepseek: { url: 'https://api.deepseek.com/v1/chat/completions',    defaultModel: 'deepseek-chat' },
  groq:     { url: 'https://api.groq.com/openai/v1/chat/completions', defaultModel: 'llama-3.3-70b-versatile' }
};

// ── API call functions ──
async function callAnthropic(key, body, model) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: model || 'claude-sonnet-4-20250514', max_tokens: body.max_tokens || 2500, system: body.system, messages: body.messages })
  });
  const data = await r.json();
  if (!r.ok) throw { status: r.status, message: data.error?.message || 'Anthropic API ' + r.status };
  return { content: data.content };
}

async function callOpenAICompat(key, body, model, config) {
  const messages = [];
  if (body.system) messages.push({ role: 'system', content: body.system });
  for (const m of body.messages) messages.push({ role: m.role, content: m.content });
  const r = await fetch(config.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({ model: model || config.defaultModel, max_tokens: body.max_tokens || 2500, messages })
  });
  const data = await r.json();
  if (!r.ok) throw { status: r.status, message: data.error?.message || 'API ' + r.status };
  return { content: [{ type: 'text', text: data.choices[0].message.content }] };
}

async function callGemini(key, body, model) {
  const contents = body.messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const payload = { contents };
  if (body.system) payload.systemInstruction = { parts: [{ text: body.system }] };
  payload.generationConfig = { maxOutputTokens: body.max_tokens || 2500 };
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + (model || 'gemini-2.5-flash') + ':generateContent?key=' + key, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  const data = await r.json();
  if (!r.ok) throw { status: r.status, message: data.error?.message || 'Gemini API ' + r.status };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return { content: [{ type: 'text', text }] };
}

// ── HTTP helpers ──
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; if (data.length > 1e6) reject(new Error('Too large')); });
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { reject(new Error('Invalid JSON')); } });
  });
}

function json(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(obj));
}

// ── Server ──
const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' }); res.end(); return; }

  const url = req.url.split('?')[0];

  // Static files
  if (req.method === 'GET') {
    if (url === '/' || url === '/index.html') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(INDEX_HTML); return; }
    if (url === '/favicon.svg') { res.writeHead(200, { 'Content-Type': 'image/svg+xml' }); res.end(FAVICON_SVG); return; }
  }

  // Health check
  if (req.method === 'GET' && url === '/api/health') {
    KEYS = loadEnv();
    return json(res, 200, {
      proxy: true,
      providers: { anthropic: !!KEYS.anthropic, openai: !!KEYS.openai, gemini: !!KEYS.gemini, deepseek: !!KEYS.deepseek, groq: !!KEYS.groq },
      default: 'anthropic'
    });
  }

  // Settings — save keys to .env
  if (req.method === 'POST' && url === '/api/settings') {
    try {
      const body = await readBody(req);
      const keys = body.keys;
      if (!keys) return json(res, 400, { error: { message: 'Invalid request' } });
      let env = {};
      try {
        fs.readFileSync(ENV_PATH, 'utf8').split('\\n').forEach(line => {
          const m = line.match(/^([^#=]+)=(.*)$/);
          if (m) env[m[1].trim()] = m[2].trim();
        });
      } catch {}
      const keyMap = { anthropic: 'ANTHROPIC_API_KEY', openai: 'OPENAI_API_KEY', gemini: 'GEMINI_API_KEY', deepseek: 'DEEPSEEK_API_KEY', groq: 'GROQ_API_KEY' };
      for (const [provider, envName] of Object.entries(keyMap)) {
        if (keys[provider] !== undefined) { if (keys[provider]) env[envName] = keys[provider]; else delete env[envName]; }
      }
      if (!env.PORT) env.PORT = '3000';
      fs.writeFileSync(ENV_PATH, Object.entries(env).map(([k, v]) => k + '=' + v).join('\\n') + '\\n');
      KEYS = loadEnv();
      return json(res, 200, { ok: true, message: 'Keys saved.' });
    } catch (e) { return json(res, 500, { error: { message: e.message } }); }
  }

  // Messages proxy
  if (req.method === 'POST' && url === '/api/messages') {
    try {
      const body = await readBody(req);
      const provider = req.headers['x-provider'] || 'anthropic';
      const model = req.headers['x-model'] || undefined;
      const key = KEYS[provider];

      if (model && ALLOWED_MODELS[provider] && !ALLOWED_MODELS[provider].includes(model)) {
        return json(res, 400, { error: { message: 'Model "' + model + '" not available for ' + provider } });
      }
      if (!key) {
        const billing = BILLING_URLS[provider] || '';
        return json(res, 401, { error: { message: 'No API key for ' + provider + '. Click ⚙ in the toolbar to add one.' + (billing ? ' Get a key: ' + billing : '') } });
      }

      let result;
      if (provider === 'anthropic') result = await callAnthropic(key, body, model);
      else if (OPENAI_COMPAT[provider]) result = await callOpenAICompat(key, body, model, OPENAI_COMPAT[provider]);
      else if (provider === 'gemini') result = await callGemini(key, body, model);
      else return json(res, 400, { error: { message: 'Unknown provider: ' + provider } });

      return json(res, 200, result);
    } catch (err) {
      const status = err.status || 502;
      let message = err.message || provider + ' API error';
      const billing = BILLING_URLS[req.headers['x-provider']] || '';
      if (billing && (status === 402 || status === 429 || /quota|billing|payment|insufficient|rate.limit|credit/i.test(message))) message += ' — Add credits: ' + billing;
      if (billing && status === 401) message += ' — Check your key or billing: ' + billing;
      return json(res, status, { error: { message } });
    }
  }

  // 404
  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, () => {
  console.log('');
  console.log('  =============================');
  console.log('   Brand Studio');
  console.log('  =============================');
  console.log('');
  console.log('  Running at http://localhost:' + PORT);
  console.log('');
  const active = Object.entries(KEYS).filter(([, v]) => v).map(([k]) => k);
  if (active.length) {
    console.log('  API keys loaded: ' + active.join(', '));
  } else {
    console.log('  No API keys configured yet.');
    console.log('  Open http://localhost:' + PORT + ' and click ⚙ to add keys.');
  }
  console.log('');
});

// Open browser automatically
const { exec } = require('child_process');
const url = 'http://localhost:' + PORT;
if (process.platform === 'win32') exec('start "" "' + url + '"');
else if (process.platform === 'darwin') exec('open "' + url + '"');
else exec('xdg-open "' + url + '" 2>/dev/null || true');
`;

// Build Windows version (.cmd — double-click to run)
const cmdFile = cmdHeader + coreCode;
fs.writeFileSync(path.join(__dirname, 'brand-studio.cmd'), cmdFile);

// Build Linux/Mac version (executable script)
const shFile = shHeader + coreCode;
fs.writeFileSync(path.join(__dirname, 'brand-studio'), shFile, { mode: 0o755 });

const sizeMB = (Buffer.byteLength(cmdFile) / 1024 / 1024).toFixed(2);
console.log(`\n  Built:`);
console.log(`    brand-studio.cmd  (Windows — double-click to run)`);
console.log(`    brand-studio      (Linux/Mac — ./brand-studio)`);
console.log(`    Size: ${sizeMB} MB each\n`);
