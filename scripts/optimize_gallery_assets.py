from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ATLAS = PUBLIC / "assets" / "atlas"
THUMB_CITIES = ("rizhao", "suzhou", "weihai", "xian", "xishuangbanna")
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp"}


def save_webp(source: Path, target: Path, *, quality: int = 82) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.save(target, "WEBP", quality=quality, method=6)


def save_thumbnail(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((960, 960), Image.Resampling.LANCZOS)
        image.save(target, "JPEG", quality=80, optimize=True, progressive=True)


def main() -> None:
    generated: list[tuple[Path, int, int]] = []

    for source in sorted((ATLAS / "gallery-backgrounds").glob("*-gallery-bg.png")):
        target = source.with_suffix(".webp")
        save_webp(source, target)
        generated.append((target, source.stat().st_size, target.stat().st_size))

    for source in sorted((ATLAS / "posters").glob("*-zine-v2.png")):
        target = source.with_suffix(".webp")
        save_webp(source, target)
        generated.append((target, source.stat().st_size, target.stat().st_size))

    for city in THUMB_CITIES:
        source_dir = PUBLIC / city / "lightbox"
        target_dir = PUBLIC / city / "thumbs"
        for source in sorted(source_dir.iterdir()):
            if source.suffix.lower() not in SUPPORTED:
                continue
            target = target_dir / source.name
            save_thumbnail(source, target)
            generated.append((target, source.stat().st_size, target.stat().st_size))

    before = sum(before for _, before, _ in generated)
    after = sum(after for _, _, after in generated)
    print(f"generated={len(generated)}")
    print(f"source_mb={before / 1024 / 1024:.2f}")
    print(f"optimized_mb={after / 1024 / 1024:.2f}")
    print(f"saved_percent={(1 - after / before) * 100:.1f}")


if __name__ == "__main__":
    main()
