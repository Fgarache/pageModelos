// Firebase config file for public read-only access.
// The web config is not a secret by itself; access is controlled by Realtime Database rules.
// For this app we only read public data, so the databaseURL fallback is the only required default here.

export const firebaseConfig = {
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL || 'https://sitemodelgt-default-rtdb.firebaseio.com',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};
