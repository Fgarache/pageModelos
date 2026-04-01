import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import { firebaseConfig } from "./firebase.config";
import { mockData } from "./mockData";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

export const API_FIREBASE = {

  /**
   * Obtiene todos los modelos que tengan 'disponible' en true.
   * Nueva estructura: busca en 'models' en lugar de 'users'
   */
  getAllUsers: async () => {
    try {
      const snapshot = await get(child(dbRef, `models`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convertimos el objeto de objetos en un array y filtramos
        return Object.keys(data)
          .map(key => ({ id: key, googleId: key, ...data[key] }))
          .filter(user => user.disponible === true && user.user_alias); // Solo modelos con user_alias
      }
      return [];
    } catch (error) {
      console.warn("Firebase error - usando datos de prueba:", error);
      // Fallback a mock data para desarrollo
      return mockData.models.filter(user => user.disponible === true && user.user_alias);
    }
  },

  /**
   * Obtiene la información de un modelo específico por su ID o user_alias.
   */
  getUserInfo: async (userIdOrAlias: string) => {
    try {
      // Primero intentar por googleId
      let snapshot = await get(child(dbRef, `models/${userIdOrAlias}`));
      if (snapshot.exists()) {
        const modelData = snapshot.val();
        return { id: userIdOrAlias, googleId: userIdOrAlias, ...modelData };
      }

      // Si no existe, buscar por user_alias
      snapshot = await get(child(dbRef, `models`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        for (const [googleId, model] of Object.entries(data) as [string, any][]) {
          if (model.user_alias === userIdOrAlias) {
            return { id: googleId, googleId, ...model };
          }
        }
      }
      
      return null;
    } catch (error) {
      console.warn("Firebase error - usando datos de prueba:", error);
      // Fallback a mock data
      return mockData.models.find(u => u.googleId === userIdOrAlias || u.user_alias === userIdOrAlias) || null;
    }
  },

  /**
   * Obtiene los tours activos de un usuario.
   * Nueva estructura: disponibilidad es un objeto con horarios como keys
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
   * Obtiene horarios disponibles para un tour.
   * Nueva estructura: disponibilidad es un objeto {"08:00": true, "10:00": false}
   */
  getHorarios: async (tourId: string) => {
    try {
      const snapshot = await get(child(dbRef, `tours/${tourId}`));
      if (snapshot.exists()) {
        const tour = snapshot.val();
        const disponibilidad = tour.disponibilidad || {};
        
        // Convertir objeto de disponibilidad en array de horarios disponibles
        return Object.entries(disponibilidad)
          .filter(([_, isAvailable]) => isAvailable === true)
          .map(([hora]) => ({ hora, disponible: true }));
      }
      return [];
    } catch (error) {
      console.warn("Firebase error - usando datos de prueba:", error);
      return [];
    }
  },

  /**
   * Obtiene TODOS los horarios (disponibles y ocupados) para un tour específico.
   * Nueva estructura: obtiene datos de agendas[tourId]
   */
  getAllHorariosByTour: async (tourId: string) => {
    try {
      const [tourSnap, agendaSnap] = await Promise.all([
        get(child(dbRef, `tours/${tourId}`)),
        get(child(dbRef, `agendas/${tourId}`))
      ]);

      if (!tourSnap.exists()) return [];

      const tour = tourSnap.val();
      const disponibilidad = tour.disponibilidad || {};
      const agendas = agendaSnap.exists() ? agendaSnap.val() : {};

      // Crear array de horarios basado en disponibilidad del tour
      const horarios = Object.entries(disponibilidad)
        .map(([hora, isAvailable]) => ({
          hora,
          disponible: isAvailable === true,
          reserva: agendas[hora] || null
        }))
        .sort((a, b) => a.hora.localeCompare(b.hora));

      return horarios;
    } catch (error) {
      console.warn("Firebase error - usando datos de prueba:", error);
      // Fallback a mock data
      const tourData = mockData.tours.find(t => t.id === tourId);
      if (!tourData) return [];
      
      const disponibilidad = (tourData as any).disponibilidad || {};
      const agendas = (mockData.agendas as any)[tourId] || {};

      return Object.entries(disponibilidad)
        .map(([hora, isAvailable]: [string, any]) => ({
          hora,
          disponible: isAvailable === true,
          reserva: agendas[hora] || null
        }))
        .sort((a, b) => a.hora.localeCompare(b.hora));
    }
  },

  /**
   * Obtiene rifas y calcula dinámicamente los números disponibles.
   * Nueva estructura: disponibilidad es un objeto {"5": false, "22": true, ...}
   */
  getRifas: async (userId: string) => {
    try {
      const snapshot = await get(child(dbRef, `rifas`));

      if (!snapshot.exists()) return [];

      const rifasData = snapshot.val();

      return Object.keys(rifasData)
        .map(idRifa => {
          const rifa = rifasData[idRifa];
          if (rifa.idUser !== userId || rifa.estado !== true) return null;

          const disponibilidad = rifa.disponibilidad || {};
          
          // Convertir objeto de disponibilidad en array de números disponibles
          const numerosDisponibles = Object.entries(disponibilidad)
            .filter(([_, isAvailable]) => isAvailable === true)
            .map(([numero]) => parseInt(numero))
            .sort((a, b) => a - b);

          return { 
            id: idRifa, 
            ...rifa, 
            numerosDisponibles, 
            cantidadLibre: numerosDisponibles.length 
          };
        })
        .filter(r => r !== null);
    } catch (error) {
      console.warn("Firebase error - usando datos de prueba:", error);
      return mockData.rifas
        .filter(rifa => rifa.idUser === userId && rifa.estado === true)
        .map(rifa => {
          const disponibilidad = (rifa as any).disponibilidad || {};
          
          const numerosDisponibles = Object.entries(disponibilidad)
            .filter(([_, isAvailable]) => isAvailable === true)
            .map(([numero]) => parseInt(numero))
            .sort((a, b) => a - b);

          return { 
            ...rifa, 
            numerosDisponibles, 
            cantidadLibre: numerosDisponibles.length 
          };
        });
    }
  }
};