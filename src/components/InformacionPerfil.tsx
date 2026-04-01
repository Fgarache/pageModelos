import React from 'react';

const InformacionPerfil = ({ user }: any) => {
  if (!user) return null;

  // Estilos rápidos para que no dependas de un archivo externo
  const styles: any = {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      background: '#fff',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      color: '#333'
    },
    sidebar: {
      flex: '0 0 200px', // Aquí controlas que la foto no sea gigante
      maxWidth: '200px'
    },
    foto: {
      width: '100%',
      borderRadius: '8px',
      aspectRatio: '3/4',
      objectFit: 'cover',
      border: user.verificado ? '3px solid #007bff' : '1px solid #eee'
    },
    content: {
      flex: '1',
      minWidth: '250px'
    },
    nombre: {
      margin: '0 0 10px 0',
      fontSize: '1.8rem'
    },
    btn: {
      display: 'inline-block',
      margin: '5px 10px 5px 0',
      padding: '8px 15px',
      borderRadius: '5px',
      textDecoration: 'none',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Lado de la Foto */}
      <div style={styles.sidebar}>
        <img src={user.fotoPerfil} alt={user.nombre} style={styles.foto} />
        <div style={{ marginTop: '10px', fontSize: '0.8rem', textAlign: 'center' }}>
          <span style={{ color: user.disponible ? 'green' : 'red' }}>●</span> {user.disponible ? 'Disponible' : 'Ocupada'}
        </div>
      </div>

      {/* Lado de la Info */}
      <div style={styles.content}>
        <h2 style={styles.nombre}>
          {user.nombre} {user.verificado && "✅"}
        </h2>
        <p style={{ color: '#666', lineHeight: '1.4' }}>{user.info}</p>
        
        <div style={{ marginTop: '15px' }}>
          {user.redes?.whatsapp && (
            <a href={user.redes.whatsapp} target="_blank" style={{ ...styles.btn, background: '#25d366' }}>WhatsApp</a>
          )}
          {user.redes?.telegram && (
            <a href={user.redes.telegram} target="_blank" style={{ ...styles.btn, background: '#0088cc' }}>Telegram</a>
          )}
        </div>

        <div style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          <strong>Pagos:</strong> {user.metodosPago || "Efectivo / Transferencia"}
        </div>
      </div>
    </div>
  );
};

export default InformacionPerfil;