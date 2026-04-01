// Mock data from data.json - New Firebase structure
export const mockData = {
  models: [
    {
      googleId: 'UID_MODEL_1',
      user_alias: 'lindagt',
      nombre: 'Linda Lee',
      email: 'linda@example.com',
      fotoPerfil: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      rol: 1,
      verificado: true,
      disponible: true,
      info: 'Modelo profesional con 5 años de experiencia.',
      redes: {
        whatsapp: 'https://wa.me/50243391342',
        telegram: 'https://t.me/lindagt',
        instagram: 'https://instagram.com/linda_gt',
        facebook: '',
        x: ''
      },
      grupos: [{ titulo: 'Canal VIP', link: 'https://t.me/linda_vip' }],
      fotos: {
        p1: {
          titulo: 'Sesión Primavera',
          link: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
          fecha: '2026-03-28'
        }
      }
    },
    {
      googleId: 'UID_MODEL_2',
      user_alias: 'marifer_x',
      nombre: 'Maria Fernanda',
      email: 'mafer@example.com',
      fotoPerfil: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      rol: 1,
      verificado: false,
      disponible: true,
      info: 'Especialista en fotografía comercial.',
      redes: { whatsapp: 'https://wa.me/50255443322', telegram: '', instagram: '', facebook: '', x: '' },
      grupos: [],
      fotos: {}
    },
    {
      googleId: 'UID_MODEL_3',
      user_alias: '',
      nombre: 'Sophie Valery',
      email: 'sophie@example.com',
      fotoPerfil: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      rol: 1,
      verificado: true,
      disponible: false,
      info: 'Modelo internacional.',
      redes: { whatsapp: '', telegram: '', instagram: 'https://instagram.com/sophie', facebook: '', x: '' },
      grupos: [],
      fotos: {}
    },
    {
      googleId: 'UID_MODEL_4',
      user_alias: '',
      nombre: 'Alejandra García',
      email: 'ale@example.com',
      fotoPerfil: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      rol: 1,
      verificado: true,
      disponible: true,
      info: '',
      redes: { whatsapp: '', telegram: '', instagram: '', facebook: '', x: '' },
      grupos: [],
      fotos: {}
    },
    {
      googleId: 'UID_MODEL_5',
      user_alias: '',
      nombre: 'Carolina López',
      email: 'caro@example.com',
      fotoPerfil: 'https://images.unsplash.com/photo-1503104834685-7205e8607eb9',
      rol: 1,
      verificado: false,
      disponible: true,
      info: '',
      redes: { whatsapp: '', telegram: '', instagram: '', facebook: '', x: '' },
      grupos: [],
      fotos: {}
    }
  ],
  users: [
    {
      googleId: 'UID_USER_1',
      nombre: 'Juan Pérez',
      email: 'juanp@gmail.com',
      fotoPerfil: 'https://randomuser.me/api/portraits/men/1.jpg',
      rol: 2,
      verificado: true,
      whatsapp: '50299887766',
      estado: 'activo'
    },
    {
      googleId: 'UID_USER_2',
      nombre: 'Carlos Gómez',
      email: 'carlosg@gmail.com',
      fotoPerfil: 'https://randomuser.me/api/portraits/men/2.jpg',
      rol: 2,
      verificado: false,
      whatsapp: '',
      estado: 'activo'
    }
  ],
  tours: [
    {
      id: 't0',
      idUser: 'UID_MODEL_1',
      titulo: 'Tour Occidente',
      lugar: 'Quiché',
      lugarDisponible: 'Hotel Hilton Garden Inn',
      fecha: '2026-05-01',
      detalles: 'Sesión temática y convivencia privada.',
      estado: true,
      disponibilidad: {
        '08:00': false,
        '10:00': true,
        '12:00': false,
        '14:00': true,
        '16:00': true,
        '18:00': true,
        '20:00': false,
        '22:00': true
      }
    }
  ],
  rifas: [
    {
      id: 'r0',
      idUser: 'UID_MODEL_1',
      titulo: 'Rifa Premium Verano',
      premio: 'Cena privada + Set de fotos',
      fechaSorteo: '2026-04-15',
      precio: 50,
      numerosTotales: 100,
      estado: true,
      terminos: [
        'Sorteo en vivo por Instagram.',
        'Premio no canjeable por efectivo.',
        'Válido solo para Guatemala.'
      ],
      disponibilidad: { '5': false, '22': false, '45': true }
    }
  ],
  agendas: {
    t0: {
      '08:00': {
        nombre: 'Carlos Gómez',
        contacto: '50244332211',
        tipo: 'WhatsApp',
        pago: 'Confirmado',
        detalles: 'Cliente llevará su vestuario.'
      },
      '12:00': {
        nombre: 'Privado',
        contacto: '@user_tg',
        tipo: 'Telegram',
        pago: 'Pendiente',
        detalles: ''
      },
      '20:00': {
        nombre: 'Venta Manual',
        contacto: 'N/A',
        tipo: 'Otro',
        pago: 'Confirmado',
        detalles: 'Vendido en persona.'
      }
    }
  },
  comprasRifas: {
    r0: {
      '5': { nombre: 'Marcos R.', contacto: '55001122', tipo: 'WhatsApp', pago: 'Confirmado', detalles: 'Transferencia BI' },
      '22': { nombre: 'Juan C.', contacto: '@juan_rifas', tipo: 'Telegram', pago: 'Pendiente', detalles: '' }
    }
  }
};
