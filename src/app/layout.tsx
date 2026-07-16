import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thoth - Sistema de Conocimiento Jurídico",
  description: "Plataforma de entrenamiento y consulta de normativa oficial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}
