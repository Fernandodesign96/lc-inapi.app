# -*- coding: utf-8 -*-
"""Genera data/checklist-criteria-lc-ptd.json — 51 criterios LC por indicadores IEW/IESD."""
from __future__ import annotations

import json
from pathlib import Path

# Cada ítem: (id, iew, iesd, indicador, pregunta, applicability, criticidad)
# applicability: ambos | sitioweb | tramites
# criticidad: imprescindible | esperable | deseable (del instrumento)

ROWS: list[tuple] = [
  # --- 1.1.1 / 5.1.1 Fiabilidad (1) ---
  ("LC-1.1.1-01", "1.1.1", "5.1.1", "Fiabilidad",
   "¿Es fácil reconocer la fuente o autoría de la información publicada? Por ejemplo: se identifica claramente el nombre de la institución que publica en el encabezado o pie de cada página, o la unidad interna o externa que entregó alguna información específica.",
   "ambos", "imprescindible"),
  # --- 1.1.2 / 5.1.2 Completitud (4) ---
  ("LC-1.1.2-01", "1.1.2", "5.1.2", "Completitud",
   "¿Los contenidos representan de manera fiel lo enunciado en su título?",
   "ambos", "imprescindible"),
  ("LC-1.1.2-02", "1.1.2", "5.1.2", "Completitud",
   "¿Se cumple con la recomendación de no incluir páginas sin contenido, contenido incompleto o «En construcción»?",
   "ambos", "imprescindible"),
  ("LC-1.1.2-03", "1.1.2", "5.1.2", "Completitud",
   "¿El texto destaca los datos clave de la información? Por ejemplo: se presenta un resumen con las respuestas a las preguntas qué, cómo, dónde, cuándo y para quién o existe un recuadro con fechas importantes.",
   "ambos", "imprescindible"),
  ("LC-1.1.2-04", "1.1.2", "5.1.2", "Completitud",
   "En el caso de textos referidos a trámites, ¿se brinda información suficiente para que las personas usuarias puedan realizarlos autónomamente?",
   "ambos", "imprescindible"),
  # --- 1.1.3 / 5.1.3 Lenguaje plano (6) ---
  ("LC-1.1.3-01", "1.1.3", "5.1.3", "Lenguaje plano",
   "¿El lenguaje utilizado está orientado a que una persona pueda entender el contenido, aun aquellas con mayor dificultad de comprensión lectora? (p. ej. Legible: al menos tres de cinco indicadores en dificultad Normal).",
   "ambos", "imprescindible"),
  ("LC-1.1.3-02", "1.1.3", "5.1.3", "Lenguaje plano",
   "¿El tono y voz son amables, respetuosos y cercanos con las personas usuarias?",
   "ambos", "imprescindible"),
  ("LC-1.1.3-03", "1.1.3", "5.1.3", "Lenguaje plano",
   "¿La redacción prescinde de la jerga técnica o legal?",
   "ambos", "imprescindible"),
  ("LC-1.1.3-04", "1.1.3", "5.1.3", "Lenguaje plano",
   "¿Se evitan abreviaturas, extranjerismos, eufemismos, modismos o términos muy especializados o rebuscados en al menos un 50% de los contenidos revisados?",
   "ambos", "imprescindible"),
  ("LC-1.1.3-05", "1.1.3", "5.1.3", "Lenguaje plano",
   "¿Se define cada sigla y acrónimo y se emplean solo si es necesario?",
   "ambos", "imprescindible"),
  ("LC-1.1.3-06", "1.1.3", "5.1.3", "Lenguaje plano",
   "¿Los contenidos están escritos en tono positivo indicando lo que se puede hacer y evitando enfocar los mensajes desde el «no se puede»?",
   "ambos", "imprescindible"),
  # --- 1.1.4 / 5.1.4 Actualización (1) ---
  ("LC-1.1.4-01", "1.1.4", "5.1.4", "Actualización",
   "¿Los contenidos están actualizados y muestran información vigente al año en curso? Por ejemplo: se indica expresamente su fecha de publicación o última fecha de actualización.",
   "ambos", "imprescindible"),
  # --- 1.1.5 / 5.1.5 Redacción y ortografía (2 compartidas + 1 IEW) ---
  ("LC-1.1.5-01", "1.1.5", "5.1.5", "Redacción y ortografía",
   "¿Son correctas la ortografía —literal, acentual y puntual— y la gramática en los contenidos? (revisar con corrector; más de un error → no cumple).",
   "ambos", "imprescindible"),
  ("LC-1.1.5-02", "1.1.5", "5.1.5", "Redacción y ortografía",
   "¿Los signos de puntuación empleados facilitan la lectura del documento?",
   "ambos", "imprescindible"),
  ("LC-1.1.5-03", "1.1.5", None, "Redacción y ortografía",
   "¿Las frases se relacionan entre sí por medio de conectores? Por ejemplo: «A su vez,», «Por otra parte,», «Sin embargo,» o «De igual modo,».",
   "sitioweb", "imprescindible"),
  # --- 1.1.6 / 5.1.6 Propiedad intelectual ---
  ("LC-1.1.6-01", "1.1.6", "5.1.6", "Propiedad intelectual",
   "¿El sitio cuenta con información de permisos de uso de sus contenidos en algún lugar del sitio (condiciones de uso, copyright o licencia tipo Creative Commons)?",
   "ambos", "imprescindible"),
  ("LC-1.1.6-02", "1.1.6", None, "Propiedad intelectual",
   "¿Se evita la redifusión de material protegido por derechos de autor sin autorización?",
   "sitioweb", "imprescindible"),
  # --- 1.1.7 / 5.1.7 Privacidad ---
  ("LC-1.1.7-01", "1.1.7", None, "Privacidad y datos personales",
   "Si se mencionan listados de personas, ¿se evita la publicación de sus RUN en el sitio web?",
   "sitioweb", "imprescindible"),
  ("LC-1.1.7-02", "1.1.7", None, "Privacidad y datos personales",
   "¿El sitio protege la privacidad al no publicar direcciones ni teléfonos particulares?",
   "sitioweb", "imprescindible"),
  ("LC-1.1.7-03", "1.1.7", "5.1.7", "Privacidad y datos personales",
   "¿Existe información sobre cómo las personas usuarias pueden ejercer los derechos ARCO (acceso, rectificación, cancelación o eliminación, oposición) y bloqueo de datos personales, conforme a la Ley sobre Protección de la Vida Privada?",
   "ambos", "imprescindible"),
  # --- 1.1.8 Contenidos sensibles (solo IEW, 3) ---
  ("LC-1.1.8-01", "1.1.8", None, "Contenidos sensibles",
   "Si el sitio publica información sobre menores de edad, ¿se protege la identidad de los mismos en textos y fotografías?",
   "sitioweb", "imprescindible"),
  ("LC-1.1.8-02", "1.1.8", None, "Contenidos sensibles",
   "¿El contenido es apto para ser leído por menores de edad?",
   "sitioweb", "imprescindible"),
  ("LC-1.1.8-03", "1.1.8", None, "Contenidos sensibles",
   "¿El sitio evita exhibir material que pueda afectar la susceptibilidad de las personas o menoscabarlas (salud, ideología, creencias religiosas, vida sexual, características físicas, etc.)?",
   "sitioweb", "imprescindible"),
  # --- 1.2.1 / 5.2.1 Claridad ---
  ("LC-1.2.1-01", "1.2.1", "5.2.1", "Claridad",
   "¿Los contenidos están estructurados como respuestas a las preguntas frecuentes que podrían hacerse las personas usuarias?",
   "ambos", "esperable"),
  ("LC-5.2.1-01", None, "5.2.1", "Claridad",
   "¿La información del servicio digital está organizada de manera que responda claramente a las preguntas frecuentes que podrían tener las personas usuarias?",
   "tramites", "esperable"),
  ("LC-1.2.1-02", "1.2.1", "5.2.1", "Claridad",
   "¿Las palabras, frases y conceptos utilizados tienen un lenguaje claro para las personas usuarias?",
   "ambos", "esperable"),
  ("LC-1.2.1-03", "1.2.1", "5.2.1", "Claridad",
   "¿Predomina el tiempo presente simple y la voz activa de los verbos?",
   "ambos", "esperable"),
  ("LC-1.2.1-04", "1.2.1", "5.2.1", "Claridad",
   "¿Las oraciones están ordenadas según la forma sujeto-verbo-predicado?",
   "ambos", "esperable"),
  ("LC-1.2.1-05", "1.2.1", "5.2.1", "Claridad",
   "Cuando se listan requisitos en contenidos referidos a servicios a la ciudadanía, ¿se usa modo infinitivo?",
   "ambos", "esperable"),
  # --- 1.2.2 / 5.2.2 Concisión ---
  ("LC-1.2.2-01", "1.2.2", "5.2.2", "Concisión",
   "¿Los textos son breves y utilizan frases cortas en su redacción (al menos 2 y como máximo 8 párrafos por página)?",
   "ambos", "esperable"),
  ("LC-5.2.2-01", None, "5.2.2", "Concisión",
   "¿Los textos, tanto de la página de inicio como del desarrollo del trámite, son breves y utilizan frases cortas en su redacción?",
   "tramites", "esperable"),
  ("LC-1.2.2-02", "1.2.2", "5.2.2", "Concisión",
   "Al revisar el sitio web en versión de escritorio, ¿los párrafos son cortos, con menos de 8 líneas?",
   "ambos", "esperable"),
  ("LC-1.2.2-03", "1.2.2", "5.2.2", "Concisión",
   "¿Se explica una idea por párrafo?",
   "ambos", "esperable"),
  ("LC-1.2.2-04", "1.2.2", "5.2.2", "Concisión",
   "¿Las oraciones son simples y directas, evitando el exceso de palabras?",
   "ambos", "esperable"),
  ("LC-1.2.2-05", "1.2.2", "5.2.2", "Concisión",
   "Si existe un texto extenso —de cuatro o más párrafos—, ¿hay un resumen al inicio?",
   "ambos", "esperable"),
  # --- 1.2.3 / 5.2.3 Legibilidad (3) ---
  ("LC-1.2.3-01", "1.2.3", "5.2.3", "Legibilidad",
   "¿Hay espacio entre los párrafos?",
   "ambos", "esperable"),
  ("LC-1.2.3-02", "1.2.3", "5.2.3", "Legibilidad",
   "¿El texto está alineado a la izquierda?",
   "ambos", "esperable"),
  ("LC-1.2.3-03", "1.2.3", "5.2.3", "Legibilidad",
   "¿Se utilizan listas numeradas, viñetas o tablas para presentar la información más ordenada?",
   "ambos", "esperable"),
  # --- 1.2.4 / 5.2.4 Escritura para la web ---
  ("LC-1.2.4-01", "1.2.4", "5.2.4", "Escritura para la web",
   "¿Los contenidos del sitio aplican el modelo de «pirámide invertida» que los estructura desde lo más a lo menos importante?",
   "ambos", "esperable"),
  ("LC-1.2.4-02", "1.2.4", "5.2.4", "Escritura para la web",
   "¿Las páginas están bien organizadas, con títulos claros y subtítulos que facilitan la lectura y la búsqueda de información?",
   "ambos", "esperable"),
  ("LC-1.2.4-03", "1.2.4", "5.2.4", "Escritura para la web",
   "¿Es fácil escanear visualmente los contenidos?",
   "ambos", "esperable"),
  ("LC-1.2.4-04", "1.2.4", "5.2.4", "Escritura para la web",
   "¿Se utilizan negritas para destacar palabras clave de cada párrafo?",
   "ambos", "esperable"),
  ("LC-1.2.4-05", "1.2.4", "5.2.4", "Escritura para la web",
   "¿Se evitan las frases escritas únicamente en mayúsculas?",
   "ambos", "esperable"),
  ("LC-1.2.4-06", "1.2.4", None, "Escritura para la web",
   "¿Se vinculan contenidos del mismo sitio a través de enlaces relacionados?",
   "sitioweb", "esperable"),
  ("LC-5.2.4-01", None, "5.2.4", "Escritura para la web",
   "¿Los textos de los enlaces (rótulos) son descriptivos del contenido o sitio al que dirigen o directos en el llamado a la acción que impulsan, evitando términos ambiguos como «Haga clic aquí» o «Más»? Por ejemplo: «Consultar fecha de pago», «Solicitar certificado».",
   "tramites", "esperable"),
  ("LC-1.2.4-07", "1.2.4", "5.2.4", "Escritura para la web",
   "Cuando se enlazan documentos, ¿se especifican el título, formato y peso? Por ejemplo: «Informe sobre ciberseguridad en Chile 2024 (pdf, 345 KB)».",
   "ambos", "esperable"),
  ("LC-1.2.4-08", "1.2.4", "5.2.4", "Escritura para la web",
   "¿Se entrega una breve descripción de los documentos enlazados para mejorar su capacidad de búsqueda, usabilidad y accesibilidad?",
   "ambos", "esperable"),
  # --- 1.3.1 Visualización (solo IEW) ---
  ("LC-1.3.1-01", "1.3.1", None, "Visualización de la información",
   "¿Se utilizan apoyos visuales como íconos, imágenes, gráficos o infografías para presentar datos?",
   "sitioweb", "deseable"),
  # --- 1.3.2 / 5.3.1 Objetividad ---
  ("LC-1.3.2-01", "1.3.2", "5.3.1", "Objetividad",
   "¿Los contenidos tienen información objetiva y presentan una redacción neutra, sin reflejar la opinión de quien los escribió?",
   "ambos", "deseable"),
  ("LC-1.3.2-02", "1.3.2", None, "Objetividad",
   "¿En al menos un 80% de los contenidos se privilegia exponer datos y hechos por sobre el uso de adjetivos calificativos?",
   "sitioweb", "deseable"),
  # --- 1.3.3 / 5.3.2 Archivo ---
  ("LC-1.3.3-01", "1.3.3", "5.3.2", "Archivo",
   "Si el sitio presenta versiones anteriores de contenidos, ¿están rotuladas claramente como contenidos o documentos de archivo no vigentes, indicando el año o periodo al que corresponden?",
   "ambos", "deseable"),
]

assert len(ROWS) == 51, len(ROWS)

INDICATORS_IEW = [
  ("1.1.1", "Fiabilidad", "imprescindible"),
  ("1.1.2", "Completitud", "imprescindible"),
  ("1.1.3", "Lenguaje plano", "imprescindible"),
  ("1.1.4", "Actualización", "imprescindible"),
  ("1.1.5", "Redacción y ortografía", "imprescindible"),
  ("1.1.6", "Propiedad intelectual", "imprescindible"),
  ("1.1.7", "Privacidad y datos personales", "imprescindible"),
  ("1.1.8", "Contenidos sensibles", "imprescindible"),
  ("1.2.1", "Claridad", "esperable"),
  ("1.2.2", "Concisión", "esperable"),
  ("1.2.3", "Legibilidad", "esperable"),
  ("1.2.4", "Escritura para la web", "esperable"),
  ("1.3.1", "Visualización de la información", "deseable"),
  ("1.3.2", "Objetividad", "deseable"),
  ("1.3.3", "Archivo", "deseable"),
]
INDICATORS_IESD = [
  ("5.1.1", "Fiabilidad", "imprescindible"),
  ("5.1.2", "Completitud", "imprescindible"),
  ("5.1.3", "Lenguaje plano", "imprescindible"),
  ("5.1.4", "Actualización", "imprescindible"),
  ("5.1.5", "Redacción y ortografía", "imprescindible"),
  ("5.1.6", "Propiedad intelectual", "imprescindible"),
  ("5.1.7", "Privacidad y datos personales", "imprescindible"),
  ("5.2.1", "Claridad", "esperable"),
  ("5.2.2", "Concisión", "esperable"),
  ("5.2.3", "Legibilidad", "esperable"),
  ("5.2.4", "Escritura para la web", "esperable"),
  ("5.3.1", "Objetividad", "deseable"),
  ("5.3.2", "Archivo", "deseable"),
]

criteria = []
for cid, iew, iesd, ind_name, question, appl, crit in ROWS:
  code = iew or iesd
  label_code = f"{iew} / {iesd}" if iew and iesd else (iew or iesd)
  criteria.append({
    "id": cid,
    "indicator_code_iew": iew,
    "indicator_code_iesd": iesd,
    "indicator_code_display": label_code,
    "indicator_name": ind_name,
    "section_id": code.split(".")[0] if code else "LC",
    "section_title": "Contenido y lenguaje claro",
    "criterion": question,
    "verification": question,
    "display_label": f"{ind_name} {label_code} — Criterio: {question}",
    "source": f"IEW {iew}" if iew and not iesd else (f"IESD {iesd}" if iesd and not iew else f"IEW {iew}, IESD {iesd}"),
    "applicability": appl,
    "criticidad": crit,
    "dimension": "lenguaje_claro",
  })

doc = {
  "checklist_version": "3.0",
  "title": "Checklist Editorial INAPI — Lenguaje claro PTD (preguntas IEW/IESD)",
  "dimension": "lenguaje_claro",
  "project_ptd": "PTD-D2.1-CL1",
  "criterion_count": 51,
  "indicators_iew_count": 15,
  "indicators_iesd_count": 13,
  "conteos": {
    "total_unicas": 51,
    "ambos": 38,
    "solo_iew": 10,
    "solo_iesd": 3,
    "nota_conteo": "El listado UX «8 solo IEW» agrupa «Contenidos sensibles x3» como un tema; en filas JSON son 3 preguntas → 10 exclusivas IEW. 38+10+3=51."
  },
  "indicators_iew": [{"code": c, "name": n, "nivel": nv} for c, n, nv in INDICATORS_IEW],
  "indicators_iesd": [{"code": c, "name": n, "nivel": nv} for c, n, nv in INDICATORS_IESD],
  "fuente_docx": "docs/Checklist_Editorial_INAPI_v2_0_actualizado.docx",
  "fuente_mapa": "docs/checklist-ptd-v2-mapa.md",
  "nota": "Nomenclatura vigente META MEI 2026. Sustituye A1–H1 (v2.1) en auditorías nuevas (version_checklist: \"3.0\"). El JSON canónico debe tener exactamente 51 filas en criterios_evaluados. Usabilidad (18) y Seguridad (10) no entran al score hasta post-Excel LC.",
  "criteria": criteria,
}

out = Path("data/checklist-criteria-lc-ptd.json")
out.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")
print("wrote", out, "n=", len(criteria))
# verify counts by applicability
from collections import Counter
c = Counter(x["applicability"] for x in criteria)
print("appl", dict(c))
ambos = sum(1 for x in criteria if x["applicability"] == "ambos")
solo_sw = sum(1 for x in criteria if x["applicability"] == "sitioweb")
solo_tr = sum(1 for x in criteria if x["applicability"] == "tramites")
print("ambos", ambos, "sitioweb", solo_sw, "tramites", solo_tr)
# Expected: 40 ambos, 8 sitioweb, 3 tramites — but sitioweb exclusives might be more if we counted wrong
# User: 40 ambos, 8 solo IEW, 3 solo IESD
print("ids sample", criteria[0]["display_label"][:80])
