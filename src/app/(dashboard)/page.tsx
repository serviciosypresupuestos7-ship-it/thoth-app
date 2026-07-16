'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DomainStats {
  id: string;
  display_name: string;
  documents_count: number;
  chunks_count: number;
  pending_exercises: number;
  approved_exercises: number;
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

        // Count chunks
        const { count: chunksCount, error: chunksError } = await supabase
          .from('legal_chunks')
          .select('*', { count: 'exact', head: true })
          .eq('domain_id', domain.id);

        // Count pending exercises
        const { count: pendingCount, error: pendingError } = await supabase
          .from('training_exercises')
          .select('*', { count: 'exact', head: true })
          .eq('domain_id', domain.id)
          .eq('review_status', 'pending');

        // Count approved exercises
        const { count: approvedCount, error: approvedError } = await supabase
          .from('training_exercises')
          .select('*', { count: 'exact', head: true })
          .eq('domain_id', domain.id)
          .eq('review_status', 'approved');

        if (docsError || chunksError || pendingError || approvedError) {
          console.error('Error fetching counts for domain', domain.id);
        }

        statsData.push({
          id: domain.id,
          display_name: domain.display_name,
          documents_count: docsCount || 0,
          chunks_count: chunksCount || 0,
          pending_exercises: pendingCount || 0,
          approved_exercises: approvedCount || 0,
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
          documents_count: 14,
          chunks_count: 128,
          pending_exercises: 12,
          approved_exercises: 45,
        },
        {
          id: 'autonomos',
          display_name: 'Autónomos',
          documents_count: 5,
          chunks_count: 42,
          pending_exercises: 8,
          approved_exercises: 15,
        },
        {
          id: 'laboral',
          display_name: 'Laboral',
          documents_count: 0,
          chunks_count: 0,
          pending_exercises: 0,
          approved_exercises: 0,
        },
        {
          id: 'fiscal',
          display_name: 'Fiscal',
          documents_count: 0,
          chunks_count: 0,
          pending_exercises: 0,
          approved_exercises: 0,
        },
        {
          id: 'empresa',
          display_name: 'Mercantil',
          documents_count: 0,
          chunks_count: 0,
          pending_exercises: 0,
          approved_exercises: 0,
        },
        {
          id: 'prevencion',
          display_name: 'Prevención de Riesgos',
          documents_count: 0,
          chunks_count: 0,
          pending_exercises: 0,
          approved_exercises: 0,
        },
        {
          id: 'proteccion_datos',
          display_name: 'Protección de Datos',
          documents_count: 0,
          chunks_count: 0,
          pending_exercises: 0,
          approved_exercises: 0,
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
        setMessage({ text: `Procesamiento completado con éxito: ${data.message}`, type: 'success' });
        fetchStats();
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err: any) {
      setMessage({ text: `Error al procesar: ${err.message}`, type: 'error' });
    } finally {
      setProcessingDomain(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: '1.2' }}>
          THOTH convierte legislación en conocimiento jurídico utilizable.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.6' }}>
          THOTH no busca leyes. Descubre qué normas son realmente relevantes para resolver un problema jurídico. Analiza la normativa, identifica automáticamente derechos, obligaciones y plazos, y la transforma en una red de conocimiento estructurado.
        </p>
      </div>

      {message && (
        <div className={`badge ${message.type === 'success' ? 'badge-success' : 'badge-danger'}`} style={{ width: '100%', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textTransform: 'none', fontSize: '0.95rem' }}>
          {message.text}
        </div>
      )}

      <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        Estado del conocimiento jurídico
      </h2>


      {/* Novedades y Descubrimientos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '3rem' }}>
        {/* Cambios Normativos */}
        <div className="card" style={{ background: 'linear-gradient(145deg, rgba(255, 107, 0, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔔</span> Cambios Normativos
          </h3>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#fff', lineHeight: '1' }}>8</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Detectados esta semana</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Pendientes de revisar</span>
            <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>3</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Conocimiento actualizado</span>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Hace 2 horas</span>
          </div>
        </div>

        {/* Descubrimientos Recientes */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Descubrimientos Recientes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Nueva Relación Detectada</div>
              <div style={{ color: '#fff' }}>Conexión identificada entre el <strong>Art. 14 del AI Act</strong> y el <strong>Art. 22 del RGPD</strong> sobre decisiones automatizadas.</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--success)', marginBottom: '0.25rem' }}>Nueva Guía Oficial</div>
              <div style={{ color: '#fff' }}>Se ha vinculado la nueva <strong>FAQ de la AESIA</strong> a 4 obligaciones ya existentes en el dominio de IA.</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--warning)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--warning)', marginBottom: '0.25rem' }}>Oportunidades Pendientes</div>
              <div style={{ color: '#fff' }}><strong>2 nuevas oportunidades jurídicas</strong> identificadas en la última actualización del Estatuto de los Trabajadores.</div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Sincronizando conocimiento...
        </div>
      ) : (
        <div className="grid">
          {stats.map((domain) => (
            <div key={domain.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{domain.display_name}</h3>
                <span className="badge badge-primary">Activo</span>
              </div>


              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '1rem 0' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Normas Base</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>{domain.documents_count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fragmentos</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>{domain.chunks_count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Por Validar</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--warning)' }}>{domain.pending_exercises}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aprobado</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success)' }}>{domain.approved_exercises}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Última actualización:</span>
                <span style={{ color: '#fff' }}>Hoy, 08:30</span>
              </div>


              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <a href={`/review?domain=${domain.id}`} className="btn btn-secondary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                  Validar
                </a>
                <button
                  onClick={() => handleProcessDomain(domain.id)}
                  disabled={processingDomain !== null}
                  className="btn btn-primary"
                  style={{ flex: 1.2 }}
                >
                  {processingDomain === domain.id ? 'Analizando...' : 'Sincronizar normativa'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
