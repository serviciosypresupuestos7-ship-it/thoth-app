export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="logo-container">
                    <div className="logo-icon">T</div>
                    <div className="logo-text">THOTH</div>
                </div>
                <nav className="nav-links" style={{ flex: 1 }}>
                    <a href="/" className="nav-link">🏠 Inicio</a>
                    <a href="/search" className="nav-link">💬 Consultas</a>
                    <a href="/review" className="nav-link">✅ Validación</a>
                </nav>
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="nav-link" style={{ width: '100%', textAlign: 'left', background: 'transparent', cursor: 'pointer', color: 'var(--error)' }}>
                            🚪 Cerrar Sesión
                        </button>
                    </form>
                </div>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    )
}
