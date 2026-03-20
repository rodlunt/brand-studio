# Brand Studio

AI-powered brand identity tool — strategy, logo brief, color, typography, UI tokens & copy. 12-book knowledge base. Multi-provider (Claude, ChatGPT, Gemini).

---

## Quick Start

```bash
git clone <repo-url>
cd brand-studio
cp .env.example .env        # add your API key(s)
npm install
npm start                   # http://localhost:3000
```

You need at least one API key in `.env`. Get one from:
- **Claude** — https://console.anthropic.com/settings/keys
- **ChatGPT** — https://platform.openai.com/api-keys
- **Gemini** — https://aistudio.google.com/apikey (free)

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
Switch between Claude, ChatGPT, and Gemini from the toolbar. Choose model tier (cheap/mid/pricey) per provider. API keys stay in `.env` — never touch the browser.

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

### PDF Export
- Single-page continuous PDF (no page breaks)
- Light theme for print — white backgrounds, ink-friendly
- Uses html2canvas + jsPDF for pixel-perfect output

---

## File Structure

```
brand-studio/
├── index.html          # The full application
├── server.js           # Express proxy server (multi-provider)
├── package.json        # Dependencies & start script
├── favicon.svg         # Yellow dot + white B
├── .env.example        # Template — copy to .env
├── .env                # Your API keys (gitignored)
├── .gitignore
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

# Default provider shown in UI (anthropic | openai | gemini)
DEFAULT_PROVIDER=anthropic

# Server port
PORT=3000
```

### Models per provider

| Provider | Cheap | Mid | Pricey |
|----------|-------|-----|--------|
| Claude | Haiku 4.5 | Sonnet 4 | Opus 4 |
| ChatGPT | 4.1 Nano | 4.1 Mini / 4o Mini | 4o / 4.1 |
| Gemini | 2.0 Flash | 2.5 Flash | 2.5 Pro |

---

## Design Decisions

- **Single HTML file** — no framework, no build step. The server is optional (for secure API key handling)
- **Book knowledge baked into prompts** — no uploads needed, principles are distilled into system prompts
- **Refactoring UI type scale** — 9 sizes on a hand-picked scale, all in `rem` units controlled by one `html { font-size }` value
- **Atkinson Hyperlegible** — UI font optimised for readability (Braille Institute)
- **Server-side proxy** — API keys never reach the browser

---

## Freeware

This is a free tool. Self-host it, add your own API key, use it for your projects. The API costs are yours (or use Gemini's free tier to start).

---

## Built With

- Claude / ChatGPT / Gemini — all generation steps
- Express.js — API proxy server
- html2canvas + jsPDF — PDF export
- Atkinson Hyperlegible — UI font
- Fraunces — display font
- JetBrains Mono — code/label font
- Google Fonts API — brand typography loading
- Vanilla HTML/CSS/JS — no framework
