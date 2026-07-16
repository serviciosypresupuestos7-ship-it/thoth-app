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
          <aside className="sidebar">
            <div className="logo-container">
              <div className="logo-icon">T</div>
              <div className="logo-text">THOTH</div>
            </div>
            <nav className="nav-links">
              <a href="/" className="nav-link">🏠 Inicio</a>
              <a href="/knowledge" className="nav-link">📚 Conocimiento</a>
              <a href="/search" className="nav-link">💬 Consultas</a>
              <a href="/review" className="nav-link">✅ Validación</a>
              <a href="/analytics" className="nav-link">📊 Analítica</a>
              <a href="/settings" className="nav-link">⚙️ Sistema</a>
            </nav>
          </aside>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
