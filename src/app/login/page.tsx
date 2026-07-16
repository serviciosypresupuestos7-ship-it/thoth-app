import { login, signup } from './actions'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { error?: string }
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}>
            {/* Left Side - Image */}
            <div className="login-image-container">
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'url(/thoth-bg.png)',
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
            </div>

            {/* Right Side - Login Form */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark)', padding: '2rem' }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '420px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div className="logo-icon" style={{ margin: '0 auto 1.5rem auto', width: '4rem', height: '4rem', fontSize: '2rem' }}>T</div>
                        <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>THOTH</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Sistema Operativo del Conocimiento Jurídico</p>
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
