'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
          display_name: 'Alfabetización en IA y Normativa',
          documents_count: 14,
          chunks_count: 128,
          pending_exercises: 12,
          approved_exercises: 45,
        },
        {
          id: 'autonomos',
          display_name: 'Normativa para Autónomos',
          documents_count: 5,
          chunks_count: 42,
          pending_exercises: 8,
          approved_exercises: 15,
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
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Panel de Conocimiento Jurídico
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Gestiona, clasifica y genera ejercicios prácticos a partir de normativas oficiales.
        </p>
      </div>

      {message && (
        <div className={`badge ${message.type === 'success' ? 'badge-success' : 'badge-danger'}`} style={{ width: '100%', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textTransform: 'none', fontSize: '0.95rem' }}>
          {message.text}
        </div>
      )}

      <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        Dominios de Conocimiento Activos
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Cargando estadísticas de dominios...
        </div>
      ) : (
        <div className="grid">
          {stats.map((domain) => (
            <div key={domain.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{domain.display_name}</h3>
                <span className="badge badge-primary">{domain.id}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '0.5rem 0' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Documentos</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{domain.documents_count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fragmentos (Chunks)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{domain.chunks_count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ejercicios Pendientes</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>{domain.pending_exercises}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ejercicios Aprobados</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{domain.approved_exercises}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <a href={`/review?domain=${domain.id}`} className="btn btn-secondary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                  Revisar
                </a>
                <button
                  onClick={() => handleProcessDomain(domain.id)}
                  disabled={processingDomain !== null}
                  className="btn btn-primary"
                  style={{ flex: 1.2 }}
                >
                  {processingDomain === domain.id ? 'Procesando...' : 'Procesar IA'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
