#!/usr/bin/env python3
"""Calcula puntajes de la evaluación de Lenguaje Claro (imprescindibles, esperables y deseables).

Uso: python score.py respuestas.json [--md informe.md] [--json resultado.json]

El JSON puede traer indicadores 1.1.x, 1.2.x, 1.3.x o cualquier combinación. Cada nivel
se calcula por separado; un nivel con indicadores incompletos es un error.
"""
import argparse
import json
import sys

# código -> (nombre, nº de preguntas, nivel)
INDICADORES = {
    "1.1.1": ("Fiabilidad", 1, "imprescindibles"),
    "1.1.2": ("Completitud", 4, "imprescindibles"),
    "1.1.3": ("Lenguaje plano", 6, "imprescindibles"),
    "1.1.4": ("Actualización", 1, "imprescindibles"),
    "1.1.5": ("Redacción y ortografía", 3, "imprescindibles"),
    "1.1.6": ("Propiedad intelectual", 2, "imprescindibles"),
    "1.1.7": ("Privacidad y datos personales", 3, "imprescindibles"),
    "1.1.8": ("Contenidos sensibles", 3, "imprescindibles"),
    "1.2.1": ("Claridad", 5, "esperables"),
    "1.2.2": ("Concisión", 5, "esperables"),
    "1.2.3": ("Legibilidad", 3, "esperables"),
    "1.2.4": ("Escritura para la web", 8, "esperables"),
    "1.3.1": ("Visualización de la información", 1, "deseables"),
    "1.3.2": ("Objetividad", 2, "deseables"),
    "1.3.3": ("Archivo", 1, "deseables"),
}

# Preguntas (índice base 0) donde "No aplica" es válido.
NO_APLICA_PERMITIDO = {
    "1.1.2": {3}, "1.1.3": {4}, "1.1.7": {0}, "1.1.8": {0},
    "1.2.1": {4}, "1.2.2": {4}, "1.2.4": {6, 7},
    "1.3.1": {0}, "1.3.3": {0},
}

# (porcentaje mínimo de Sí, puntaje), de mayor a menor. Ajustar si la regla oficial difiere.
UMBRALES = [(100.0, 3), (60.0, 2), (0.01, 1), (0.0, 0)]

SI = {"si", "sí"}
NO = {"no"}
NA = {"no aplica", "na", "n/a"}
NV = {"no verificable", "nv"}


def norm(v):
    return str(v).strip().lower()


def puntaje(pct):
    for minimo, p in UMBRALES:
        if pct >= minimo:
            return p
    return 0


def evaluar(data):
    resp = data.get("respuestas", {})
    coment = data.get("comentarios", {})
    niveles_presentes = {INDICADORES[c][2] for c in resp if c in INDICADORES}
    desconocidos = [c for c in resp if c not in INDICADORES]
    errores = [f"Indicador desconocido: {c}" for c in desconocidos]
    if not niveles_presentes:
        errores.append("No hay respuestas de ningún indicador conocido")
    resultado = []
    for cod, (nombre, n_preg, nivel) in INDICADORES.items():
        if nivel not in niveles_presentes:
            continue
        r = resp.get(cod)
        if r is None or len(r) != n_preg:
            errores.append(f"{cod} {nombre}: se esperaban {n_preg} respuestas, llegaron {0 if r is None else len(r)}")
            continue
        si = no = 0
        no_verificables = []
        for i, v in enumerate(r):
            x = norm(v)
            if x in SI:
                si += 1
            elif x in NO:
                no += 1
            elif x in NA:
                if i not in NO_APLICA_PERMITIDO.get(cod, set()):
                    errores.append(f"{cod} pregunta {i+1}: 'No aplica' no está permitido en esta pregunta")
            elif x in NV:
                no_verificables.append(i + 1)
            else:
                errores.append(f"{cod} pregunta {i+1}: respuesta no reconocida '{v}'")
        item = {"codigo": cod, "indicador": nombre, "nivel": nivel, "si": si, "no": no, "respuestas": r,
                "no_verificables": no_verificables, "comentario": coment.get(cod, "")}
        if si + no == 0:
            item["puntaje"] = None
        else:
            pct = 100.0 * si / (si + no)
            item["pct_si"] = round(pct, 1)
            item["puntaje"] = puntaje(pct)
        resultado.append(item)
    if errores:
        print("ERRORES DE ENTRADA:", *errores, sep="\n  - ", file=sys.stderr)
        sys.exit(1)
    niveles = {}
    for nivel in ("imprescindibles", "esperables", "deseables"):
        evaluados = [x for x in resultado if x["nivel"] == nivel and x["puntaje"] is not None]
        if not any(x["nivel"] == nivel for x in resultado):
            continue
        total = sum(x["puntaje"] for x in evaluados)
        maximo = 3 * len(evaluados)
        niveles[nivel] = {"total": total, "maximo": maximo,
                          "pct_cumplimiento": int(100.0 * total / maximo + 0.5) if maximo else None,
                          "no_evaluados": [x["codigo"] for x in resultado
                                           if x["nivel"] == nivel and x["puntaje"] is None]}
    res = {"url": data.get("url", ""), "fecha": data.get("fecha", ""),
           "indicadores": resultado, "niveles": niveles}
    # Global solo si están los tres niveles: preguntas con Sí / preguntas aplicables y verificables
    if len(niveles) == 3:
        si = sum(x["si"] for x in resultado)
        apl = sum(x["si"] + x["no"] for x in resultado)
        res["global"] = {"si": si, "aplicables": apl, "pct_cumplimiento": int(100.0 * si / apl + 0.5) if apl else None}
    return res


def a_markdown(res):
    L = ["# Evaluación de Contenido y Lenguaje Claro",
         f"**Página evaluada:** {res['url']}  ",
         f"**Fecha:** {res['fecha']}  "]
    for nivel, n in res["niveles"].items():
        pct = "N/E" if n["pct_cumplimiento"] is None else f"{n['pct_cumplimiento']}%"
        L.append(f"**Cumplimiento {nivel}: {pct}** ({n['total']}/{n['maximo']})  ")
    if "global" in res:
        g = res["global"]
        L.append(f"**Cumplimiento global: {g['pct_cumplimiento']}%** ({g['si']} de {g['aplicables']} preguntas aplicables con Sí)  ")
    for nivel in res["niveles"]:
        L += ["", f"## {nivel.capitalize()}", "",
              "| N° | Indicador | Respuestas | Puntaje | Comentarios |", "|---|---|---|---|---|"]
        for x in res["indicadores"]:
            if x["nivel"] != nivel:
                continue
            p = "N/E" if x["puntaje"] is None else f"{x['puntaje']}/3"
            L.append(f"| {x['codigo']} | {x['indicador']} | {' · '.join(x['respuestas'])} | {p} | {x['comentario']} |")
    nv = [x for x in res["indicadores"] if x["no_verificables"]]
    if nv:
        L += ["", "**Preguntas no verificables (excluidas del cálculo):**"]
        L += [f"- {x['codigo']} {x['indicador']}: pregunta(s) {', '.join(map(str, x['no_verificables']))}" for x in nv]
    return "\n".join(L) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada")
    ap.add_argument("--md")
    ap.add_argument("--json")
    a = ap.parse_args()
    with open(a.entrada, encoding="utf-8") as f:
        res = evaluar(json.load(f))
    md = a_markdown(res)
    print(md)
    if a.md:
        with open(a.md, "w", encoding="utf-8") as f:
            f.write(md)
    if a.json:
        with open(a.json, "w", encoding="utf-8") as f:
            json.dump(res, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
