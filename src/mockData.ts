// Mock data from data.json - Real structure from Firebase
export const mockData = {
  users: [
    {
      id: 'u0',
      user_alias: 'lindagt',
      nombre: 'Linda Lee',
      numero: '43391342',
      disponible: true,
      disponibleLugar: 'Capital',
      info: 'Linda es una modelo de 25 años con experiencia en pasarela...',
      detalles: 'Sin detalles adicionales',
      metodosPago: 'Efectivo, Paypal, Transferencia',
      lugarTours: 'Antigua, Coban, Xela, Capital'
    },
    {
      id: 'u1',
      user_alias: 'marifer_x',
      nombre: 'Maria Fernanda',
      numero: '55443322',
      disponible: true,
      disponibleLugar: 'Xela',
      info: 'Especialista en fotografía comercial y catálogos.',
      detalles: 'Disponible fines de semana',
      metodosPago: 'Efectivo, Zelle',
      lugarTours: 'Xela, Panajachel, San Marcos'
    },
    {
      id: 'u2',
      user_alias: 'sophie_model',
      nombre: 'Sophie Valery',
      numero: '99887766',
      disponible: false,
      disponibleLugar: 'Antigua',
      info: 'Modelo internacional de visita en el país.',
      detalles: 'No disponible hasta nuevo aviso',
      metodosPago: 'Tarjeta, Bitcoin, Efectivo',
      lugarTours: 'Antigua, Capital'
    }
  ],
  tours: [
    {
      id: 't0',
      idUser: 'u0',
      lugar: 'Quiche',
      titulo: 'Tour Occidente',
      fecha: '2026-05-01',
      deposito: 100,
      estado: true,
      lugarAtencion: 'Hotel Hilton',
      detalles: 'Sesión de fotos y firma de autógrafos'
    },
    {
      id: 't1',
      idUser: 'u0',
      lugar: 'Coban',
      titulo: 'Evento Verapaz',
      fecha: '2026-05-15',
      deposito: 150,
      estado: true,
      lugarAtencion: 'Hotel Park',
      detalles: 'Evento de marca de ropa'
    },
    {
      id: 't2',
      idUser: 'u1',
      lugar: 'Xela',
      titulo: 'Fashion Week Xela',
      fecha: '2026-06-10',
      deposito: 200,
      estado: true,
      lugarAtencion: 'Centro Intercultural',
      detalles: 'Pasarela principal'
    }
  ],
  rifas: [
    {
      idRifa: 'r0',
      idUser: 'u0',
      titulo: 'Rifa Premium Linda',
      premio: 'Cena privada + Set de fotos',
      precio: 50,
      numerosTotales: 20,
      estado: true,
      fechaSorteo: '2026-12-24'
    },
    {
      idRifa: 'r1',
      idUser: 'u1',
      titulo: 'Sorteo Especial Xela',
      premio: 'Q1000 en efectivo',
      precio: 25,
      numerosTotales: 50,
      estado: true,
      fechaSorteo: '2026-07-15'
    }
  ],
  comprasRifas: {
    r0: {
      n2: { cliente: 'Carlos M.', contacto: '55667788', pago: 'confirmado' },
      n12: { cliente: 'Luis G.', contacto: '44112233', pago: 'pendiente' },
      n20: { cliente: 'Admin', contacto: '00000000', pago: 'cortesia' }
    },
    r1: {
      n5: { cliente: 'Maria R.', contacto: '33221100', pago: 'confirmado' },
      n45: { cliente: 'Jorge V.', contacto: '88776655', pago: 'confirmado' }
    }
  },
  agendaTours: {
    t0: {
      h08: { hora: '08:00', estado: false, cliente: 'Juan Perez', deposito: 300 },
      h10: { hora: '10:00', estado: true },
      h12: { hora: '12:00', estado: true },
      h14: { hora: '14:00', estado: false, cliente: 'Empresa SA', deposito: 500 },
      h16: { hora: '16:00', estado: true }
    },
    t1: {
      h09: { hora: '09:00', estado: true },
      h11: { hora: '11:00', estado: true },
      h13: { hora: '13:00', estado: true }
    },
    t2: {
      h15: { hora: '15:00', estado: false, cliente: 'Estudio Foto', deposito: 200 }
    }
  }
};
