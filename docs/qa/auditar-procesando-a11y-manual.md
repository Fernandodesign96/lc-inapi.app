# Checklist manual a11y — `/auditar/procesando`

Este documento se completa **como último paso de la Fase 1** antes de la reunión con **Equipo UX**: marcar las casillas al probar en navegador y anotar observaciones adicionales (no sustituye notas en el devlog si hay decisiones de producto).

## Preparación
- [ ] Navegador actualizado; zoom 100 %.
- [ ] Probar en **tema claro** y **tema oscuro** (SiteHeader).
- [ ] Probar con **Reduce motion** activado (SO: macOS “Reducir movimiento” / Windows “Mostrar animaciones” desactivado).

## Rutas felices
- [ ] **Atajo 1 → procesando → resultado:** con teclado, al llegar a procesando el foco debería ir al título (si implementaste foco en `h1`) o al menos Tab llega al botón en pocos pasos.
- [ ] **Atajo 2 y 3:** mismo flujo.
- [ ] **Captura → “Continuar al resultado”:** pasa por procesando y luego resultado.
- [ ] **Spinner:** con reduce motion, **no** debe girar de forma continua; el texto de estado sigue siendo comprensible.

## Errores y bordes
- [ ] Abrir `/auditar/procesando` **sin** `?url=` → redirección o mensaje coherente; lector de pantalla anuncia el estado (si solo hay texto breve, está bien).
- [ ] `?url=` **inválida** (ej. `foo`) → no se queda colgado; vuelve a `/auditar` o mensaje claro.
- [ ] **Cancelar y Volver:** Enter/Space en el botón lleva a `/auditar`; foco visible (anillo).

## Historial y tiempo
- [ ] Tras llegar a **resultado**, **Atrás** del navegador no entra en bucle infinito con procesando (esperable con `replace` al resultado).
- [ ] Si cancelás antes del timeout, **no** debería navegar a resultado después (cleanup del `setTimeout`).

## Contenido accesible
- [ ] Existe un solo `h1` con el título de la pantalla.
- [ ] Bloque de descripción con `role="status"` y `aria-live="polite"` (no spamea en cada render).
- [ ] Spinner con `role="progressbar"` y `aria-label` descriptivo (sin `aria-valuenow` en indeterminado).

## Lighthouse / axe (opcional)
- [ ] Lighthouse Accessibility ≥ 90 en esta URL (o 0 violaciones críticas en axe).