#!/usr/bin/env python3
"""Dibuja marcas de color sobre capturas de pantalla y agrega una leyenda al pie.

Regla de colores
  rojo      criterios imprescindibles (1.1.x)
  amarillo  criterios esperables      (1.2.x)
  verde     criterios deseables       (1.3.x)
  gris      observaciones fuera de la pauta (opcional)

Uso: python anotar_capturas.py especificacion.json

Formato (ver assets/ejemplo_anotaciones.json). Las coordenadas son píxeles de la
imagen original: [x0, y0, x1, y1].
{
  "capturas": [
    {"archivo": "/mnt/user-data/uploads/captura_1.png",
     "salida": "/mnt/user-data/outputs/mejoras_1.png",
     "marcas": [
       {"n": 1, "nivel": "imprescindible", "cajas": [[10, 20, 300, 60]],
        "texto": "Mayúsculas innecesarias (1.1.5). Escribir «Mapa del sitio».",
        "ancla": "tl"}
     ]}
  ]
}
"ancla" es opcional: "tl" (esquina superior izquierda, por defecto) o "tr". Úsala
cuando dos etiquetas quedarían una encima de la otra.
"""
import json
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont

COL = {"I": (214, 40, 40), "E": (255, 196, 0), "D": (34, 150, 70), "O": (110, 110, 110)}
NOMBRE = {"I": "Imprescindible", "E": "Esperable", "D": "Deseable", "O": "Fuera de la pauta"}
ORDEN_DIBUJO = "IOED"   # lo amarillo y lo verde se dibujan encima
ORDEN_CLAVE = "IEDO"
OSCURO = (40, 40, 40)

RUTAS_FUENTE = ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                "/usr/share/fonts/dejavu/DejaVuSans.ttf"]
RUTAS_NEGRITA = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                 "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"]


def fuente(rutas, tam):
    for r in rutas:
        try:
            return ImageFont.truetype(r, tam)
        except OSError:
            continue
    return ImageFont.load_default()


def nivel(v):
    v = str(v).strip().lower()
    if v[:1] in ("i", "r"):      # imprescindible, rojo
        return "I"
    if v[:1] in ("e", "a"):      # esperable, amarillo
        return "E"
    if v[:1] in ("d", "v"):      # deseable, verde
        return "D"
    return "O"


def caja(d, c, niv):
    x0, y0, x1, y1 = c
    if niv == "E":
        p = 9   # el amarillo se separa del texto para no taparlo
        c = (x0 - p, y0 - p, x1 + p, y1 + p)
        d.rectangle(c, outline=OSCURO, width=8)
    d.rectangle(c, outline=COL[niv], width=4)


def etiqueta(d, x, y, n, niv, f):
    r = 17
    d.ellipse((x - r, y - r, x + r, y + r), fill=COL[niv],
              outline=OSCURO if niv == "E" else "white", width=3)
    w = d.textlength(str(n), font=f)
    d.text((x - w / 2, y - 12), str(n), font=f, fill=OSCURO if niv == "E" else "white")


def anotar(cap):
    im = Image.open(cap["archivo"]).convert("RGB")
    d = ImageDraw.Draw(im)
    fb, ft = fuente(RUTAS_NEGRITA, 22), fuente(RUTAS_FUENTE, 24)
    marcas = [dict(m, niv=nivel(m.get("nivel", ""))) for m in cap["marcas"]]

    for m in sorted(marcas, key=lambda m: ORDEN_DIBUJO.index(m["niv"])):
        for c in m["cajas"]:
            caja(d, c, m["niv"])
    for m in marcas:
        c = m["cajas"][0]
        x = c[2] if m.get("ancla") == "tr" else c[0]
        etiqueta(d, max(x, 20), max(c[1], 20), m["n"], m["niv"], fb)

    ancho_car = int((im.width - 80) / 12.6) - 5
    lineas = [(m["n"], m["niv"], textwrap.wrap(m["texto"], ancho_car)) for m in marcas]
    usados = sorted({m["niv"] for m in marcas}, key=ORDEN_CLAVE.index)
    alto = 30 + sum(len(ws) * 34 + 14 for _, _, ws in lineas) + 60

    lienzo = Image.new("RGB", (im.width, im.height + alto), "white")
    lienzo.paste(im, (0, 0))
    dc = ImageDraw.Draw(lienzo)
    y = im.height + 22
    for n, niv, ws in lineas:
        etiqueta(dc, 40, y + 14, n, niv, fb)
        for linea in ws:
            dc.text((74, y), linea, font=ft, fill=(30, 30, 30))
            y += 34
        y += 14
    y += 6
    dc.line((20, y - 6, im.width - 20, y - 6), fill=(200, 200, 200), width=2)
    x = 40
    for k in usados:
        dc.rectangle((x, y + 4, x + 26, y + 30), fill=COL[k], outline=OSCURO, width=2)
        dc.text((x + 38, y + 4), NOMBRE[k], font=fb, fill=(30, 30, 30))
        x += 38 + int(dc.textlength(NOMBRE[k], font=fb)) + 50
    lienzo.save(cap["salida"])
    return cap["salida"], lienzo.size


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    with open(sys.argv[1], encoding="utf-8") as f:
        spec = json.load(f)
    for cap in spec["capturas"]:
        print(*anotar(cap))


if __name__ == "__main__":
    main()
