from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "payload" / "assets"
CELL = (128, 176)
OCCUPIED_COLUMNS = (11, 11, 11, 11, 7, 8, 12, 12, 10, 10, 10, 12, 12)


def cover(image: Image.Image, size: tuple[int, int], anchor: tuple[float, float]) -> Image.Image:
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = round((resized.width - size[0]) * anchor[0])
    top = round((resized.height - size[1]) * anchor[1])
    left = min(max(left, 0), resized.width - size[0])
    top = min(max(top, 0), resized.height - size[1])
    return resized.crop((left, top, left + size[0], top + size[1]))


def build_theme_assets() -> None:
    master = Image.open(ASSETS / "totoro-night-master.png").convert("RGB")
    cover(master, (1240, 889), (0.58, 0.5)).save(
        ASSETS / "totoro-night-full-canvas.webp", "WEBP", quality=86, method=6
    )

    sidebar = cover(master, (98, 644), (0.05, 0.48)).filter(
        ImageFilter.GaussianBlur(1.4)
    )
    sidebar = ImageEnhance.Color(sidebar).enhance(0.45)
    sidebar = Image.blend(sidebar, Image.new("RGB", sidebar.size, "#090b0a"), 0.58)
    sidebar.save(
        ASSETS / "totoro-night-sidebar-wash.webp", "WEBP", quality=82, method=6
    )


def build_pet_sheet() -> None:
    cutout = Image.open(ASSETS / "totoro-cutout.png").convert("RGBA")
    bbox = cutout.getchannel("A").getbbox()
    if not bbox:
        raise ValueError("Totoro cutout has no visible pixels")
    subject = cutout.crop(bbox)
    sheet = Image.new("RGBA", (CELL[0] * 12, CELL[1] * len(OCCUPIED_COLUMNS)))

    for row, occupied in enumerate(OCCUPIED_COLUMNS):
        for column in range(occupied):
            phase = (column % 6) / 6
            height = 160 + round(4 * abs(0.5 - phase))
            width = max(1, round(subject.width * height / subject.height))
            sprite = subject.resize((width, height), Image.Resampling.LANCZOS)

            if row in {2, 9, 10, 11, 12} and column >= occupied // 2:
                sprite = ImageOps.mirror(sprite)
            angle = ((column % 5) - 2) * (1.15 if row in {1, 3, 5, 8} else 0.45)
            if row in {5, 6}:
                angle *= 1.8
            sprite = sprite.rotate(angle, Image.Resampling.BICUBIC, expand=True)

            bob = round(4 * (1 - abs(phase * 2 - 1)))
            if row in {3, 8}:
                bob += round(7 * (column % 3 == 1))
            cell_left = column * CELL[0]
            cell_top = row * CELL[1]
            x = cell_left + (CELL[0] - sprite.width) // 2 + ((column % 3) - 1)
            y = cell_top + CELL[1] - sprite.height - 4 - bob
            sheet.alpha_composite(sprite, (x, y))

    output = ASSETS / "totoro-pet-spritesheet.webp"
    sheet.save(output, "WEBP", quality=82, method=6)
    if output.stat().st_size > 1_309_110:
        raise ValueError(f"Totoro spritesheet exceeds Codex slot: {output.stat().st_size}")


if __name__ == "__main__":
    build_theme_assets()
    build_pet_sheet()
    print("Built Totoro Night theme assets and pet spritesheet.")
