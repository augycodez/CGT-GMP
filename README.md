# Global GMP Intelligence Platform

A modern, beginner-friendly website for exploring Good Manufacturing Practice (GMP) guidelines from regulatory agencies worldwide — with a dedicated Cell & Gene Therapy (CGT) hub.

![GMP Platform](images/screenshot.png)

---

## What It Does

- **Global GMP Library** — Country and agency cards with guideline counts
- **Regulatory Agency Explorer** — Dedicated pages for FDA, EMA, MHRA, CDSCO, WHO, PIC/S and more
- **Cell & Gene Therapy GMP Hub** — CAR-T, AAV, Lentivirus, MSC, CRISPR, ATMP and more
- **Live Search** — Instant search across all guidelines by title, agency, country, keyword
- **PDF Viewer** — Embed local PDFs or link to official sources
- **Dark/Light Mode** — Saved in browser localStorage
- **Ask GMP AI (coming soon)** — Local LLM integration via Ollama

---

## Folder Structure

```
Global-GMP-Library/
├── index.html          ← Main homepage (start here)
├── style.css           ← All styling — design tokens, components, responsive
├── script.js           ← All JavaScript — search, cards, theme toggle
├── ask.html            ← AI Q&A page (UI ready, AI backend pending)
├── ask.js              ← AI placeholder + Ollama integration guide
│
├── data/
│   ├── guidelines.json ← ★ Add new guidelines here
│   ├── countries.json  ← Country metadata
│   └── agencies.json   ← Agency metadata
│
├── agencies/
│   ├── fda.html        ← Full FDA page with guidelines
│   ├── ema.html        ← Stub — add content
│   ├── mhra.html       ← Stub
│   ├── cdsco.html      ← Stub
│   ├── who.html        ← Stub
│   └── pics.html       ← Stub
│
├── countries/
│   ├── usa.html, india.html, uk.html, japan.html, australia.html
│
├── cgt/
│   ├── car-t.html, car-nk.html, msc.html, stemcells.html
│   ├── aav.html, lentivirus.html, crispr.html
│
├── pdfs/
│   ├── FDA/            ← Place downloaded FDA PDFs here
│   ├── EMA/
│   ├── CDSCO/
│   ├── WHO/
│   ├── PICS/
│   └── MHRA/
│
└── images/             ← Logos, screenshots
```

---

## Quick Start

### Method 1 — VS Code Live Server (Recommended)

1. Open the `Global-GMP-Library/` folder in VS Code
2. Install the **Live Server** extension (Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. Opens at `http://127.0.0.1:5500/`

### Method 2 — Python Local Server

```bash
cd Global-GMP-Library
python3 -m http.server 8080
# Open: http://localhost:8080
```

> ⚠️ Do NOT open `index.html` directly by double-clicking — the JSON data fetch will fail without a local server.

---

## Adding Guidelines

Edit `data/guidelines.json` and add a new entry:

```json
{
  "id": "CDSCO003",
  "title": "Your Guideline Title",
  "country": "India",
  "agency": "CDSCO",
  "category": "Cell and Gene Therapy",
  "year": "2024",
  "description": "Brief description of the guideline.",
  "pdf": "pdfs/CDSCO/your-file.pdf",
  "external": "https://cdsco.gov.in",
  "keywords": ["stem cell", "India", "CGT"]
}
```

The new guideline will immediately appear in:
- Search results
- The All Guidelines section
- Category filter results

---

## Adding PDF Documents

1. Download the PDF from the official agency website
2. Place it in the correct `pdfs/<AGENCY>/` folder
3. Update the `"pdf"` field in `guidelines.json` to match the path

Example:
```
pdfs/CDSCO/stemcell-guidelines-2017.pdf
```

```json
"pdf": "pdfs/CDSCO/stemcell-guidelines-2017.pdf"
```

---

## AI Integration (Coming Soon)

The `ask.html` page has the UI ready. To connect a local LLM:

1. Install [Ollama](https://ollama.ai)
2. Pull a model: `ollama pull qwen3`
3. Follow the integration instructions in `ask.js`

---

## Built With

- HTML5 · CSS3 · Vanilla JavaScript
- Google Fonts: Inter + DM Mono
- JSON files for all data
- No frameworks, no database, no build step

---

## Contributing

1. Fork this repository
2. Add guidelines to `data/guidelines.json`
3. Add content to agency/country pages
4. Place PDFs in `pdfs/` folders
5. Submit a pull request

---

## Disclaimer

This platform is a community reference resource. Always verify regulatory guidance with official agency sources. Not legal or regulatory advice.

---

## License

MIT License — free to use, modify, and distribute.
