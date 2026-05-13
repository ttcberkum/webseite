"""
Generiert WebP-Thumbnails (Seite 1) für alle Kelle-PDFs.

Aufruf:
    py scripts/generate-kelle-thumbnails.py

Dependencies (einmalig installieren):
    py -m pip install pymupdf pillow

Input:  public/pdfs/kellen/*.pdf
Output: public/images/kelle/kelle-<nr>.webp
"""

import os
import re
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("Fehlt: pymupdf. Installation: py -m pip install pymupdf pillow")

ROOT = Path(__file__).resolve().parent.parent
PDF_DIR = ROOT / "public" / "pdfs" / "kellen"
OUT_DIR = ROOT / "public" / "images" / "kelle"
TARGET_WIDTH = 600  # px

OUT_DIR.mkdir(parents=True, exist_ok=True)

count = 0
for pdf_path in sorted(PDF_DIR.glob("*.pdf")):
    m = re.search(r"(\d+)", pdf_path.stem)
    if not m:
        print(f"  [SKIP] Konnte keine Nummer aus '{pdf_path.name}' extrahieren")
        continue
    number = int(m.group(1))
    out_path = OUT_DIR / f"kelle-{number}.webp"

    doc = fitz.open(pdf_path)
    page = doc[0]
    # Skaliere so, dass die Breite ~TARGET_WIDTH ergibt
    zoom = TARGET_WIDTH / page.rect.width
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
    pix.pil_save(out_path, format="WEBP", quality=82, method=6)
    doc.close()

    print(f"  [OK]{pdf_path.name} ->{out_path.relative_to(ROOT)}")
    count += 1

print(f"\n{count} Thumbnail(s) erzeugt in {OUT_DIR.relative_to(ROOT)}{os.sep}")
