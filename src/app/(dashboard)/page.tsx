'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Mission {
  id: string;
  title: string;
  description: string;
  target_action: string;
  difficulty: string;
  status: string;
}

interface EmployeeAction {
  action_name: string;
}

export default function HomePage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [actions, setActions] = useState<EmployeeAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch employee actions
      const { data: actionsData, error: actionsError } = await supabase
        .from('employee_actions')
        .select('action_name')
        .eq('employee_id', user.id);

      if (actionsError) throw actionsError;

      // If no actions, set some defaults for demo purposes
      const userActions = actionsData && actionsData.length > 0
        ? actionsData
        : [{ action_name: 'Redactar correos' }, { action_name: 'Resumir documentos' }];

      setActions(userActions);

      // Fetch active missions
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'active')
        .in('target_action', userActions.map(a => a.action_name));

      if (missionsError) throw missionsError;
      setMissions(missionsData || []);

    } catch (err: any) {
      console.error('Error fetching data:', err);
      // Fallback mock data for UI testing if DB is paused
      setActions([{ action_name: 'Redactar correos' }, { action_name: 'Resumir documentos' }]);
      setMissions([
        {
          id: 'mock-1',
          title: 'Redacción de correo con datos sensibles',
          description: 'Un cliente te pide que le envíes por correo el resumen médico de su empleado. ¿Cómo redactas el correo?',
          target_action: 'Redactar correos',
          difficulty: 'medium',
          status: 'active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMission = async (actionName: string) => {
    setGenerating(actionName);
    setMessage(null);
    try {
      const res = await fetch('/api/missions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_name: actionName }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: `Nueva misión generada con éxito.`, type: 'success' });
        fetchData();
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (err: any) {
      setMessage({ text: `Error al generar misión: ${err.message}`, type: 'error' });
    } finally {
      setGenerating(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'var(--success)';
      case 'medium': return 'var(--warning)';
      case 'advanced': return 'var(--danger)';
      default: return 'var(--primary)';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto 3rem auto' }}>
        <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: '1.2' }}>
          Sistema de Competencia en IA
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.6' }}>
          Entrénate en el uso seguro de la Inteligencia Artificial. Completa tus misiones basadas en tus tareas diarias para demostrar tu competencia.
        </p>
      </div>

      {message && (
        <div className={`badge ${message.type === 'success' ? 'badge-success' : 'badge-danger'}`} style={{ width: '100%', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textTransform: 'none', fontSize: '0.95rem' }}>
          {message.text}
        </div>
      )}

      {/* Global Metrics */}
      <div className="card" style={{ marginBottom: '3rem', background: 'linear-gradient(145deg, rgba(30, 78, 140, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(30, 78, 140, 0.3)' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '2rem', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase' }}>Tu Nivel de Competencia</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1' }}>{actions.length}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Acciones Clave</div>
          </div>
          <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.1)' }}>|</div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--warning)', lineHeight: '1' }}>{missions.length}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Misiones Pendientes</div>
          </div>
          <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.1)' }}>|</div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)', lineHeight: '1' }}>0</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Misiones Completadas</div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        Tus Acciones y Misiones
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Cargando misiones...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {actions.map((action, index) => {
            const actionMissions = missions.filter(m => m.target_action === action.action_name);

            return (
              <div key={index} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--primary)' }}>⚡</span> {action.action_name}
                  </h3>
                  <button
                    onClick={() => handleGenerateMission(action.action_name)}
                    disabled={generating === action.action_name}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                  >
                    {generating === action.action_name ? 'Generando...' : '+ Nueva Misión'}
                  </button>
                </div>

                {actionMissions.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    No tienes misiones pendientes para esta acción. ¡Genera una nueva para practicar!
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {actionMissions.map(mission => (
                      <div key={mission.id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: `3px solid ${getDifficultyColor(mission.difficulty)}`, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{mission.title}</h4>
                          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: getDifficultyColor(mission.difficulty), textTransform: 'uppercase', fontWeight: 'bold' }}>
                            {mission.difficulty}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                          {mission.description.substring(0, 100)}...
                        </p>
                        <Link href={`/mission/${mission.id}`} className="btn btn-primary" style={{ textAlign: 'center', width: '100%', textDecoration: 'none' }}>
                          Iniciar Misión
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
