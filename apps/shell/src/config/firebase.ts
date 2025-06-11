import { initializeApp } from 'firebase/app';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { getAnalytics, type Analytics } from 'firebase/analytics';

// Firebase configuration
// Environment variables are loaded from .env file
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.VITE_FIREBASE_APP_ID ?? "",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID ?? ""
};

// Initialize Firebase services
const initializeFirebaseServices = () => {
  const app = initializeApp(firebaseConfig);
  let performance: FirebasePerformance | null = null;
  let analytics: Analytics | null = null;

  // Initialize Performance Monitoring and Analytics only in production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    performance = getPerformance(app);
    analytics = getAnalytics(app);
    console.log('🔥 Firebase Performance monitoring initialized');
    console.log('📊 Firebase Analytics initialized');
  } else {
    console.log('🔥 Firebase Performance monitoring disabled in development');
    console.log('📊 Firebase Analytics disabled in development');
  }

  return { app, performance, analytics };
};

const { app, performance, analytics } = initializeFirebaseServices();

export { app, performance, analytics };
export default app;
