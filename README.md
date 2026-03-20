# Brand Studio

AI-powered brand identity tool — strategy, logo brief, color, typography, UI tokens & copy. 12-book knowledge base. 5 AI providers (Claude, ChatGPT, Gemini, DeepSeek, Groq).

---

## Download

Go to [**Releases**](../../releases) and download for your platform:

| File | Platform | Prerequisites |
|------|----------|---------------|
| `brand-studio-win.exe` | Windows | None — double-click to run |
| `brand-studio-macos` | macOS | None — `chmod +x` then double-click |
| `brand-studio-linux` | Linux | None — `chmod +x` then `./brand-studio-linux` |
| `brand-studio.cmd` | Windows | [Node.js](https://nodejs.org) (170KB, lightweight) |
| `brand-studio.sh` | Mac/Linux | [Node.js](https://nodejs.org) (170KB, lightweight) |

The `.exe` / binary versions include Node.js bundled (~50MB). The `.cmd` / `.sh` versions are tiny but need Node.js installed.

Open the app, click **⚙** in the toolbar, paste an API key from any provider:

- **Groq** — https://console.groq.com/keys (free, fastest)
- **Gemini** — https://aistudio.google.com/apikey (free tier)
- **DeepSeek** — https://platform.deepseek.com/api_keys (very cheap)
- **Claude** — https://console.anthropic.com/settings/keys
- **ChatGPT** — https://platform.openai.com/api-keys

## Quick Start — Developers

```bash
git clone <repo-url>
cd brand-studio
npm install
npm start                   # http://localhost:3000
```

Click ⚙ to add API keys, or copy `.env.example` to `.env`.

## Building Releases

```bash
# Portable scripts (170KB, needs Node.js)
node build-portable.js

# Standalone executables (~50MB, no dependencies)
npm run build:exe
```

Releases are built automatically by GitHub Actions when you push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## What It Does

Work through 10 steps to produce a complete brand identity guide:

| Step | What | Book Knowledge |
|------|------|----------------|
| 1. Brief | Name, industry, audience, personality, competitors | — |
| 2. Name Analysis | SMILE/SCRATCH scoring, alternatives | *Hello, My Name Is Awesome* — Watkins |
| 3. Strategy | Positioning, promise, personality, tone pairs | *The Brand Gap* — Neumeier · *Brand Bible* — Millman |
| 4. Voice & Copy | Taglines, headline formulas, tone rules, example copy | *Ogilvy on Advertising* — Ogilvy · *Brand Bible* — Millman |
| 5. Color System | Base color picker with AI guidance, full palette, Albers interaction rules | *Interaction of Color* — Albers |
| 6. Typography & Grid | Google Fonts pairing, type scale, 4px base grid | *Grid Systems* — Müller-Brockmann · *Refactoring UI* — Wathan & Schoger |
| 7. Logo Brief | Concept direction, mark description, construction notes, rough sketch, image-gen prompt export | *Logo Modernism* — Müller · *Logo Design Love* / *Identity Designed* — Airey |
| 8. UI Tokens | CSS `:root` variables, shadows, spacing, motion principles | *Refactoring UI* — Wathan & Schoger · *Designing Interface Animation* — Head |
| 9. Assets | Select deliverables for the brand guide | — |
| 10. Brand Guide | Compiled identity document, single-page PDF export | — |
| 11. Architecture | *(optional)* Branded house / house of brands / hybrid model | *Brand Portfolio Strategy* — Aaker |

---

## Features

### Multi-Provider AI
Switch between 5 providers from the toolbar. Choose model tier per provider. API keys stay in `.env` — never touch the browser.

- **Claude** (Anthropic) — Haiku, Sonnet, Opus
- **ChatGPT** (OpenAI) — 4.1 Nano through 4.1
- **Gemini** (Google) — 2.0 Flash through 2.5 Pro (free tier available)
- **DeepSeek** — V3 Chat and R1 Reasoner (~90% cheaper than Claude)
- **Groq** — Llama 3.1/3.3/4, Qwen3 (free tier, ultra-fast inference)

### Project Management
- **Save/Load** — named projects in localStorage
- **Multiple projects** — switch between them
- **Export/Import** — download projects as `.json`, share between machines
- **Auto-save** — saves on every generation and step navigation

### Logo Workflow
- Generate a detailed **logo concept brief** (not a finished logo)
- Export as **markdown prompt** for AI image generators
- Links to free SVG logo generators (Recraft, Logo Diffusion, SVGMaker, Sologo AI, Vectr)
- **Upload your own logo** — SVG or PNG, appears in the brand guide
- Or paste SVG code directly

### Color System
- **Base color picker** with AI-guided suggestions based on brand personality
- Toggle to anchor the palette to your chosen color
- Full system: primary, secondary, accent, dark, light + semantic colors
- Albers interaction analysis with contrast ratios

### In-App Settings
- Click **⚙** in the toolbar to add/change API keys
- Keys write directly to `.env` — active immediately, no restart needed
- Shows which providers are configured

### PDF Export
- Single-page continuous PDF (no page breaks)
- Light theme for print — white backgrounds, ink-friendly
- Uses html2canvas + jsPDF for pixel-perfect output

---

## File Structure

```
brand-studio/
├── index.html              # The full application
├── server.js               # Express proxy server (multi-provider)
├── build-portable.js       # Generates standalone single-file builds
├── package.json            # Dependencies & scripts
├── favicon.svg             # Yellow dot + white B
├── start.bat               # Windows launcher (interactive setup)
├── start.sh                # Mac/Linux launcher
├── .env.example            # Template — copy to .env
├── .env                    # Your API keys (gitignored)
├── .github/workflows/
│   ├── deploy.yml          # GitHub Pages deployment
│   └── release.yml         # Builds executables on version tags
└── README.md
```

---

## Configuration

### `.env` options

```bash
# At least one provider key required
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AI...
DEEPSEEK_API_KEY=sk-...
GROQ_API_KEY=gsk_...

# Default provider shown in UI (anthropic | openai | gemini | deepseek | groq)
DEFAULT_PROVIDER=anthropic

# Server port
PORT=3000
```

### Models per provider

| Provider | Models | Cost |
|----------|--------|------|
| Claude | Haiku 4.5 / Sonnet 4 / Opus 4 | cheap → pricey |
| ChatGPT | 4.1 Nano / 4.1 Mini / 4o Mini / 4o / 4.1 | cheap → pricey |
| Gemini | 2.0 Flash / 2.5 Flash / 2.5 Pro | cheap → pricey |
| DeepSeek | V3 Chat / R1 Reasoner | cheap / mid |
| Groq | Llama 3.1 8B / 3.3 70B / 4 Scout / Qwen3 32B | free |

---

## Design Decisions

- **Single HTML file** — no framework, no build step. Server handles secure API key proxying
- **Book knowledge baked into prompts** — no uploads needed, principles are distilled into system prompts
- **Refactoring UI type scale** — 9 sizes on a hand-picked scale, all in `rem` units controlled by one `html { font-size }` value
- **Atkinson Hyperlegible** — UI font optimised for readability (Braille Institute)
- **Server-side proxy** — API keys never reach the browser

---

## Open Source Freeware

This is a free, open-source tool. Self-host it, add your own API key, use it for your projects. The API costs are yours (or use Groq/Gemini's free tier to start).

---

## Built With

- Claude / ChatGPT / Gemini / DeepSeek / Groq — AI generation
- Express.js — API proxy server
- html2canvas + jsPDF — PDF export
- @yao-pkg/pkg — standalone executable builds
- Atkinson Hyperlegible — UI font (Braille Institute)
- Fraunces — display font
- JetBrains Mono — code/label font
- Google Fonts API — brand typography loading
- Vanilla HTML/CSS/JS — no framework
