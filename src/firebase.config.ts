// Firebase config file
// Get these values from your Firebase Console: Settings > Project Settings
// DO NOT commit sensitive data - use environment variables in production

export const firebaseConfig = {
  // Replace with your Firebase config
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL || "https://lindagt.firebaseio.com/",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};
