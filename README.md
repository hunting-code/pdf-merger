# MergeFlow — PDF & Image Merger

A free, fast, browser-based tool to merge multiple PDF files and images into a single PDF — with no uploads, no installs, and no watermarks.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![pdf-lib](https://img.shields.io/badge/pdf--lib-1.17.1-blue?style=flat)

---

## What it does

MergeFlow lets you combine PDF files and images into one polished PDF document — entirely in your browser. No file is ever sent to a server.

- Upload PDFs, PNGs, JPGs, JPEGs, and WEBPs
- Drag and drop to reorder files before merging
- Sort files alphabetically with one click
- Remove individual files or clear all
- Live progress bar during merge
- Download the merged PDF instantly
- Dark mode support
- Fully responsive — works on mobile too

---

## Tech stack

| Library | Purpose |
|---|---|
| [pdf-lib](https://pdf-lib.js.org/) v1.17.1 | PDF creation and merging in the browser |
| [JSZip](https://stuk.github.io/jszip/) v3.10.1 | Supporting file operations |
| Vanilla JS + CSS | UI, drag-and-drop, theming |

No frameworks. No backend. No dependencies to install.

---

## Getting started

Since MergeFlow is a pure front-end project, there's nothing to install.

**Option 1 — Open directly**

Just open `index.html` in any modern browser:

```bash
git clone https://github.com/hunting-code/pdf-merger.git
cd pdf-merger
open index.html        # Mac
start index.html       # Windows
xdg-open index.html    # Linux
```

**Option 2 — Serve locally** (recommended to avoid browser file restrictions)

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
```

Then visit `http://localhost:8000` in your browser.

---

## How to use

1. **Upload** — click the upload area or drag and drop your PDF/image files
2. **Arrange** — drag files to reorder them, or click the sort button to sort alphabetically
3. **Merge** — click the Merge Files button and wait for processing
4. **Download** — your merged PDF downloads automatically

---

## Project structure

```
pdf-merger/
├── index.html      # App structure and layout
├── styles.css      # Styling, animations, dark mode
├── script.js       # File handling, merge logic, UI interactions
└── README.md       # This file
```

---

## Browser support

Works in all modern browsers that support the File API and ES6+:

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

[MIT](https://choosealicense.com/licenses/mit/)
