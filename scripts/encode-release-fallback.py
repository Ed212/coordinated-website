"""Reproduce the lossless release fallback with Pillow + libwebp (no resizing).

The checked-in delivery was generated with libwebp 1.6.0. Encoding versions can
produce different bytes; do not refresh the manifest without reviewing identity.
CI independently compares every decoded RGBA byte in the release browser check.
"""
from hashlib import sha256
from pathlib import Path
from PIL import Image
import json

root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / 'assets/video/deep-space-final-frame-lossless.json').read_text())
source = root / manifest['source']['file']
assert sha256(source.read_bytes()).hexdigest() == manifest['source']['sha256']
original = Image.open(source)
assert original.mode == 'RGB' and original.size == (manifest['width'], manifest['height'])
target = root / manifest['file']
original.save(target, format='WEBP', lossless=True, quality=100, method=6)
with Image.open(target) as decoded:
    assert decoded.size == original.size
    assert decoded.convert('RGBA').tobytes() == original.convert('RGBA').tobytes()
    assert sha256(decoded.convert('RGBA').tobytes()).hexdigest() == manifest['decodedRgbaSha256']
assert sha256(target.read_bytes()).hexdigest() == manifest['sha256']
print(f'PASS exact {original.width} x {original.height} pixels; {source.stat().st_size} -> {target.stat().st_size} bytes')
