#!/usr/bin/env python3
"""Extrae filas + imágenes de los 9 Words fuente a _inventario-raw.json y _media/."""

from __future__ import annotations

import hashlib
import json
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

REPO = Path(__file__).resolve().parents[2]
FOLDER = REPO / "docs" / "words-solicitudes-correccion"
MEDIA_OUT = FOLDER / "_media"

FILES = [
    ("1", "1. Cambios de contenidos_web www.inapi.cl.docx", "https://www.inapi.cl/"),
    ("2", "2. Cambios de contenidos_web www.inapi.cl marcas.docx", "https://www.inapi.cl/marcas"),
    ("3", "3. Cambios de contenidos_web www.inapi.cl patentes.docx", "https://www.inapi.cl/patentes"),
    ("4", "4. Cambios de contenidos_web INAPI web acercade.docx", "https://www.inapi.cl/acerca-de/inapi"),
    ("5", "5. Cambios de contenidos_web INAPI buscador.docx", "https://www.inapi.cl/buscador"),
    (
        "6",
        "6. Cambios de contenidos_web INAPI solicitud_nueva.docx",
        "https://www.inapi.cl/marcas/tramites/solicitud-nueva",
    ),
    (
        "7",
        "7. Cambios de contenidos_web_INAPI_sala_de_prensa_completo.docx",
        "https://www.inapi.cl/sala-de-prensa/noticias",
    ),
    (
        "8",
        "8. Cambios de contenidos_web www.inapi.cl cuenta publica participativa.docx",
        "https://www.inapi.cl/sala-de-prensa/detalle-noticia/inapi-realizo-su-cuenta-publica-participativa-2026-en-valparaiso-y-reforzo-compromiso-con-la-descentralizacion-de-la-propiedad-industrial",
    ),
    (
        "9",
        "9. Cambios de contenidos_web www.inapi.cl cifra historica de patentes nacionales.docx",
        "https://www.inapi.cl/sala-de-prensa/detalle-noticia/chile-alcanza-su-mayor-cifra-de-solicitudes-de-patentes-nacionales-en-mas-de-una-decada",
    ),
]


def cell_paras(tc: ET.Element) -> str:
    paras: list[str] = []
    for p in tc.findall(".//" + W + "p"):
        texts: list[str] = []
        for t in p.findall(".//" + W + "t"):
            texts.append(t.text or "")
        line = "".join(texts).strip()
        if line:
            paras.append(line)
    return "\n".join(paras)


def cell_image_rids(tc: ET.Element) -> list[str]:
    rids: list[str] = []
    for blip in tc.findall(".//" + A + "blip"):
        rid = blip.attrib.get(R + "embed")
        if rid:
            rids.append(rid)
    return rids


def main() -> None:
    MEDIA_OUT.mkdir(parents=True, exist_ok=True)
    rows_out: list[dict] = []

    for src_id, fname, default_url in FILES:
        path = FOLDER / fname
        if not path.exists():
            raise SystemExit(f"Falta archivo fuente: {path}")
        with zipfile.ZipFile(path) as z:
            root = ET.fromstring(z.read("word/document.xml"))
            rels = ET.fromstring(z.read("word/_rels/document.xml.rels"))
            rid_map = {
                rel.attrib["Id"]: rel.attrib["Target"]
                for rel in rels
                if rel.attrib.get("Id") and rel.attrib.get("Target")
            }
            tables = root.findall(".//" + W + "tbl")
            if not tables:
                raise SystemExit(f"Sin tabla en {fname}")
            trs = tables[0].findall("./" + W + "tr")
            for i, tr in enumerate(trs[1:], 1):
                cells = tr.findall("./" + W + "tc")
                if len(cells) < 5:
                    continue
                n = cell_paras(cells[0])
                link = cell_paras(cells[1]) or default_url
                original = cell_paras(cells[2])
                propuesto = cell_paras(cells[3])
                obs = cell_paras(cells[4])
                img_paths: list[str] = []
                for c in cells:
                    for rid in cell_image_rids(c):
                        tgt = rid_map.get(rid)
                        if not tgt:
                            continue
                        data = z.read("word/" + tgt)
                        src_name = tgt.split("/")[-1]
                        h = hashlib.md5(data).hexdigest()[:8]
                        out_name = f"{src_id}-{i}-{h}-{src_name}"
                        out_path = MEDIA_OUT / out_name
                        if not out_path.exists():
                            out_path.write_bytes(data)
                        img_paths.append(
                            str(out_path.relative_to(REPO)).replace("\\", "/")
                        )
                rows_out.append(
                    {
                        "source_id": src_id,
                        "source_file": fname,
                        "source_row": i,
                        "numero_original": (n.split("\n")[0].strip() if n else str(i)),
                        "link": (link.split("\n")[0].strip() if link else default_url),
                        "default_url": default_url,
                        "original": original,
                        "propuesto": propuesto,
                        "observaciones": obs,
                        "imagenes": img_paths,
                    }
                )

    out = FOLDER / "_inventario-raw.json"
    out.write_text(json.dumps(rows_out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print({"rows": len(rows_out), "out": str(out.relative_to(REPO)), "media": str(MEDIA_OUT.relative_to(REPO))})


if __name__ == "__main__":
    main()
