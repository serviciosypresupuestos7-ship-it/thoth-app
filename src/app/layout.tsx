import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thoth - Sistema de Conocimiento Jurídico",
  description: "Plataforma de entrenamiento y consulta de normativa oficial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div className="app-container">
          <header className="header">
            <div className="logo-container">
              <div className="logo-icon">T</div>
              <div className="logo-text">THOTH</div>
            </div>
            <nav className="nav-links">
              <a href="/" className="nav-link">Panel de Control</a>
              <a href="/search" className="nav-link">Búsqueda Estratégica</a>
              <a href="/review" className="nav-link">Revisión Humana</a>
            </nav>
          </header>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
