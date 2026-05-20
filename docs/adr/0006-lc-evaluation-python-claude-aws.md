# ADR 0006 — Evaluación LC: Python, Claude API y despliegue AWS

## Estado

Propuesto — 2026-05-13 (ratificación formal de topología AWS: pendiente cierre con TI / Camila; ver [propuesta técnica integral](../PROPUESTA_TECNICA_INTEGRAL.md))

## Contexto

El [ADR 0004](0004-llm-checklist-evaluation-and-versioning.md) fija que la salida del LLM debe validarse contra los contratos Zod (39 criterios, `strictAuditRecordSchema` cuando aplique el agregado completo) y que las claves no se expongan al cliente. El [ADR 0005](0005-api-backend-nestjs-prisma.md) sitúa la **API de dominio** en **NestJS** con **Prisma** hacia **Supabase**.

El equipo acordó, para la capa de **análisis de lenguaje claro**, usar **Claude API (Anthropic)** con implementación en **Python** (prompts robustos y reglas estrictas) y disponer de un **entorno compartido en AWS** para desarrollo o staging, de modo que el sistema no dependa de máquinas locales encendidas.

La [propuesta técnica integral](../PROPUESTA_TECNICA_INTEGRAL.md) documenta roles, diagrama **Nest ↔ API Gateway ↔ Lambda (Python) ↔ Claude** y cuestiones abiertas de colaboración. Este ADR acota la decisión arquitectónica y la deuda explícita.

## Decisión

1. **Proveedor LLM:** **Claude API** para la evaluación asistida del checklist, manteniendo los requisitos del ADR 0004 (JSON contractual, reintentos acotados, `prompt_version` persistido junto a `checklist_version`).
2. **Implementación del motor de prompts:** **Python** como lenguaje acordado para el servicio que arma el prompt, llama a Claude y devuelve JSON validado (en la frontera: esquemas compartidos o **Pydantic** en Python alineado a los mismos contratos; ver preguntas abiertas).
3. **NestJS** continúa como **API de dominio** y **única capa responsable de escritura en Postgres** vía Prisma (crear auditoría, captura, solicitar evaluación, guardar resultado validado). El servicio Python **entrega** JSON; **no** escribe en Supabase salvo decisión explícita futura documentada en ADR.
4. **AWS — preferencia de equipo (propuesta técnica integral):** exponer el servicio Python detrás de **Amazon API Gateway** invocando **AWS Lambda** (función Python). **Alternativas** si no encajan límites de tiempo, tamaño de payload o operación: **Amazon ECS** (Fargate) o **EC2** con el mismo contrato HTTP/JSON hacia Nest.
5. **Integración Nest ↔ AWS:** comunicación **REST/JSON** entre NestJS y API Gateway (autenticación de servicio a definir: API keys firmadas, IAM, mTLS o JWT interno; ver preguntas abiertas).
6. **Frontend:** no cambia el principio contract-first: el cliente solo habla con **HTTPS** hacia Next y/o API pública de Nest; **nunca** embebe claves de Claude.

## Preguntas abiertas (hasta cerrar con Camila / TI)

Tomadas de la [propuesta técnica integral](../PROPUESTA_TECNICA_INTEGRAL.md) §5:

- **Lambda vs ECS:** límites de tiempo, costo y tamaño de respuesta para el JSON completo de 39 criterios.
- **Contratos en Python:** ¿**Pydantic** generado o mantenido a mano alineado a Zod, o validación solo en Nest tras recibir JSON opaco?
- **Seguridad:** mecanismo concreto de autenticación **Nest → API Gateway** y rotación de secretos.
- **Persistencia:** confirmar que **solo Nest + Prisma** escriben en `audits` / resultados (por defecto en este ADR).

## Consecuencias

- **Positivo:** separación clara entre “dominio Nest + datos” y “motor de evaluación en Python”; escalado bajo demanda en AWS; diagrama unificado en [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md).
- **Negativo:** dos runtimes (Node y Python) y frontera cloud a operar, desplegar y observar; contratos deben mantenerse alineados entre servicios.
- **Deuda / siguiente paso:** definir auth Nest ↔ API Gateway; pipelines CI que incluyan contratos y, cuando exista código Python, tests y despliegue; **Docker** local para el servicio Python según propuesta técnica.

## Alternativas

- **Orquestar Claude solo desde NestJS (TypeScript):** un solo runtime; el equipo priorizó Python para prompts y reglas.
- **Edge / Serverless único sin Nest:** simplificaría despliegue pero choca con ADR 0005 y con la necesidad de Prisma y políticas de datos en servidor de aplicación.

## Relación con otros ADR

- **0004:** sigue mandando el **contrato** y la **validación** de la respuesta LLM.
- **0005:** NestJS + Prisma siguen siendo la **API y persistencia**; este ADR **añade** el rol del servicio Python + Claude y del hosting AWS (API Gateway + Lambda por defecto).
- **0007:** [Modelo lógico, formato de entrada y parseo (pre-conexiones)](0007-modelo-datos-parseo-pre-conexiones.md) — matriz de campos, flujo de validación y preguntas abiertas de persistencia **antes** de cerrar detalle operativo de esta topología.
