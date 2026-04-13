import React, { useEffect, useState } from 'react';
import { API_FIREBASE } from '../data';
import { Link } from 'react-router-dom';
import PageSectionHeader from '../components/PageSectionHeader';
import '../styles/ModelosPage.css';

const ModelosPage: React.FC = () => {
  const [modelos, setModelos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        setLoading(true);
        const data = await API_FIREBASE.getAllUsers();
        setModelos(data);
      } catch (error) {
        console.error('Error cargando modelos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModelos();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)'
      }}>
        <div style={{ color: '#d4af37', fontSize: '18px' }}>Cargando catálogo...</div>
      </div>
    );
  }

  return (
    <div className="modelos-page">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <PageSectionHeader
          title="CHICAS"
          accent="DISPONIBLES"
          description="Modelos ejecutivas escort premium en Guatemala, con atención exclusiva y discreta."
        />

        {modelos.length === 0 ? (
          <div style={{
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#aaa',
            fontSize: '18px'
          }}>
            <p>No hay modelos disponibles en este momento</p>
          </div>
        ) : (
          <div className="modelos-grid" style={{
            marginBottom: '40px'
          }}>
            {modelos.map((modelo) => (
              (() => {
                const displayName = modelo.nombre || modelo.user_alias || 'Perfil';
                const previewInfo = modelo.info || 'Perfil público activo en la plataforma.';

                return (
              <Link 
                to={`/${modelo.user_alias}`} 
                key={modelo.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  height: '380px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(15, 52, 96, 0.3)',
                  boxShadow: '0 8px 32px rgba(212, 175, 55, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(212, 175, 55, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                }}>
                  {/* Imagen de fondo */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={modelo.fotoPerfil} 
                      alt={modelo.nombre}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                      }}
                    />
                  </div>

                  {/* Gradiente overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(26, 26, 46, 0.95), rgba(26, 26, 46, 0.4), transparent)',
                    zIndex: 2
                  }} />

                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    zIndex: 3,
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#f3d77c',
                    background: 'rgba(8, 8, 8, 0.58)',
                    border: '1px solid rgba(212, 175, 55, 0.34)',
                    backdropFilter: 'blur(6px)'
                  }}>
                    {modelo.disponibleLugar || 'Guatemala'}
                  </div>

                  {/* Contenido */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '30px 20px',
                    zIndex: 3,
                    color: '#fff'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                      <h3 style={{ 
                        fontSize: '22px', 
                        fontWeight: '800', 
                        margin: 0,
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        {displayName}
                      </h3>
                      {modelo.verificado && (
                        <span style={{ fontSize: '16px' }}>✅</span>
                      )}
                    </div>

                    <p style={{
                      fontSize: '13px',
                      color: '#ccc',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {previewInfo.length > 60 ? `${previewInfo.substring(0, 60)}...` : previewInfo}
                    </p>

                    <div style={{
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                      fontSize: '12px',
                      color: '#aaa',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>Ver Perfil Completo</span>
                      <span style={{ color: '#d4af37', fontSize: '16px' }}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
                );
              })()
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelosPage;