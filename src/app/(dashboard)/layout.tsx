'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    // Determine role based on URL path
    let role = 'worker'; // default
    if (pathname.startsWith('/hr')) role = 'hr';
    if (pathname.startsWith('/admin')) role = 'admin';
    if (pathname.startsWith('/escudo-digital')) role = 'escudo';

    const menus = {
        worker: [
            { href: '/worker/panel', icon: '🏠', label: 'Mi Panel' },
            { href: '/worker/autoevaluacion', icon: '📋', label: 'Test Previo' },
            { href: '/worker/cualificacion', icon: '🎓', label: 'Mi Cualificación' },
            { href: '/worker/simulador', icon: '🤖', label: 'Simulador IA' },
            { href: '/worker/progreso', icon: '📊', label: 'Mi Progreso' },
            { href: '/worker/competencias', icon: '🧠', label: 'Competencias' },
        ],
        hr: [
            { href: '/hr/panel', icon: '📊', label: 'Panel Principal' },
            { href: '/hr/empleados', icon: '👥', label: 'Plantilla' },
            { href: '/hr/documentos', icon: '📁', label: 'Gestor Documental' },
            { href: '/hr/politicas', icon: '📝', label: 'Política de IA' },
            { href: '/hr/certificaciones', icon: '📜', label: 'Certificaciones' },
            { href: '/hr/evidencias', icon: '🛡️', label: 'Evidencias Legales' },
        ],
        admin: [
            { href: '/admin/empresas', icon: '🏢', label: 'Empresas' },
            { href: '/admin/knowledge-studio', icon: '🧠', label: 'Generador de Temarios' },
            { href: '/admin/marcos', icon: '🧩', label: 'Marcos Competenciales' },
            { href: '/admin/normativa', icon: '⚖️', label: 'Normativa' },
            { href: '/admin/modelos', icon: '🤖', label: 'IA' },
            { href: '/admin/planes', icon: '💳', label: 'Facturación' },
            { href: '/admin/informes', icon: '📊', label: 'Estadísticas' },
            { href: '/admin/infraestructura', icon: '⚡', label: 'Estado del Sistema' },
            { href: '/admin/configuracion', icon: '⚙️', label: 'Configuración' },
        ],
        escudo: [
            { href: '/escudo-digital', icon: '📄', label: 'Escudo Digital (Dossier)' },
            { href: '/hr/politicas', icon: '📝', label: 'Asistente Redactor Legal' },
        ]
    };

    const currentMenu = menus[role as keyof typeof menus];

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="logo-container">
                    <div className="logo-icon">T</div>
                    <div className="logo-text">THOTH</div>
                </div>

                <nav className="sidebar-nav" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.5rem', overflowY: 'auto' }}>
                    {currentMenu.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                                style={{
                                    textDecoration: 'none',
                                    color: isActive ? '#fff' : 'var(--text-secondary)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    background: isActive ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                                    border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                <span style={{ fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', padding: '1rem' }}>
                    <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--warning)', marginBottom: '0.5rem', textAlign: 'center', fontWeight: 'bold', letterSpacing: '0.05em' }}>MODO SOPORTE: VER COMO</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                            <Link href="/worker/panel" style={{ textAlign: 'center', padding: '0.25rem', fontSize: '0.7rem', borderRadius: '4px', textDecoration: 'none', background: role === 'worker' ? 'var(--primary)' : 'transparent', color: role === 'worker' ? '#000' : 'var(--text-secondary)' }}>Trabajador</Link>
                            <Link href="/hr/panel" style={{ textAlign: 'center', padding: '0.25rem', fontSize: '0.7rem', borderRadius: '4px', textDecoration: 'none', background: role === 'hr' ? 'var(--primary)' : 'transparent', color: role === 'hr' ? '#000' : 'var(--text-secondary)' }}>R. Humanos</Link>
                            <Link href="/admin/empresas" style={{ textAlign: 'center', padding: '0.25rem', fontSize: '0.7rem', borderRadius: '4px', textDecoration: 'none', background: role === 'admin' ? 'var(--primary)' : 'transparent', color: role === 'admin' ? '#000' : 'var(--text-secondary)' }}>ADM</Link>
                            <Link href="/escudo-digital" style={{ textAlign: 'center', padding: '0.25rem', fontSize: '0.7rem', borderRadius: '4px', textDecoration: 'none', background: role === 'escudo' ? 'var(--primary)' : 'transparent', color: role === 'escudo' ? '#000' : 'var(--text-secondary)' }}>E. Digital</Link>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="nav-link" style={{ width: '100%', textAlign: 'left', background: 'transparent', cursor: 'pointer', color: 'var(--danger)', padding: '0.75rem 1rem', border: 'none', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '8px' }}>
                            <span>🚪</span> Cerrar Sesión
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
