#!/usr/bin/env python3
"""
Converts your original wallpapers into web-ready JPG files for the site.

HOW TO USE
  1. Put your original images in:   assets/wallpapers/originals/
     File names must contain "phase" and a number 1-8, for example:
     "phase 1.png", "phase-2.jpg", "Phase_3.jpeg"
  2. Install Pillow once (only needed the first time):
        pip install pillow
  3. From the project folder, run:
        python3 scripts/optimize-wallpapers.py
  4. Output files appear in assets/wallpapers/ as phase-1.jpg ... phase-8.jpg

The originals folder is listed in .gitignore, so large originals are not
uploaded to GitHub. Only the optimised phase-N.jpg files are published.
"""

import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is not installed. Run:  pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "wallpapers" / "originals"
OUT = ROOT / "assets" / "wallpapers"
MAX_WIDTH = 2400   # pixels. Enough for large screens without huge files.
QUALITY = 82       # 0-100. 80-85 looks very close to the original.
EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


def main():
    SRC.mkdir(parents=True, exist_ok=True)

    found = {}
    for path in sorted(SRC.iterdir()):
        if path.suffix.lower() not in EXTENSIONS:
            continue
        match = re.search(r"phase[\s_-]*(\d)", path.stem, re.IGNORECASE)
        if not match or not 1 <= int(match.group(1)) <= 8:
            print(f"Skipped {path.name}: name must include 'phase' and a number from 1 to 8.")
            continue
        number = int(match.group(1))
        if number in found:
            print(f"Warning: both {found[number].name} and {path.name} are for phase {number}. Using {found[number].name}.")
            continue
        found[number] = path

    if not found:
        print(f"No wallpapers found in {SRC.relative_to(ROOT)}/")
        return 1

    for number in sorted(found):
        source = found[number]
        with Image.open(source) as image:
            image = ImageOps.exif_transpose(image).convert("RGB")
            if image.width > MAX_WIDTH:
                height = round(image.height * MAX_WIDTH / image.width)
                image = image.resize((MAX_WIDTH, height), Image.LANCZOS)
            target = OUT / f"phase-{number}.jpg"
            image.save(target, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        size_kb = target.stat().st_size // 1024
        print(f"Phase {number}: {source.name} -> {target.relative_to(ROOT)} ({size_kb} KB)")

    missing = [n for n in range(1, 9) if n not in found]
    if missing:
        print("Still missing phases:", ", ".join(str(n) for n in missing))
    else:
        print("All 8 phases are ready.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
