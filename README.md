# Brand Studio

AI-powered brand identity tool. Strategy, logo brief, color, typography, UI tokens and copy grounded in a 12-book knowledge base. Supports 5 AI providers: Claude, ChatGPT, Gemini, DeepSeek, and Groq.

---

## Download

Go to [**Releases**](../../releases) and download for your platform:

| File | Platform | Prerequisites |
|------|----------|---------------|
| `brand-studio-win.exe` | Windows | None, double-click to run |
| `brand-studio-macos` | macOS | None, `chmod +x` then double-click |
| `brand-studio-linux` | Linux | None, `chmod +x` then `./brand-studio-linux` |
| `brand-studio.cmd` | Windows | [Node.js](https://nodejs.org) required (170KB, lightweight) |
| `brand-studio.sh` | Mac/Linux | [Node.js](https://nodejs.org) required (170KB, lightweight) |

The `.exe` and binary versions include Node.js bundled (~50MB). The `.cmd` and `.sh` versions are tiny but need Node.js installed.

Open the app, click **⚙** in the toolbar, and paste an API key from any provider:

- **Groq** at https://console.groq.com/keys (free, fastest)
- **Gemini** at https://aistudio.google.com/apikey (free tier)
- **DeepSeek** at https://platform.deepseek.com/api_keys (very cheap)
- **Claude** at https://console.anthropic.com/settings/keys
- **ChatGPT** at https://platform.openai.com/api-keys

## Quick Start for Developers

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
| 1. Brief | Name, industry, audience, personality, competitors | |
| 2. Name Analysis | SMILE/SCRATCH scoring, alternatives | *Hello, My Name Is Awesome* by Watkins |
| 3. Strategy | Positioning, promise, personality, tone pairs | *The Brand Gap* by Neumeier, *Brand Bible* by Millman |
| 4. Voice & Copy | Taglines, headline formulas, tone rules, example copy | *Ogilvy on Advertising* by Ogilvy, *Brand Bible* by Millman |
| 5. Color System | Base color picker with AI guidance, full palette, interaction rules | *Interaction of Color* by Albers |
| 6. Typography & Grid | Google Fonts pairing, type scale, 4px base grid | *Grid Systems* by Müller-Brockmann, *Refactoring UI* by Wathan & Schoger |
| 7. Logo Brief | Concept direction, mark description, construction notes, image-gen prompt | *Logo Modernism* by Müller, *Logo Design Love* and *Identity Designed* by Airey |
| 8. UI Tokens | CSS `:root` variables, shadows, spacing, motion principles | *Refactoring UI* by Wathan & Schoger, *Designing Interface Animation* by Head |
| 9. Assets | Select deliverables for the brand guide | |
| 10. Brand Guide | Compiled identity document, single-page PDF export | |
| 11. Architecture | *(optional)* Branded house, house of brands, or hybrid model | *Brand Portfolio Strategy* by Aaker |

---

## Features

### Multi-Provider AI

Switch between 5 providers from the toolbar. Choose model tier per provider. API keys stay in `.env` and never touch the browser.

- **Claude** (Anthropic): Haiku, Sonnet, Opus
- **ChatGPT** (OpenAI): 4.1 Nano through 4.1
- **Gemini** (Google): 2.0 Flash through 2.5 Pro, free tier available
- **DeepSeek**: V3 Chat and R1 Reasoner, ~90% cheaper than Claude
- **Groq**: Llama 3.1/3.3/4, Qwen3, free tier with ultra-fast inference

### Project Management

- **Save/Load** named projects in localStorage
- **Multiple projects**, switch between them
- **Export/Import** projects as `.json` files, share between machines
- **Auto-save** on every generation and step navigation

### Logo Workflow

- Generate a detailed **logo concept brief** (not a finished logo)
- Export as **markdown prompt** for AI image generators
- Links to free SVG logo generators: Recraft, Logo Diffusion, SVGMaker, Sologo AI, Vectr
- **Upload your own logo** as SVG or PNG, appears in the brand guide
- Paste SVG code directly

### Color System

- **Base color picker** with AI-guided suggestions based on brand personality
- Toggle to anchor the palette to your chosen color
- Full system covering primary, secondary, accent, dark, light, and semantic colors
- Albers interaction analysis with contrast ratios

### In-App Settings

- Click **⚙** in the toolbar to add or change API keys
- Keys write directly to `.env`, active immediately with no restart needed
- Shows which providers are already configured

### PDF Export

- Single-page continuous PDF with no page breaks
- Light theme for print with white backgrounds, ink-friendly
- Uses html2canvas and jsPDF for pixel-perfect output

---

## File Structure

```
brand-studio/
├── index.html              # The full application
├── server.js               # Express proxy server (multi-provider)
├── build-portable.js       # Generates standalone single-file builds
├── package.json            # Dependencies and scripts
├── favicon.svg             # Yellow dot with white B
├── start.bat               # Windows launcher with interactive setup
├── start.sh                # Mac/Linux launcher
├── .env.example            # Template, copy to .env
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
| Claude | Haiku 4.5, Sonnet 4, Opus 4 | cheap to pricey |
| ChatGPT | 4.1 Nano, 4.1 Mini, 4o Mini, 4o, 4.1 | cheap to pricey |
| Gemini | 2.0 Flash, 2.5 Flash, 2.5 Pro | cheap to pricey |
| DeepSeek | V3 Chat, R1 Reasoner | cheap to mid |
| Groq | Llama 3.1 8B, 3.3 70B, 4 Scout, Qwen3 32B | free |

---

## Design Decisions

- **Single HTML file** with no framework and no build step. The server handles secure API key proxying.
- **Book knowledge baked into prompts.** No uploads needed. Principles are distilled into system prompts for each step.
- **Refactoring UI type scale.** 9 sizes on a hand-picked scale, all in `rem` units controlled by one `html { font-size }` value.
- **Atkinson Hyperlegible** for the UI font, optimised for readability (Braille Institute).
- **Server-side proxy** so API keys never reach the browser.

---

## Open Source Freeware

This is a free, open-source tool. Self-host it, add your own API key, and use it for your projects. The API costs are yours, or use Groq and Gemini free tiers to start.

---

## Built With

- Claude, ChatGPT, Gemini, DeepSeek, Groq for AI generation
- Express.js for the API proxy server
- html2canvas and jsPDF for PDF export
- @yao-pkg/pkg for standalone executable builds
- Atkinson Hyperlegible as the UI font (Braille Institute)
- Fraunces as the display font
- JetBrains Mono for code and label text
- Google Fonts API for brand typography loading
- Vanilla HTML, CSS, and JS with no framework
