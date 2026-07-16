import { login, signup } from './actions'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { error?: string }
}) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div className="logo-icon" style={{ margin: '0 auto 1rem auto', width: '3rem', height: '3rem', fontSize: '1.5rem' }}>T</div>
                    <h1 className="title-gradient" style={{ fontSize: '1.8rem' }}>Thoth Login</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Accede a tu panel multi-tenant</p>
                </div>

                {searchParams?.error && (
                    <div style={{ padding: '0.75rem', background: 'var(--error-glow)', color: 'var(--error)', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                        {searchParams.error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input id="email" name="email" type="email" required className="form-input" placeholder="usuario@empresa.com" />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input id="password" name="password" type="password" required className="form-input" placeholder="••••••••" />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button formAction={login} className="btn btn-primary" style={{ flex: 1 }}>Entrar</button>
                    <button formAction={signup} className="btn btn-secondary" style={{ flex: 1 }}>Registrarse</button>
                </div>
            </form>
        </div>
    )
}
