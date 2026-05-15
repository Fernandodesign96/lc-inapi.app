# ADR 0006 — Evaluación LC: Python, Claude API y despliegue AWS

## Estado

Propuesto — 2026-05-13

## Contexto

El [ADR 0004](0004-llm-checklist-evaluation-and-versioning.md) fija que la salida del LLM debe validarse contra los contratos Zod (39 criterios, `strictAuditRecordSchema` cuando aplique el agregado completo) y que las claves no se expongen al cliente. El [ADR 0005](0005-api-backend-nestjs-prisma.md) sitúa la **API de dominio** en **NestJS** con **Prisma** hacia **Supabase**.

El equipo acordó, para la capa de **análisis de lenguaje claro**, usar **Claude API (Anthropic)** con implementación en **Python** (prompts robustos y reglas estrictas) y disponer de un **entorno compartido en AWS** para desarrollo o staging, de modo que el sistema no dependa de máquinas locales encendidas.

Hacía falta explicitar **dónde** vive la orquestación del LLM frente al resto del backend y cómo se integra con el frontend ya previsto.

## Decisión

1. **Proveedor LLM:** **Claude API** para la evaluación asistida del checklist, manteniendo los requisitos del ADR 0004 (JSON contractual, reintentos acotados, `prompt_version` persistido junto a `checklist_version`).
2. **Implementación del motor de prompts:** **Python** como lenguaje acordado para el servicio o jobs que arman el prompt, llaman a Claude y devuelven JSON validado (en la frontera se puede reutilizar validación vía esquemas compartidos o duplicación controlada hasta unificar runtime).
3. **NestJS** continúa como **API de dominio** y **persistencia** (Prisma, auth de aplicación, orquestación de flujo “crear auditoría → captura → solicitar evaluación → guardar”). La llamada al componente Python puede modelarse como: **HTTP interno**, cola de mensajes o invocación en proceso, según diseño detallado de despliegue (no fijado en este ADR).
4. **AWS:** uso de **infraestructura compartida** (al menos entorno de desarrollo o staging) para API, workers y/o servicio Python; la topología exacta (EC2, ECS, Lambda, etc.) se define con quien lidera infraestructura y TI INAPI.
5. **Frontend:** no cambia el principio contract-first: el cliente solo habla con **HTTPS** hacia Next y/o API pública; **nunca** embebe claves de Claude.

## Consecuencias

- **Positivo:** separación clara entre “dominio Nest + datos” y “motor de evaluación en Python”; encaje con competencias del equipo; entorno estable en la nube.
- **Negativo:** dos runtimes (Node y Python) a operar, desplegar y observar; contratos y versiones de esquema deben mantenerse alineados entre servicios.
- **Deuda / siguiente paso:** diagramar en [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) el flujo concreto (síncrono vs cola) y actualizar pipelines CI cuando existan.

## Alternativas

- **Orquestar Claude solo desde NestJS (TypeScript):** un solo runtime; el equipo priorizó Python para prompts y reglas.
- **Edge / Serverless único sin Nest:** simplificaría despliegue pero choca con ADR 0005 y con la necesidad de Prisma y políticas de datos en servidor de aplicación.

## Relación con otros ADR

- **0004:** sigue mandando el **contrato** y la **validación** de la respuesta LLM.
- **0005:** NestJS + Prisma siguen siendo la **API y persistencia**; este ADR **añade** el rol del servicio Python + Claude y del hosting AWS.
