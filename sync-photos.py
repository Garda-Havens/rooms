#!/usr/bin/env python3
"""
Run this script whenever you add or remove photos from a room folder.
- Renames any non-sequential files (e.g. IMG_5177.jpeg) to 1.jpeg, 2.jpeg, …
- Rewrites the ROOM_PHOTOS block in slideshow.js.

Usage:  python3 sync-photos.py
"""

import os, re

BASE   = os.path.dirname(os.path.abspath(__file__))
STATIC = os.path.join(BASE, 'static')
JS     = os.path.join(BASE, 'static', 'slideshow.js')
ROOMS  = [1, 2, 3, 4, 5, 6]
EXTS   = {'.jpeg', '.jpg', '.png', '.webp'}

def natural_key(name):
    parts = re.split(r'(\d+)', name)
    return [int(p) if p.isdigit() else p.lower() for p in parts]

def is_sequential(name):
    """True if filename is already a plain number, e.g. '7.jpeg'"""
    stem = os.path.splitext(name)[0]
    return stem.isdigit()

room_photos = {}

for r in ROOMS:
    folder = os.path.join(STATIC, str(r))
    if not os.path.isdir(folder):
        room_photos[r] = []
        continue

    files = sorted(
        [f for f in os.listdir(folder) if os.path.splitext(f)[1].lower() in EXTS],
        key=natural_key
    )

    # Rename non-sequential files to 1.jpeg, 2.jpeg, …
    # Use a temp prefix to avoid collisions during renaming
    needs_rename = [f for f in files if not is_sequential(f)]
    if needs_rename:
        print(f'  Room {r}: renaming {len(needs_rename)} file(s)…')
        # First pass: rename all to tmp_N.jpeg
        for i, fname in enumerate(files, start=1):
            src = os.path.join(folder, fname)
            tmp = os.path.join(folder, f'__tmp_{i}.jpeg')
            os.rename(src, tmp)
        # Second pass: rename tmp_N.jpeg → N.jpeg
        tmp_files = sorted(
            [f for f in os.listdir(folder) if f.startswith('__tmp_')],
            key=natural_key
        )
        for tmp in tmp_files:
            n = re.search(r'__tmp_(\d+)', tmp).group(1)
            dst = os.path.join(folder, f'{n}.jpeg')
            os.rename(os.path.join(folder, tmp), dst)
        # Re-read after rename
        files = sorted(
            [f for f in os.listdir(folder) if os.path.splitext(f)[1].lower() in EXTS],
            key=natural_key
        )

    room_photos[r] = [f'static/{r}/{f}' for f in files]
    print(f'  Room {r}: {len(files)} photo(s) → {files}')

# Build the new ROOM_PHOTOS block
lines = ['const ROOM_PHOTOS = {\n']
for r in ROOMS:
    photos = room_photos[r]
    if not photos:
        lines.append(f'  {r}: [],\n')
        continue
    formatted = ',\n    '.join(f"'{p}'" for p in photos)
    lines.append(f'  {r}: [\n    {formatted},\n  ],\n')
lines.append('};\n')
new_block = '// ── Photo sets — add or remove a path to change what appears in each room ──\n' + ''.join(lines)

with open(JS, 'r') as f:
    content = f.read()

updated = re.sub(
    r'(?s)// ── Photo sets.*?^};',
    new_block.rstrip('\n'),
    content,
    count=1,
    flags=re.MULTILINE
)

with open(JS, 'w') as f:
    f.write(updated)

print('\nslideshow.js updated.')
