# Personal Portfolio — 8-Phase Cinematic Website

A single-page, scroll-driven portfolio. Each of the eight phases has its own wallpaper, colour palette, and layout, and a finale closes the story with your contact details.

This is a plain **HTML / CSS / JavaScript** site. It has no build step and no packages to install.

---

## Files you will edit

| What you want to change | Where |
|---|---|
| Your name, role, tagline, contact details, social links | `assets/js/content.js` → `owner` |
| The text of each phase (headings, paragraphs, projects, skills, steps) | `assets/js/content.js` → `phases` |
| Finale (contact) heading and text | `assets/js/content.js` → `finale` |
| Wallpaper images | `assets/wallpapers/phase-1.jpg` … `phase-8.jpg` |
| Colours, fonts, spacing | `assets/css/styles.css` (top section: "Design tokens") |

Everything in `[square brackets]` is a placeholder. Replace it with your own text.

---

## 1. Preview the site

**Important on Windows:** extract the ZIP first (right-click → *Extract All…*). Do not open `index.html` from inside the ZIP. Then open the `unique-web` folder and double-click `index.html`. See `START-HERE.txt` for pictures-free step-by-step help.

**Simplest:** double-click `index.html` in the extracted folder to open it in your browser.

**Or run a local server** (recommended, closest to the published site). Open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

---

## 2. Add your wallpapers

1. Put your eight original images in `assets/wallpapers/originals/`. The names must include `phase` and a number, e.g. `phase 1.png`.
2. Install the image tool once: `pip install pillow`
3. From this folder, run: `python3 scripts/optimize-wallpapers.py`
4. This creates `assets/wallpapers/phase-1.jpg` to `phase-8.jpg`, compressed for fast loading.
5. Refresh the preview.

Until an image is added, its phase shows a colour gradient. The site still works, and the browser console lists any missing files.

---

## 3. Edit your content

Open `assets/js/content.js` in any text editor. Change text inside the quotation marks. Keep the commas and quotation marks in place. A missing comma or quotation mark will break the page, and the site will show a message saying where to look.

---

## 3b. Optional features (edit in content.js)

- **Interactive terminal** (Skills phase): the `terminal` block. Its answers come from the text in `content.js`. Type `help` on the page to see the commands.
- **SQL demo** (Selected Projects phase): the `sqlDemo` block. It runs a real SQLite database in the browser. The student rows are made-up practice data. The engine file is `assets/vendor/sql.js/sql-asm.js` (MIT licence, see `LICENSE.txt` in that folder). It loads only when someone runs a query.
- **Project details**: each project can have `repo` (your GitHub repository link), `details` (a list of facts), `demo` and `demoLabel`. Leave any of them empty until the real information is ready. Empty links show "not available yet", and no link is invented.

## 4. Save your changes (Git and GitHub)

The project lives in the GitHub repository `princemaalha-commits/unique-web`.

- **With GitHub Desktop:** choose *Commit to main* (or your branch), write a short message such as "Update content", then click *Push origin*.
- **On github.com:** open the file, click the pencil icon, make your edit, then click *Commit changes*.
- **With Git in a terminal:** `git add .` → `git commit -m "Update content"` → `git push`.

---

## 5. Publish the website (GitHub Pages)

1. On github.com, open the repository → **Settings** → **Pages**.
2. Under *Build and deployment*, set **Source** to *Deploy from a branch*.
3. Choose branch **main** and folder **/ (root)**, then click **Save**.
4. After a minute or two, GitHub shows your live address, usually `https://princemaalha-commits.github.io/unique-web/`.

Every later push to `main` updates the live site automatically.

---

## Accessibility and performance built in

- Respects the visitor's *Reduce motion* setting: animations switch off and content stays visible.
- Keyboard navigation, visible focus outlines, skip link, labelled menu and dots.
- Wallpapers load only for the current and neighbouring phases.
- Animations use only `transform` and `opacity`, so they stay smooth.
- Works on desktop, laptop, tablet, and mobile. On small screens the side dots hide and the menu button is used instead.
