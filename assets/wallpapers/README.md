# Wallpapers

Each phase of the website uses one wallpaper. Put the finished images **in this folder** with these exact names:

| File name        | Phase | Used for                         |
|------------------|-------|----------------------------------|
| `phase-1.jpg`    | 1     | Opening (hero) and Contact       |
| `phase-2.jpg`    | 2     | Origin / About                   |
| `phase-3.jpg`    | 3     | Journey / Timeline               |
| `phase-4.jpg`    | 4     | Mindset / Principles             |
| `phase-5.jpg`    | 5     | Capabilities / Skills            |
| `phase-6.jpg`    | 6     | Selected Work                    |
| `phase-7.jpg`    | 7     | Approach                         |
| `phase-8.jpg`    | 8     | Now / Current focus              |

**Tips**

- Use landscape images (for example 16:9). Wider is better.
- Easiest route: put your original files in `originals/`, then run `python3 scripts/optimize-wallpapers.py` (see the main README).
- Until a file exists, its phase shows a colour gradient instead. The site still works.
- To change which image a phase uses, edit the `wallpaper:` line for that phase in `assets/js/content.js`.
