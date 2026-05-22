import {
  EDITORIAL_DEMO_ROUTES,
  type EditorialShortcutPerfil,
} from "@/lib/editorial-demo-routes"

export type { EditorialShortcutPerfil }

/** Atajos editoriales mock — derivado de `EDITORIAL_DEMO_ROUTES` (inventario Clarity §1). */
export const EDITORIAL_AUDIT_SHORTCUTS = EDITORIAL_DEMO_ROUTES.map(
  ({ perfil, perfilLabel, label, url, bordeHex }) => ({
    perfil,
    perfilLabel,
    label,
    url,
    bordeHex,
  }),
) as readonly {
  perfil: EditorialShortcutPerfil
  perfilLabel: string
  label: string
  url: string
  bordeHex: string
}[]
