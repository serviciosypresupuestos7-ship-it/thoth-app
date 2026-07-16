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
  status_indicator: 'green' | 'yellow' | 'red' | 'gray';
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
    const allDomains = [
      { id: 'civil', display_name: 'Civil' },
      { id: 'mercantil', display_name: 'Mercantil' },
      { id: 'laboral', display_name: 'Laboral' },
      { id: 'fiscal', display_name: 'Fiscal' },
      { id: 'penal', display_name: 'Penal' },
      { id: 'administrativo', display_name: 'Administrativo' },
      { id: 'procesal', display_name: 'Procesal' },
      { id: 'constitucional', display_name: 'Constitucional' },
      { id: 'ue', display_name: 'Unión Europea' },
      { id: 'proteccion_datos', display_name: 'Protección de Datos' },
      { id: 'ai_literacy', display_name: 'Inteligencia Artificial' },
      { id: 'autonomos', display_name: 'Autónomos' },
      { id: 'empresas', display_name: 'Empresas' },
      { id: 'contratacion', display_name: 'Contratación Pública' },
      { id: 'prevencion', display_name: 'Prevención de Riesgos' },
      { id: 'consumo', display_name: 'Consumo' },
    ];

    try {
      // Fetch domains
      const { data: dbDomains, error: domainsError } = await supabase
        .from('legal_domains')
        .select('*');

      if (domainsError) throw domainsError;

      const statsData: DomainStats[] = [];

      for (const domainDef of allDomains) {
        // Check if it exists in DB
        const dbDomain = (dbDomains || []).find(d => d.id === domainDef.id);

        if (dbDomain) {
          // Count documents
          const { count: docsCount } = await supabase
            .from('legal_documents')
            .select('*', { count: 'exact', head: true })
            .eq('domain_id', dbDomain.id);

          // Count concepts
          const { count: conceptsCount } = await supabase
            .from('legal_concepts')
            .select('*', { count: 'exact', head: true })
            .eq('domain_id', dbDomain.id);

          // Mock relationships and findings for now
          const relationshipsCount = Math.floor((conceptsCount || 0) * 1.5);
          const findingsCount = Math.floor((conceptsCount || 0) * 0.2);

          // Mock pending count
          const pendingCount = dbDomain.id === 'ai_literacy' ? 5 : (dbDomain.id === 'autonomos' ? 12 : 0);

          // Determine health and status
          let healthScore = 100;
          let status_indicator: 'green' | 'yellow' | 'red' | 'gray' = 'green';

          if (docsCount === 0) {
            healthScore = 0;
            status_indicator = 'gray';
          } else if (pendingCount > 10) {
            healthScore = 65;
            status_indicator = 'red';
          } else if (pendingCount > 0) {
            healthScore = 85;
            status_indicator = 'yellow';
          }

          statsData.push({
            id: dbDomain.id,
            display_name: dbDomain.display_name || domainDef.display_name,
            documents_count: docsCount || 0,
            concepts_count: conceptsCount || 0,
            relationships_count: relationshipsCount,
            findings_count: findingsCount,
            pending_count: pendingCount,
            health_score: healthScore,
            status_indicator
          });
        } else {
          // Empty domain
          statsData.push({
            id: domainDef.id,
            display_name: domainDef.display_name,
            documents_count: 0,
            concepts_count: 0,
            relationships_count: 0,
            findings_count: 0,
            pending_count: 0,
            health_score: 0,
            status_indicator: 'gray'
          });
        }
      }

      setStats(statsData);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      // Fallback
      const fallbackStats = allDomains.map(d => ({
        id: d.id,
        display_name: d.display_name,
        documents_count: 0,
        concepts_count: 0,
        relationships_count: 0,
        findings_count: 0,
        pending_count: 0,
        health_score: 0,
        status_indicator: 'gray' as const
      }));
      setStats(fallbackStats);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'var(--success)';
      case 'yellow': return 'var(--warning)';
      case 'red': return 'var(--danger)';
      case 'gray': return 'var(--text-muted)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'green': return 'Actualizado';
      case 'yellow': return 'Pendiente';
      case 'red': return 'Requiere revisión';
      case 'gray': return 'En preparación';
      default: return 'Desconocido';
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
        Dominios Activos
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Cargando dominios...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {stats.map((domain) => (
            <div key={domain.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>{domain.display_name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(domain.status_indicator) }}></div>
                  <span style={{ fontSize: '0.75rem', color: getStatusColor(domain.status_indicator), fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {getStatusText(domain.status_indicator)}
                  </span>
                </div>
              </div>

              {/* Metrics (Compact) */}
              {domain.status_indicator !== 'gray' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Normas:</span>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>{domain.documents_count}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Conceptos:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{domain.concepts_count}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Relaciones:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{domain.relationships_count}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Hallazgos:</span>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{domain.findings_count}</span>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                  Sin conocimiento cargado
                </div>
              )}

              {/* Footer */}
              {domain.status_indicator !== 'gray' && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Última actualización: 16/07/2026
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a
                  href={domain.status_indicator !== 'gray' ? `/review?domain=${domain.id}` : '#'}
                  className={`btn btn-secondary ${domain.status_indicator === 'gray' ? 'disabled' : ''}`}
                  style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '0.4rem', fontSize: '0.85rem', opacity: domain.status_indicator === 'gray' ? 0.5 : 1, pointerEvents: domain.status_indicator === 'gray' ? 'none' : 'auto' }}
                >
                  Validar
                </a>
                <button
                  onClick={() => handleProcessDomain(domain.id)}
                  disabled={processingDomain !== null}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }}
                >
                  {processingDomain === domain.id ? '...' : 'Actualizar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
