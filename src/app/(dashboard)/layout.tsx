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

    const menus = {
        worker: [
            { href: '/worker/panel', icon: '🏠', label: 'Panel' },
            { href: '/worker/misiones', icon: '🎯', label: 'Misiones' },
            { href: '/worker/competencias', icon: '🧠', label: 'Competencias' },
            { href: '/worker/formacion', icon: '📖', label: 'Formación' },
            { href: '/worker/progreso', icon: '📈', label: 'Progreso' },
            { href: '/worker/laboratorio', icon: '🤖', label: 'Laboratorio IA' },
        ],
        hr: [
            { href: '/hr/panel', icon: '🏠', label: 'Panel' },
            { href: '/hr/empleados', icon: '👥', label: 'Empleados' },
            { href: '/hr/rutas', icon: '🛤️', label: 'Rutas formativas' },
            { href: '/hr/formacion', icon: '📖', label: 'Formación' },
            { href: '/hr/competencias', icon: '🧠', label: 'Competencias' },
            { href: '/hr/informes', icon: '📊', label: 'Informes' },
            { href: '/hr/evidencias', icon: '📋', label: 'Evidencias' },
            { href: '/hr/actualizaciones', icon: '🔔', label: 'Actualizaciones' },
            { href: '/hr/configuracion', icon: '⚙️', label: 'Configuración' },
        ],
        admin: [
            { href: '/admin/empresas', icon: '🏢', label: 'Empresas' },
            { href: '/admin/usuarios', icon: '👥', label: 'Usuarios' },
            { href: '/admin/contenidos', icon: '📚', label: 'Contenidos' },
            { href: '/admin/normativa', icon: '⚖️', label: 'Normativa' },
            { href: '/admin/validacion', icon: '✅', label: 'Validación' },
            { href: '/admin/planes', icon: '💳', label: 'Planes y facturación' },
            { href: '/admin/modelos', icon: '🤖', label: 'Modelos IA' },
            { href: '/admin/informes', icon: '📊', label: 'Informes globales' },
            { href: '/admin/configuracion', icon: '⚙️', label: 'Configuración' },
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
                
                {/* Role Switcher for Development/Demo purposes */}
                <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vista actual</div>
                    <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '8px' }}>
                        <Link href="/worker/panel" style={{ flex: 1, textAlign: 'center', padding: '0.25rem', fontSize: '0.75rem', borderRadius: '4px', textDecoration: 'none', background: role === 'worker' ? 'var(--primary-color)' : 'transparent', color: role === 'worker' ? '#fff' : 'var(--text-secondary)' }}>Trabajador</Link>
                        <Link href="/hr/panel" style={{ flex: 1, textAlign: 'center', padding: '0.25rem', fontSize: '0.75rem', borderRadius: '4px', textDecoration: 'none', background: role === 'hr' ? 'var(--primary-color)' : 'transparent', color: role === 'hr' ? '#fff' : 'var(--text-secondary)' }}>RRHH</Link>
                        <Link href="/admin/empresas" style={{ flex: 1, textAlign: 'center', padding: '0.25rem', fontSize: '0.75rem', borderRadius: '4px', textDecoration: 'none', background: role === 'admin' ? 'var(--primary-color)' : 'transparent', color: role === 'admin' ? '#fff' : 'var(--text-secondary)' }}>Admin</Link>
                    </div>
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
