"""Compress photos for the photo gallery site.

Reads raw photos from INPUT_DIR, generates:
- Thumbnails (THUMB_SIZE px, quality THUMB_QUALITY) → thumbs/
- Lightbox (LIGHTBOX_SIZE px, quality LIGHTBOX_QUALITY) → lightbox/

EXIF data is intentionally NOT preserved — this is a security requirement.
GPS coordinates, camera serial numbers, and timestamps must never appear
in publicly served images.
"""

import os
import sys
from PIL import Image, ImageOps

# ——— Configuration ———
THUMB_SIZE = 300
THUMB_QUALITY = 75
LIGHTBOX_SIZE = 1920
LIGHTBOX_QUALITY = 85

INPUT_DIR = sys.argv[1] if len(sys.argv) > 1 else "raw"
OUTPUT_DIR = sys.argv[2] if len(sys.argv) > 2 else "public"


def process_city(city_name: str):
    src = os.path.join(INPUT_DIR, city_name)
    if not os.path.isdir(src):
        print(f"  SKIP: {src} not found")
        return

    thumbs_dir = os.path.join(OUTPUT_DIR, city_name, "thumbs")
    lightbox_dir = os.path.join(OUTPUT_DIR, city_name, "lightbox")
    os.makedirs(thumbs_dir, exist_ok=True)
    os.makedirs(lightbox_dir, exist_ok=True)

    files = sorted(f for f in os.listdir(src) if f.lower().endswith((".jpg", ".jpeg", ".png")))
    if not files:
        print(f"  No images in {src}")
        return

    print(f"  {city_name}: {len(files)} photos")
    for f in files:
        path = os.path.join(src, f)
        img = Image.open(path)

        # Apply EXIF orientation BEFORE resizing (critical for phone photos)
        img = ImageOps.exif_transpose(img)

        # Thumbnail — EXIF is NOT preserved (security: no GPS, no serial numbers)
        thumb = img.copy()
        thumb.thumbnail((THUMB_SIZE, THUMB_SIZE), Image.LANCZOS)
        thumb.save(os.path.join(thumbs_dir, f), "JPEG", quality=THUMB_QUALITY, optimize=True)

        # Lightbox — EXIF is NOT preserved
        lb = img.copy()
        lb.thumbnail((LIGHTBOX_SIZE, LIGHTBOX_SIZE), Image.LANCZOS)
        lb.save(os.path.join(lightbox_dir, f), "JPEG", quality=LIGHTBOX_QUALITY, optimize=True)

    print(f"    done: {len(files)} → thumbs + lightbox")


if __name__ == "__main__":
    cities = [d for d in os.listdir(INPUT_DIR) if os.path.isdir(os.path.join(INPUT_DIR, d))]
    if not cities:
        print(f"Usage: python scripts/compress-photos.py <input_dir> [output_dir]")
        print(f"  input_dir should contain subdirectories per city (e.g. raw/suzhou/*.jpg)")
        sys.exit(1)

    print(f"Processing {len(cities)} cities from {INPUT_DIR}/")
    for city in sorted(cities):
        process_city(city)
    print("All done.")
