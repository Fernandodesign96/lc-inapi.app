import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider"
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Auditoría de lenguaje claro — INAPI",
  description: "Evaluación asistida del checklist editorial sobre dominios INAPI (mock MVP).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${roboto.variable} ${robotoSlab.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col font-sans text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <main className="flex min-h-0 flex-1 flex-col bg-muted text-foreground">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}