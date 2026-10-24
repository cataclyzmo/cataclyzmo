#!/usr/bin/env python3
"""Convert published PNG artwork to lossless, display-sized WebP.

Requires Pillow with WebP support. Run from any directory. Original PNGs remain
available in Git history after conversion.
"""

from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import re

from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
# The favicon/logo and social preview need broad PNG support.
KEEP_PNG = {"logo.png", "banner.png"}
TEXT_TYPES = {".html", ".css", ".js", ".md"}


def convert(source: Path) -> tuple[str, int, int] | None:
    target = source.with_suffix(".webp")
    with Image.open(source) as image:
        image.load()
        width, height = image.size
        # Portraits and book covers render at no more than 500 CSS px high;
        # wide team artwork renders at no more than 640 CSS px wide.
        if width > height:
            max_size = (1280, 1280)
        else:
            max_size = (1000, 1000)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        image.save(
            target, "WEBP", lossless=True, method=6,
            icc_profile=image.info.get("icc_profile", b""),
        )
        with Image.open(target) as decoded:
            decoded.load()
            if decoded.size != image.size or ImageChops.difference(
                decoded.convert("RGBA"), image.convert("RGBA")
            ).getbbox():
                target.unlink()
                raise ValueError(f"WebP pixels differ from resized source: {source}")
    if target.stat().st_size >= source.stat().st_size:
        target.unlink()
        return None
    return source.name, source.stat().st_size, target.stat().st_size


def main() -> None:
    sources = sorted(p for p in IMAGES.glob("*.png") if p.name not in KEEP_PNG)
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(convert, sources))
    converted = [result for result in results if result]
    replacements = {name: Path(name).with_suffix(".webp").name for name, _, _ in converted}

    for path in ROOT.rglob("*"):
        if path.suffix not in TEXT_TYPES or ".git" in path.parts:
            continue
        original = path.read_text()
        updated = re.sub(
            r"(?<=images/)[\w.-]+\.png",
            lambda match: replacements.get(match.group(), match.group()),
            original,
        )
        if updated != original:
            path.write_text(updated)

    for name, _, _ in converted:
        (IMAGES / name).unlink()

    before = sum(before for _, before, _ in converted)
    after = sum(after for _, _, after in converted)
    print(f"Converted {len(converted)} images: {before / 1e6:.1f} MB → {after / 1e6:.1f} MB")
    skipped = len(sources) - len(converted)
    if skipped:
        print(f"Kept {skipped} PNGs because lossless WebP was not smaller.")


if __name__ == "__main__":
    main()
