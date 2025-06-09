import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';

// Firebase configuration
// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "gjpb-admin-console.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "gjpb-admin-console",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "gjpb-admin-console.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Initialize Firebase App
let app: FirebaseApp;
let performance: FirebasePerformance | null = null;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Performance Monitoring only in production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    performance = getPerformance(app);
    console.log('🔥 Firebase Performance monitoring initialized');
  } else {
    console.log('🔥 Firebase Performance monitoring disabled in development');
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw error;
}

export { app, performance };
export default app;
