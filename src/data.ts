import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import { firebaseConfig } from "./firebase.config";
import { mockData } from "./mockData";

// 2. Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

export const API_FIREBASE = {

  /**
   * Obtiene todos los usuarios que tengan 'disponible' en true.
   */
  getAllUsers: async () => {
    try {
      const snapshot = await get(child(dbRef, `users`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convertimos el objeto de objetos en un array y filtramos
        return Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(user => user.disponible === true);
      }
      return [];
    } catch (error) {
      console.warn("Firebase error - usando datos de prueba:", error);
      // Fallback a mock data para desarrollo
      return mockData.users.filter(user => user.disponible === true);
    }
  },

  /**
   * Obtiene la información de un usuario específico por su ID.
   */
  getUserInfo: async (userId: string) => {
    try {
      const snapshot = await get(child(dbRef, `users/${userId}`));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.warn("Firebase error - usando datos de prueba:", error);
      // Fallback a mock data
      return mockData.users.find(u => u.id === userId) || null;
    }
  },

  /**
   * Obtiene los tours activos de un usuario.
   */
  getTours: async (userId: string) => {
    try {
      const snapshot = await get(child(dbRef, `tours`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(tour => tour.idUser === userId && tour.estado === true);
      }
      return [];
    } catch (error) {
      console.warn("Firebase error - usando datos de prueba:", error);
      // Fallback a mock data
      return mockData.tours.filter(tour => tour.idUser === userId && tour.estado === true);
    }
  },

  /**
   * Obtiene horarios disponibles de la rama agenda_tours.
   */
  getHorarios: async (tourId: string) => {
    try {
      const snapshot = await get(child(dbRef, `agenda_tours/${tourId}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data)
          .map(key => ({ idHora: key, ...data[key] }))
          .filter(h => h.estado === true);
      }
      return [];
    } catch (error) {
      console.warn("Firebase error - usando datos de prueba:", error);
      return [];
    }
  },

  /**
   * Obtiene TODOS los horarios (disponibles y ocupados) para un tour específico.
   */
  getAllHorariosByTour: async (tourId: string) => {
    try {
      const snapshot = await get(child(dbRef, `agenda_tours/${tourId}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data)
          .map(key => ({ idHora: key, ...data[key] }))
          .sort((a, b) => a.hora.localeCompare(b.hora));
      }
      return [];
    } catch (error) {
      console.warn("Firebase error - usando datos de prueba:", error);
      // Fallback a mock data
      const mockHorarios = Object.entries((mockData.agendaTours as any)[tourId] || {})
        .map(([key, value]: [string, any]) => ({ idHora: key, ...value }))
        .sort((a, b) => a.hora.localeCompare(b.hora));
      return mockHorarios;
    }
  },

  /**
   * Obtiene rifas y calcula dinámicamente los números disponibles.
   */
  getRifas: async (userId: string) => {
    try {
      const [rifasSnap, comprasSnap] = await Promise.all([
        get(child(dbRef, `rifas`)),
        get(child(dbRef, `compras_rifas`))
      ]);

      if (!rifasSnap.exists()) return [];

      const rifasData = rifasSnap.val();
      const comprasData = comprasSnap.exists() ? comprasSnap.val() : {};

      return Object.keys(rifasData)
        .map(idRifa => {
          const rifa = rifasData[idRifa];
          if (rifa.idUser !== userId || rifa.estado !== true) return null;

          const ocupados = comprasData[idRifa]
            ? Object.keys(comprasData[idRifa]).map(n => parseInt(n.replace('n', '')))
            : [];

          let disponibles = [];
          for (let i = 1; i <= rifa.numerosTotales; i++) {
            if (!ocupados.includes(i)) disponibles.push(i);
          }

          return { idRifa, ...rifa, numerosDisponibles: disponibles, cantidadLibre: disponibles.length };
        })
        .filter(r => r !== null);
    } catch (error) {
      console.warn("Firebase error - usando datos de prueba:", error);
      return mockData.rifas
        .filter(rifa => rifa.idUser === userId && rifa.estado === true)
        .map(rifa => {
          const compras = (mockData.comprasRifas as any)[rifa.idRifa] || {};
          const ocupados = Object.keys(compras).map(n => parseInt(n.replace('n', '')));

          let disponibles = [];
          for (let i = 1; i <= rifa.numerosTotales; i++) {
            if (!ocupados.includes(i)) disponibles.push(i);
          }

          return { ...rifa, numerosDisponibles: disponibles, cantidadLibre: disponibles.length };
        });
    }
  }
};