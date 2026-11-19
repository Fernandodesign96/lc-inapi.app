#!/usr/bin/env python3
"""Genera la planilla Excel del informe de Contenido y lenguaje claro.

Uso: python generar_planilla.py informe.json salida.xlsx [--sin-recalculo]

Entrada (ver assets/ejemplo_informe.json): {"paginas": [ {nombre, url, fecha, capturas,
respuestas, comentarios, cambios, limitaciones}, ... ]}. También acepta una sola página
con los campos en el nivel superior.

Hojas: Resumen, Cambios, Detalle, Preguntas, Notas. Los puntajes y porcentajes son fórmulas
que dependen de los umbrales editables de la hoja Notas. La prioridad de cada cambio se
calcula aquí (no hay que indicarla):
  Alta   = imprescindible de un indicador con puntaje 1 o menos
  Media  = imprescindible con puntaje 2, y todos los esperables
  Baja   = deseables y observaciones fuera de la pauta
"""
import json
import math
import os
import subprocess
import sys

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import score  # noqa: E402

CRITERIOS = json.load(open(os.path.join(AQUI, "..", "assets", "criterios.json"), encoding="utf-8"))
DEF = {c["codigo"]: c for c in CRITERIOS}

F = "Arial"
AZUL = "1F3864"
NIVEL = {"imprescindible": "Imprescindible", "esperable": "Esperable", "deseable": "Deseable", "otro": "Fuera de la pauta"}
COLOR_NIVEL = {"imprescindible": "Rojo", "esperable": "Amarillo", "deseable": "Verde", "otro": "Gris"}
REL_NIVEL = {"imprescindible": "F4B6B6", "esperable": "FFE699", "deseable": "C6E0B4", "otro": "D9D9D9"}
REL_PRIO = {"Alta": "F8CBAD", "Media": "FFE699", "Baja": "C6E0B4"}
ORDEN_PRIO = {"Alta": 0, "Media": 1, "Baja": 2}
SING = {"imprescindibles": "imprescindible", "esperables": "esperable", "deseables": "deseable"}
THIN = Side(style="thin", color="BFBFBF")
BORDE = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)


def fill(hex_):
    return PatternFill("solid", fgColor=hex_)


def fuente(negrita=False, color="000000", tam=10, cursiva=False):
    return Font(name=F, bold=negrita, color=color, size=tam, italic=cursiva)


def celda(ws, ref, valor, negrita=False, centrar=False, envolver=True, relleno=None, color="000000", tam=10, cursiva=False, borde=True, fmt=None):
    c = ws[ref] if isinstance(ref, str) else ws.cell(row=ref[0], column=ref[1])
    c.value = valor
    c.font = fuente(negrita, color, tam, cursiva)
    c.alignment = Alignment(wrap_text=envolver, vertical="top", horizontal="center" if centrar else None)
    if relleno:
        c.fill = fill(relleno)
    if borde:
        c.border = BORDE
    if fmt:
        c.number_format = fmt
    return c


def encabezado(ws, fila, textos):
    for i, t in enumerate(textos, 1):
        c = ws.cell(row=fila, column=i, value=t)
        c.font = fuente(True, "FFFFFF")
        c.fill = fill(AZUL)
        c.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
        c.border = BORDE
    ws.row_dimensions[fila].height = 30


def altura(pares, base=13):
    lineas = 1
    for texto, ancho in pares:
        if not texto:
            continue
        n = sum(max(1, math.ceil(len(p) / max(1, ancho * 1.15))) for p in str(texto).split("\n"))
        lineas = max(lineas, n)
    return max(18, lineas * base + 4)


def nivel_de(codigo):
    if codigo.startswith("1.1"):
        return "imprescindible"
    if codigo.startswith("1.2"):
        return "esperable"
    if codigo.startswith("1.3"):
        return "deseable"
    return "otro"


def prioridad_de(nivel, puntaje):
    if nivel == "imprescindible":
        return "Alta" if puntaje is not None and puntaje <= 1 else "Media"
    if nivel == "esperable":
        return "Media"
    return "Baja"


def normalizar(data):
    paginas = data.get("paginas")
    if paginas is None:
        paginas = [data]
    vistos, salida = set(), []
    for i, p in enumerate(paginas, 1):
        p = dict(p)
        nombre = str(p.get("nombre") or p.get("url") or f"Página {i}")[:60]
        base, k = nombre, 2
        while nombre in vistos:
            nombre = f"{base} ({k})"
            k += 1
        vistos.add(nombre)
        p["nombre"] = nombre
        salida.append(p)
    return salida


def construir(paginas, destino):
    wb = Workbook()
    wsR = wb.active
    wsR.title = "Resumen"
    wsC = wb.create_sheet("Cambios")
    wsD = wb.create_sheet("Detalle")
    wsP = wb.create_sheet("Preguntas")
    wsN = wb.create_sheet("Notas")

    evaluadas = []
    for p in paginas:
        res = score.evaluar(p)
        evaluadas.append((p, res))

    # ---------------- Notas ----------------
    wsN.column_dimensions["A"].width = 46
    wsN.column_dimensions["B"].width = 100
    celda(wsN, "A1", "Notas y supuestos", True, envolver=False, color=AZUL, tam=14, borde=False)
    celda(wsN, "A3", "Regla de puntaje (supuesto)", True, envolver=False, borde=False)
    celda(wsN, "A4", "Umbral para puntaje 3 (proporción de Sí)", envolver=False, borde=False)
    celda(wsN, "B4", score.UMBRALES[0][0] / 100, relleno="FFF2CC", color="0000FF", fmt="0%", envolver=False)
    celda(wsN, "A5", "Umbral para puntaje 2 (proporción de Sí)", envolver=False, borde=False)
    celda(wsN, "B5", score.UMBRALES[1][0] / 100, relleno="FFF2CC", color="0000FF", fmt="0%", envolver=False)
    wsN["B4"].alignment = wsN["B5"].alignment = Alignment(horizontal="left")
    celda(wsN, "A6", "Con al menos un Sí el puntaje es 1; sin ningún Sí es 0. Los umbrales se infirieron de una planilla de referencia y se pueden ajustar en las celdas amarillas.", cursiva=True, envolver=False, borde=False)
    celda(wsN, "A8", "Colores de las marcas en las imágenes", True, envolver=False, borde=False)
    for i, n in enumerate(["imprescindible", "esperable", "deseable", "otro"]):
        celda(wsN, (9 + i, 1), f"{COLOR_NIVEL[n]}: {NIVEL[n].lower()}", envolver=False, relleno=REL_NIVEL[n], borde=False)
    celda(wsN, "A14", "Limitaciones y supuestos", True, envolver=False, borde=False)
    fila = 15
    for p, _ in evaluadas:
        lims = list(p.get("limitaciones") or [])
        if not p.get("capturas"):
            lims.append("No se adjuntaron capturas de pantalla: las preguntas visuales quedaron sin verificar o se estimaron desde el texto.")
        for t in lims:
            celda(wsN, (fila, 1), f"{p['nombre']}: {t}", envolver=False, borde=False)
            fila += 1
    celda(wsN, (fila, 1), "Las redacciones propuestas son sugerencias: su contenido jurídico y técnico debe validarlo quien corresponda en la institución. Lo que está entre corchetes debe completarse.", cursiva=True, envolver=False, borde=False)

    # ---------------- Detalle y Preguntas ----------------
    ancho_d = [18, 8, 15, 30, 6, 6, 11, 9, 44, 90]
    for i, w in enumerate(ancho_d, 1):
        wsD.column_dimensions[get_column_letter(i)].width = w
    encabezado(wsD, 1, ["Página", "N°", "Nivel", "Indicador", "Sí", "No", "Puntaje (0 a 3)", "% de Sí", "Respuestas por pregunta", "Comentario"])
    ancho_p = [18, 10, 28, 90, 16]
    for i, w in enumerate(ancho_p, 1):
        wsP.column_dimensions[get_column_letter(i)].width = w
    encabezado(wsP, 1, ["Página", "N°", "Indicador", "Pregunta de chequeo", "Respuesta"])

    fd, fp = 2, 2
    puntajes = {}
    for p, res in evaluadas:
        for ind in res["indicadores"]:
            puntajes[(p["nombre"], ind["codigo"])] = ind["puntaje"]
            n = fd
            nv = SING[ind["nivel"]]
            resp_txt = " · ".join(ind["respuestas"])
            vals = [p["nombre"], ind["codigo"], NIVEL[nv], ind["indicador"], ind["si"], ind["no"], None, None, resp_txt, ind["comentario"]]
            for c, v in enumerate(vals, 1):
                celda(wsD, (n, c), v, negrita=c in (2, 7), centrar=c in (5, 6, 7, 8))
            wsD.cell(row=n, column=7).value = f'=IF(E{n}+F{n}=0,"N/E",IF(E{n}/(E{n}+F{n})>=Notas!$B$4,3,IF(E{n}/(E{n}+F{n})>=Notas!$B$5,2,IF(E{n}>0,1,0))))'
            wsD.cell(row=n, column=8).value = f'=IF(E{n}+F{n}=0,"N/E",E{n}/(E{n}+F{n}))'
            wsD.cell(row=n, column=8).number_format = "0%"
            wsD.cell(row=n, column=3).fill = fill(REL_NIVEL[nv])
            for c in (5, 6):
                wsD.cell(row=n, column=c).font = fuente(color="0000FF")
            wsD.row_dimensions[n].height = altura([(ind["comentario"], ancho_d[9]), (resp_txt, ancho_d[8]), (ind["indicador"], ancho_d[3])])
            fd += 1
            for k, resp in enumerate(ind["respuestas"]):
                texto = DEF[ind["codigo"]]["preguntas"][k]["texto"]
                v2 = [p["nombre"], f'{ind["codigo"]}-{k + 1}', ind["indicador"], texto, resp]
                for c, v in enumerate(v2, 1):
                    celda(wsP, (fp, c), v, negrita=c == 2, centrar=c == 5)
                col = {"Sí": "C6E0B4", "No": "F4B6B6"}.get(resp, "EDEDED")
                wsP.cell(row=fp, column=5).fill = fill(col)
                wsP.row_dimensions[fp].height = altura([(texto, ancho_p[3]), (ind["indicador"], ancho_p[2])])
                fp += 1
    ultimo_d = fd - 1
    wsD.freeze_panes = "A2"
    wsD.auto_filter.ref = f"A1:J{ultimo_d}"
    wsP.freeze_panes = "A2"
    celda(wsD, (ultimo_d + 2, 1), "Sí y No son el conteo de respuestas por indicador (dato ingresado). «No aplica» y «No verificable» no se cuentan. N/E = no evaluable.", cursiva=True, tam=9, envolver=False, borde=False)

    # ---------------- Cambios ----------------
    ancho_c = [8, 18, 28, 15, 11, 10, 52, 60, 40]
    for i, w in enumerate(ancho_c, 1):
        wsC.column_dimensions[get_column_letter(i)].width = w
    encabezado(wsC, 1, ["N°", "Página", "Ubicación", "Nivel", "Indicador", "Prioridad", "Problema detectado", "Cambio necesario", "Cómo verificar"])
    fc, num = 2, 1
    for p, res in evaluadas:
        filas = []
        for c in p.get("cambios") or []:
            cod = str(c.get("indicador", "fuera_de_pauta"))
            cod = cod if cod in DEF else "fuera_de_pauta"
            niv = nivel_de(cod)
            prio = prioridad_de(niv, puntajes.get((p["nombre"], cod)))
            filas.append((ORDEN_PRIO[prio], cod, niv, prio, c))
        filas.sort(key=lambda t: (t[0], t[1]))
        for _, cod, niv, prio, c in filas:
            vals = [f"C-{num:02d}", p["nombre"], c.get("ubicacion", ""), NIVEL[niv], "Fuera de la pauta" if cod == "fuera_de_pauta" else cod, prio, c.get("problema", ""), c.get("cambio", ""), c.get("verificar", "")]
            for k, v in enumerate(vals, 1):
                celda(wsC, (fc, k), v, negrita=k == 1, centrar=k in (5, 6))
            wsC.cell(row=fc, column=4).fill = fill(REL_NIVEL[niv])
            wsC.cell(row=fc, column=6).fill = fill(REL_PRIO[prio])
            wsC.row_dimensions[fc].height = altura([(str(v), ancho_c[i]) for i, v in enumerate(vals)])
            fc += 1
            num += 1
    if fc == 2:
        celda(wsC, "A2", "No se encontraron cambios necesarios.", cursiva=True, envolver=False, borde=False)
    ultimo_c = max(fc - 1, 2)
    wsC.freeze_panes = "A2"
    if fc > 2:
        wsC.auto_filter.ref = f"A1:I{ultimo_c}"

    # ---------------- Resumen ----------------
    anchos_r = [18, 38, 12, 15, 13, 12, 12, 11, 7, 8, 7, 10]
    for i, w in enumerate(anchos_r, 1):
        wsR.column_dimensions[get_column_letter(i)].width = w
    celda(wsR, "A1", "Evaluación de contenido y lenguaje claro", True, envolver=False, color=AZUL, tam=14, borde=False)
    celda(wsR, "A2", "Cumplimiento por nivel = puntajes / (3 × indicadores evaluados). Global = preguntas con Sí / preguntas aplicables y verificables (fórmula inferida de una planilla de referencia).", cursiva=True, tam=9, envolver=False, borde=False)
    encabezado(wsR, 4, ["Página", "URL", "Fecha", "Imprescindibles", "Esperables", "Deseables", "Global", "Capturas", "Alta", "Media", "Baja", "Total cambios"])
    L = ultimo_d
    r_ = lambda col: f"Detalle!${col}$2:${col}${L}"
    for i, (p, res) in enumerate(evaluadas):
        f = 5 + i
        celda(wsR, (f, 1), p["nombre"], True)
        celda(wsR, (f, 2), p.get("url", ""))
        celda(wsR, (f, 3), p.get("fecha", ""), centrar=True)
        for col, nivel_txt in ((4, "Imprescindible"), (5, "Esperable"), (6, "Deseable")):
            celda(wsR, (f, col), f'=IFERROR(SUMIFS({r_("G")},{r_("A")},$A{f},{r_("C")},"{nivel_txt}")/(3*COUNTIFS({r_("A")},$A{f},{r_("C")},"{nivel_txt}",{r_("G")},">=0")),"N/E")', True, True, fmt="0%")
        if res["global"] is not None:
            g = f'=IFERROR(SUMIFS({r_("E")},{r_("A")},$A{f})/(SUMIFS({r_("E")},{r_("A")},$A{f})+SUMIFS({r_("F")},{r_("A")},$A{f})),"N/E")'
        else:
            g = "N/E"
        celda(wsR, (f, 7), g, True, True, fmt="0%")
        celda(wsR, (f, 8), "Sí" if p.get("capturas") else "No", centrar=True)
        for col, prio in ((9, "Alta"), (10, "Media"), (11, "Baja")):
            celda(wsR, (f, col), f'=COUNTIFS(Cambios!$B$2:$B${ultimo_c},$A{f},Cambios!$F$2:$F${ultimo_c},"{prio}")', centrar=True)
            wsR.cell(row=f, column=col).fill = fill(REL_PRIO[prio])
        celda(wsR, (f, 12), f"=SUM(I{f}:K{f})", True, True)
        wsR.row_dimensions[f].height = altura([(p.get("url", ""), anchos_r[1])])
    wsR.freeze_panes = "A5"

    wb.save(destino)
    return evaluadas


def recalcular(ruta):
    for cand in ("/mnt/skills/public/xlsx/scripts/recalc.py",):
        if os.path.exists(cand):
            r = subprocess.run([sys.executable, cand, ruta, "90"], capture_output=True, text=True)
            print(r.stdout.strip() or r.stderr.strip())
            return
    print("Aviso: no se encontró recalc.py; las fórmulas se calcularán al abrir el archivo en Excel.")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 2:
        print(__doc__)
        sys.exit(1)
    with open(args[0], encoding="utf-8") as f:
        paginas = normalizar(json.load(f))
    evaluadas = construir(paginas, args[1])
    for p, res in evaluadas:
        n = res["niveles"]
        pct = lambda k: "N/E" if k not in n or n[k]["pct_cumplimiento"] is None else f'{n[k]["pct_cumplimiento"]}%'
        g = res["global"]["pct_cumplimiento"] if res.get("global") else "N/E"
        print(f'{p["nombre"]}: imprescindibles {pct("imprescindibles")} · esperables {pct("esperables")} · deseables {pct("deseables")} · global {g}%' if g != "N/E" else f'{p["nombre"]}: imprescindibles {pct("imprescindibles")} · esperables {pct("esperables")} · deseables {pct("deseables")}')
    if "--sin-recalculo" not in sys.argv:
        recalcular(args[1])


if __name__ == "__main__":
    main()
