# Wallpapers — how to add your 8 JPG images (Windows)

The website looks for **exactly these 8 file names** in this folder:

```
phase-1.jpg   phase-2.jpg   phase-3.jpg   phase-4.jpg
phase-5.jpg   phase-6.jpg   phase-7.jpg   phase-8.jpg
```

Until a file exists, its phase shows a colour gradient instead. Nothing breaks.

## Step 1 — Find your 8 images

Make sure you have all eight JPG files together in one folder on your laptop, such as `Downloads`.

## Step 2 — Match each image to a phase

Open each image and check it against this list. Each phase has a different look, so you can match them by eye.

| File name to use | Phase | What the wallpaper looks like |
|---|---|---|
| `phase-1.jpg` | 1 — Opening (hero) | Black marble pillars with gold ribbon arcs |
| `phase-2.jpg` | 2 — Origin (about) | Neon blue-and-purple city skyline |
| `phase-3.jpg` | 3 — Journey (timeline) | Pale dusk sky with a floating stone temple |
| `phase-4.jpg` | 4 — Mindset | Stone portal opening onto a starfield |
| `phase-5.jpg` | 5 — Capabilities (skills) | Dark teal city with light on the right |
| `phase-6.jpg` | 6 — Selected work | Maroon and bronze sculptural shapes |
| `phase-7.jpg` | 7 — Approach | Beige plaster arches and steps |
| `phase-8.jpg` | 8 — Now (current focus) | Polished chrome ribbons on charcoal |

The finale (Contact) at the bottom of the site reuses the **Phase 1** image on purpose.

## Step 3 — Rename each file

1. Open the folder with your images in **File Explorer**.
2. Click one image once to select it.
3. Press **F2** on your keyboard. The file name becomes editable.
4. Type the new name, for example `phase-1.jpg`, and press **Enter**.
5. Repeat for all eight images.

> Tip: If Windows hides the `.jpg` ending, click **View → Show → File name extensions** at the top of File Explorer, so you can see it.

## Step 4 — Copy the files into the project

1. Open File Explorer and go to the project folder, then the `assets` folder, then `wallpapers`. The full path looks like `...\unique-web\assets\wallpapers`.
2. Select all eight renamed files (click the first, then Shift-click the last) and press **Ctrl + C**.
3. Click inside the `wallpapers` folder and press **Ctrl + V**.
4. You should now see `phase-1.jpg` to `phase-8.jpg` next to this `README.md` file.

## Step 5 — Check the result

Refresh the preview in your browser. Each phase should now show its own wallpaper when you scroll to it.

If a wallpaper does not appear, check that the name is spelled exactly as shown above, all lowercase, with a dash and no space (for example `phase-3.jpg`, not `phase 3.jpg`).

## Optional — Make the pictures load faster

Very large photos slow the site down. If your images are big, you can shrink them automatically:

1. Put your original files in the `originals` folder inside this folder.
2. Install Python from python.org, then open a terminal in the project folder and run:
   `pip install pillow`
   then `python scripts/optimize-wallpapers.py`
3. The script writes the optimised `phase-1.jpg` to `phase-8.jpg` into this folder.

To change which image a phase uses, edit the `wallpaper:` line for that phase in `assets/js/content.js`.
