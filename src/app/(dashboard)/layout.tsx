'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="logo-container">
                    <div className="logo-icon">T</div>
                    <div className="logo-text">THOTH</div>
                </div>
                <nav className="sidebar-nav" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
                    <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} style={{ textDecoration: 'none', color: pathname === '/' ? '#fff' : 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', background: pathname === '/' ? 'rgba(255, 107, 0, 0.1)' : 'transparent', border: pathname === '/' ? '1px solid var(--border-color)' : '1px solid transparent' }}>
                        🏠 Inicio
                    </Link>
                    <Link href="/activity" className={`nav-link ${pathname === '/activity' ? 'active' : ''}`} style={{ textDecoration: 'none', color: pathname === '/activity' ? '#fff' : 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', background: pathname === '/activity' ? 'rgba(255, 107, 0, 0.1)' : 'transparent', border: pathname === '/activity' ? '1px solid var(--border-color)' : '1px solid transparent' }}>
                        🧠 Actividad
                    </Link>
                    <Link href="/search" className={`nav-link ${pathname === '/search' ? 'active' : ''}`} style={{ textDecoration: 'none', color: pathname === '/search' ? '#fff' : 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', background: pathname === '/search' ? 'rgba(255, 107, 0, 0.1)' : 'transparent', border: pathname === '/search' ? '1px solid var(--border-color)' : '1px solid transparent' }}>
                        💬 Consultas
                    </Link>
                    <Link href="/competence" className={`nav-link ${pathname === '/competence' ? 'active' : ''}`} style={{ textDecoration: 'none', color: pathname === '/competence' ? '#fff' : 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', background: pathname === '/competence' ? 'rgba(255, 107, 0, 0.1)' : 'transparent', border: pathname === '/competence' ? '1px solid var(--border-color)' : '1px solid transparent' }}>
                        📊 Competencia
                    </Link>
                    <Link href="/settings" className={`nav-link ${pathname === '/settings' ? 'active' : ''}`} style={{ textDecoration: 'none', color: pathname === '/settings' ? '#fff' : 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', background: pathname === '/settings' ? 'rgba(255, 107, 0, 0.1)' : 'transparent', border: pathname === '/settings' ? '1px solid var(--border-color)' : '1px solid transparent' }}>
                        ⚙️ Configuración
                    </Link>
                </nav>
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="nav-link" style={{ width: '100%', textAlign: 'left', background: 'transparent', cursor: 'pointer', color: 'var(--danger)', padding: '0.75rem 1rem', border: 'none', fontSize: '1rem' }}>
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
