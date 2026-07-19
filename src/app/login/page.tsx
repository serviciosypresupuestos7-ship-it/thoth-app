import { login, signup } from './actions'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { error?: string }
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden', position: 'relative' }}>
            {/* Moving Text Banner */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--primary)', color: 'var(--bg-dark)', padding: '0.5rem', zIndex: 20, overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)' }}>
                <div className="marquee-text">
                    Desarrollamos y demostramos la competencia en IA de tus trabajadores. Ayudamos a las empresas a desarrollar y demostrar la competencia en IA de sus trabajadores mediante formación práctica, evaluación y evidencias. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Desarrollamos y demostramos la competencia en IA de tus trabajadores. Ayudamos a las empresas a desarrollar y demostrar la competencia en IA de sus trabajadores mediante formación práctica, evaluación y evidencias.
                </div>
            </div>

            {/* Left Side - Image */}
            <div className="login-image-container" style={{ position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'url(/thoth-bg-new.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }} />
                {/* Overlay gradient for better blending */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, var(--bg-dark) 100%)'
                }} />

                {/* Philosophy Text */}
                <div style={{
                    position: 'absolute',
                    bottom: '3rem',
                    left: '3rem',
                    maxWidth: '600px',
                    zIndex: 10,
                    padding: '2rem',
                    background: 'rgba(20, 20, 20, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    borderLeft: '4px solid var(--primary)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                        THOTH desarrolla, evalúa y demuestra la competencia en IA de los trabajadores.
                    </h2>
                    <p style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                        Porque la competencia no se declara. Se demuestra.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div style={{ width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark)', padding: '2rem', zIndex: 10, borderLeft: '1px solid var(--border-color)' }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '420px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div className="logo-icon" style={{ margin: '0 auto 1.5rem auto', width: '4rem', height: '4rem', fontSize: '2rem' }}>T</div>
                        <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>THOTH</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Sistema de Gestión de Competencias en IA</p>
                    </div>

                    {searchParams?.error && (
                        <div style={{ padding: '1rem', background: 'var(--error-glow)', color: 'var(--error)', borderRadius: '8px', fontSize: '0.95rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                            {searchParams.error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Identificación (Email)</label>
                        <input id="email" name="email" type="email" required className="form-input" placeholder="usuario@empresa.com" style={{ padding: '1rem', fontSize: '1.05rem' }} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Clave de Acceso</label>
                        <input id="password" name="password" type="password" required className="form-input" placeholder="••••••••" style={{ padding: '1rem', fontSize: '1.05rem' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                        <button formAction={login} className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>Acceder al Sistema</button>
                        <button formAction={signup} className="btn btn-secondary" style={{ padding: '1rem', fontSize: '1.1rem' }}>Solicitar Credenciales</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
