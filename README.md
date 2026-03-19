# Brand Studio

AI-powered brand identity tool — strategy, logo, color, type, UI tokens & copy. 12-book knowledge base. Powered by Claude.

---

Brand Studio is a private AI-powered tool for building complete brand identities from scratch. Each step is grounded in a specific design or strategy book — from Logo Modernism and Interaction of Color through to Ogilvy on Advertising and Refactoring UI. Fill in a brief and work through 10 steps to produce a full brand guide covering strategy, logo (SVG), color system, typography, grid, UI design tokens, voice and copy, and a compiled PDF-ready brand guide.

Brand architecture is available as an optional Step 11 for brands with multiple products or sub-brands.

---

## Knowledge Base

Each step draws on a specific book's principles baked into the Claude system prompt for that step. The books do not need to be uploaded — the relevant principles are distilled directly into each generator.

| Step | Book(s) |
|------|---------|
| Name Analysis | *Hello, My Name Is Awesome* — Alexandra Watkins |
| Brand Strategy | *The Brand Gap* — Marty Neumeier · *Brand Bible* — Debbie Millman |
| Logo Design | *Logo Modernism* — Jens Müller · *Logo Design Love* — David Airey · *Identity Designed* — David Airey |
| Color System | *Interaction of Color* — Josef Albers |
| Typography & Grid | *Grid Systems in Graphic Design* — Josef Müller-Brockmann · *Refactoring UI* — Wathan & Schoger |
| UI Design Tokens | *Refactoring UI* — Wathan & Schoger · *Designing Interface Animation* — Val Head |
| Voice & Copy | *Ogilvy on Advertising* — David Ogilvy · *Brand Bible* — Debbie Millman |
| Brand Architecture | *Brand Portfolio Strategy* — David Aaker |

---

## Steps

1. **Brand Brief** — Name, industry, description, audience, personality words, competitors, visual direction. Enables optional Brand Architecture step.
2. **Name Analysis** — Watkins' SMILE score (out of 25) and SCRATCH risk score (out of 35). Per-criterion pass/warn/fail with alternative names if needed.
3. **Brand Strategy** — Positioning statement, point of difference, brand truth, brand promise, personality traits, tone pairs (we are / not), audience insight.
4. **Logo Design** — SVG full lockup (icon + wordmark) output. Dark and light background previews. Download SVG or copy code. Regenerate option.
5. **Color System** — Primary, secondary, accent, dark, light palettes. Semantic colors. Albers interaction analysis — which combinations work, which fail and why, contrast ratios.
6. **Typography & Grid** — Google Fonts pairing (display, heading, body, mono). Modular type scale. Müller-Brockmann 4px base grid, 12-column system, spacing scale.
7. **UI Design Tokens** — Copy-paste CSS `:root` variable block. Shadow scale. Border radius system. Interactive state colors. Val Head motion principles with brand-specific duration and easing.
8. **Voice & Copy** — Tagline options with Ogilvy formula labels. Headline formulas with real examples. Tone dos and don'ts. Elevator pitch. Example copy including edge cases (404 pages, error messages).
9. **Asset Selection** — Tick what you need: favicons, social banners, letterhead, business cards, app icon, email signature, slide template, CSS token file, voice cheat sheet.
10. **Brand Guide** — Compiled identity document from all completed steps. Print to PDF via browser.
11. **Brand Architecture** *(optional)* — Aaker's branded house / house of brands / hybrid model. Sub-brand relationship mapping, visual rules, naming convention, equity risk note.

---

## Usage

The tool is a single self-contained HTML file. Open it in any modern browser. No build step, no dependencies, no server required for local use.

Each step has a Generate button. Steps can be run independently or skipped — the Brand Guide in Step 10 compiles whatever has been completed.

### Running locally

```bash
open index.html
```

Or serve it through any static server:

```bash
npx serve .
# available at http://localhost:3000
```

### Requirements

- A modern browser (Chrome, Edge, Firefox, Safari)
- An active internet connection (calls the Anthropic API and loads Google Fonts)
- The Anthropic API key is handled by the Claude.ai artifact environment — no key configuration required when running through Claude.ai

> **Note:** If running the file outside of Claude.ai (e.g. directly in a browser from GitHub Pages), the Anthropic API calls will fail unless you modify the fetch headers to include your own API key. See [API Configuration](#api-configuration) below.

---

## Hosting on GitHub Pages

This repo is configured for GitHub Pages deployment from the `main` branch.

The live URL will be:
```
https://<your-github-username>.github.io/brand-studio
```

Access requires GitHub authentication because this is a private repo with Pages enabled via GitHub Pro.

### Manual deploy

1. Edit `index.html`
2. Commit and push to `main`
3. GitHub Pages rebuilds automatically (usually under 60 seconds)

### Automated deploy (GitHub Actions)

A workflow file is included at `.github/workflows/deploy.yml`. It triggers on every push to `main` and deploys to GitHub Pages automatically. No additional configuration needed beyond enabling Pages in repo settings.

To enable:
1. Go to repo **Settings → Pages**
2. Set Source to **GitHub Actions**
3. Push any change to `main` to trigger the first deploy

---

## API Configuration

When running through Claude.ai, the Anthropic API key is injected automatically by the artifact environment.

If you want to run the file standalone (outside Claude.ai), you need to add your API key to the fetch headers in the `claude()` function in the script:

```javascript
async function claude(messages, sys=SYS_BASE, maxTok=2500){
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY_HERE',        // add this line
      'anthropic-version': '2023-06-01',        // add this line
      'anthropic-dangerous-direct-browser-access': 'true'  // add this line
    },
    ...
  })
}
```

> Do not commit your API key to the repo. Use an environment variable or a local config file excluded via `.gitignore` if building a more permanent standalone version.

---

## File Structure

```
brand-studio/
├── index.html          # The entire application — single self-contained file
├── README.md           # This file
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions Pages deployment
```

---

## Iteration

To update the tool:

1. Open Brand Studio in Claude.ai (start a new conversation or continue an existing one)
2. Ask Claude to make changes — the full source is in this repo
3. Download the updated HTML file
4. Rename to `index.html`, replace the existing file
5. Commit and push — the Actions workflow deploys it automatically

Suggested improvements to build next:
- DOCX letterhead generator using the approved logo SVG and color tokens
- Social asset generator — sized SVG templates using the brand palette
- Figma token export (Style Dictionary compatible JSON)
- Multi-brand project switcher — save and reload brand configs via localStorage

---

## Built With

- Claude Sonnet (Anthropic) — all generation steps
- Atkinson Hyperlegible — UI font (Braille Institute, optimised for low vision)
- Fraunces — display font
- JetBrains Mono — code and label font
- Google Fonts API — brand typography loading in output previews
- Vanilla HTML/CSS/JS — no framework, no build toolchain

---

## License

Private. Not for distribution.
