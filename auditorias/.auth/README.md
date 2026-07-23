# Sesión Playwright — tramites.inapi.cl

Este directorio guarda el **estado de sesión** (`storageState`) tras login manual con ClaveÚnica o Clave INAPI.

## Archivos

| Archivo | Generado por | Versionar en git |
| --- | --- | --- |
| `tramites-session.json` | `playwright codegen --save-storage=...` | **No** — contiene cookies activas |

## Crear o renovar sesión (WSL)

```bash
bun x playwright codegen https://tramites.inapi.cl/Account/Login \
  --save-storage=auditorias/.auth/tramites-session.json
```

## Uso

```bash
bun run capture:tramites-html -- --url "https://..." --slug "..." --date "YYYY-MM-DD"
```

Ver [`docs/fase-3-3-captura-auth-claveunica.md`](../../docs/fase-3-3-captura-auth-claveunica.md).
