"""Generate the original, pixel-style 600x600 Douyin game icon."""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "douyin" / "icon.png"
SCALE = 4
im = Image.new("RGB", (150, 150), "#dce9b9")
d = ImageDraw.Draw(im)

def rect(box, fill):
    d.rectangle(box, fill=fill)

# Green field and warm sky, all hard-edged to match the in-game pixel art.
rect((0, 0, 149, 149), "#bddba0")
rect((0, 0, 149, 78), "#d7e9c4")
rect((0, 102, 149, 149), "#6b9e62")
for x, y in [(8, 25), (22, 13), (116, 15), (132, 31), (13, 76), (130, 78)]:
    rect((x, y, x + 11, y + 5), "#f2f6db")
    rect((x + 3, y - 3, x + 8, y + 8), "#f2f6db")

# A square diary cover represents the annual life choices.
rect((26, 16, 126, 136), "#4b3e31")
rect((30, 20, 122, 132), "#f6e6b6")
rect((37, 27, 115, 125), "#fff3d2")
rect((30, 20, 38, 132), "#bc7047")
rect((35, 20, 39, 132), "#6f4732")
for y in [34, 51, 68, 85, 102, 119]:
    rect((32, y, 43, y + 3), "#6f4732")

# A growing tree: the family line continues across generations.
rect((77, 63, 84, 104), "#78513a")
rect((65, 84, 95, 91), "#78513a")
rect((57, 44, 101, 79), "#3d8050")
rect((65, 35, 94, 83), "#4f9958")
rect((72, 29, 87, 84), "#67ad62")
rect((51, 57, 108, 68), "#67ad62")
for x, y in [(69, 45), (90, 51), (59, 62), (82, 38)]:
    rect((x, y, x + 6, y + 6), "#a5ce72")

# Three warm-colored figures under the tree, drawn as simple 8-bit silhouettes.
for x, head, body in [(57, "#e5b68d", "#a65d56"), (79, "#f0c09a", "#547aa1"), (99, "#ecc296", "#d5a653")]:
    rect((x, 96, x + 8, 104), head)
    rect((x - 2, 105, x + 10, 118), body)
    rect((x, 119, x + 3, 125), "#5f523e")
    rect((x + 5, 119, x + 8, 125), "#5f523e")

# A thin frame makes the square asset legible against light app surfaces.
rect((0, 0, 149, 4), "#496b43")
rect((0, 145, 149, 149), "#496b43")
rect((0, 0, 4, 149), "#496b43")
rect((145, 0, 149, 149), "#496b43")

im.resize((600, 600), Image.Resampling.NEAREST).save(OUT, optimize=True)
print(OUT)
