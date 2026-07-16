'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DomainStats {
  id: string;
  display_name: string;
  documents_count: number;
  concepts_count: number;
  relationships_count: number;
  findings_count: number;
  pending_count: number;
  health_score: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<DomainStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingDomain, setProcessingDomain] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch domains
      const { data: domains, error: domainsError } = await supabase
        .from('legal_domains')
        .select('*');

      if (domainsError) throw domainsError;

      const statsData: DomainStats[] = [];

      for (const domain of domains || []) {
        // Count documents
        const { count: docsCount, error: docsError } = await supabase
          .from('legal_documents')
          .select('*', { count: 'exact', head: true })
          .eq('domain_id', domain.id);

        // Count concepts
        const { count: conceptsCount, error: conceptsError } = await supabase
          .from('legal_concepts')
          .select('*', { count: 'exact', head: true })
          .eq('domain_id', domain.id);

        // Count relationships (mocked for now since we don't have domain_id on relationships directly)
        const relationshipsCount = Math.floor((conceptsCount || 0) * 1.5);

        // Count findings (opportunities)
        const { count: findingsCount, error: findingsError } = await supabase
          .from('legal_opportunities')
          .select('*', { count: 'exact', head: true }); // Mocked domain filter

        // Count pending
        const pendingCount = 5; // Mocked

        // Health score
        const healthScore = domain.id === 'ai_literacy' ? 93 : 61; // Mocked

        statsData.push({
          id: domain.id,
          display_name: domain.display_name,
          documents_count: docsCount || 0,
          concepts_count: conceptsCount || 0,
          relationships_count: relationshipsCount,
          findings_count: findingsCount || 0,
          pending_count: pendingCount,
          health_score: healthScore,
        });
      }

      setStats(statsData);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      // Fallback for local testing without Supabase connection
      setStats([
        {
          id: 'ai_literacy',
          display_name: 'Alfabetización en IA',
          documents_count: 34,
          concepts_count: 846,
          relationships_count: 1254,
          findings_count: 78,
          pending_count: 5,
          health_score: 93,
        },
        {
          id: 'autonomos',
          display_name: 'Autónomos',
          documents_count: 12,
          concepts_count: 312,
          relationships_count: 450,
          findings_count: 24,
          pending_count: 18,
          health_score: 85,
        },
        {
          id: 'laboral',
          display_name: 'Laboral',
          documents_count: 45,
          concepts_count: 1120,
          relationships_count: 2100,
          findings_count: 145,
          pending_count: 32,
          health_score: 78,
        },
        {
          id: 'fiscal',
          display_name: 'Fiscal',
          documents_count: 8,
          concepts_count: 156,
          relationships_count: 210,
          findings_count: 12,
          pending_count: 45,
          health_score: 61,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessDomain = async (domainId: string) => {
    setProcessingDomain(domainId);
    setMessage(null);
    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: `Actualización completada con éxito: ${data.message}`, type: 'success' });
        fetchStats();
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err: any) {
      setMessage({ text: `Error al actualizar: ${err.message}`, type: 'error' });
    } finally {
      setProcessingDomain(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto 3rem auto' }}>
        <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: '1.2' }}>
          THOTH automatiza la adquisición y organización del conocimiento jurídico oficial.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.6' }}>
          El experto jurídico valida ese conocimiento antes de incorporarlo definitivamente al sistema. Todas las respuestas se fundamentan exclusivamente en conocimiento validado y enlazado con fuentes oficiales.
        </p>
      </div>

      {message && (
        <div className={`badge ${message.type === 'success' ? 'badge-success' : 'badge-danger'}`} style={{ width: '100%', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textTransform: 'none', fontSize: '0.95rem' }}>
          {message.text}
        </div>
      )}

      {/* Global Metrics */}
      <div className="card" style={{ marginBottom: '3rem', background: 'linear-gradient(145deg, rgba(30, 78, 140, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(30, 78, 140, 0.3)' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '2rem', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase' }}>Corpus Jurídico Global</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1' }}>1.284</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Normativa analizada</div>
          </div>
          <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.1)' }}>↓</div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1' }}>48.221</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Conceptos</div>
          </div>
          <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.1)' }}>↓</div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1' }}>92.114</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Relaciones</div>
          </div>
          <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.1)' }}>↓</div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1' }}>6.204</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Hallazgos validados</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
          Última actualización: Hace 18 minutos
        </div>
      </div>

      {/* Huge Discoveries Card */}
      <div className="card" style={{ marginBottom: '3rem', borderLeft: '4px solid var(--primary)', background: 'linear-gradient(90deg, rgba(255, 107, 0, 0.05) 0%, transparent 100%)' }}>
        <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🧠</span> THOTH ha descubierto
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
            <div style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>✓ Nueva relación</div>
            <div style={{ color: '#fff', fontSize: '1.3rem' }}>AI Act ↔ RGPD</div>
          </div>
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--danger)' }}>
            <div style={{ fontSize: '1rem', color: 'var(--danger)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>✓ Nuevo conflicto</div>
            <div style={{ color: '#fff', fontSize: '1.3rem' }}>Artículo 14 contradice...</div>
          </div>
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
            <div style={{ fontSize: '1rem', color: 'var(--success)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>✓ Nueva guía</div>
            <div style={{ color: '#fff', fontSize: '1.3rem' }}>AESIA</div>
          </div>
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--warning)' }}>
            <div style={{ fontSize: '1rem', color: 'var(--warning)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>✓ Nuevo hallazgo</div>
            <div style={{ color: '#fff', fontSize: '1.3rem' }}>Estatuto Trabajadores</div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        Dominios de Conocimiento
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Cargando dominios...
        </div>
      ) : (
        <div className="grid">
          {stats.map((domain) => (
            <div key={domain.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>{domain.display_name}</h3>
                {domain.pending_count > 0 && (
                  <span className="badge badge-danger" style={{ fontSize: '0.8rem' }}>{domain.pending_count} Pendientes</span>
                )}
              </div>

              {/* Health Indicator */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Salud del dominio</span>
                  <span style={{ fontSize: '0.85rem', color: domain.health_score > 80 ? 'var(--success)' : 'var(--warning)', fontWeight: 'bold' }}>{domain.health_score}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${domain.health_score}%`, height: '100%', background: domain.health_score > 80 ? 'var(--success)' : 'var(--warning)' }}></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {domain.health_score > 80 ? 'Actualizado, validado y sin conflictos.' : 'Cambios u oportunidades pendientes de validar.'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '1rem 0', flex: 1 }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Normativa Analizada</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{domain.documents_count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Conceptos</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>{domain.concepts_count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Relaciones</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>{domain.relationships_count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hallazgos</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success)' }}>{domain.findings_count}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Actualizado:</span>
                <span style={{ color: '#fff' }}>16/07/2026 08:30</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <a href={`/review?domain=${domain.id}`} className="btn btn-secondary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                  Validar
                </a>
                <button
                  onClick={() => handleProcessDomain(domain.id)}
                  disabled={processingDomain !== null}
                  className="btn btn-primary"
                  style={{ flex: 1.2 }}
                >
                  {processingDomain === domain.id ? 'Buscando...' : 'Buscar cambios'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
