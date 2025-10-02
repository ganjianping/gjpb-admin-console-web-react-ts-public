import { initializeApp } from 'firebase/app';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { getAnalytics, type Analytics } from 'firebase/analytics';

// Firebase configuration
// Environment variables are loaded from .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? ""
};

// Check if Firebase configuration is complete
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.authDomain && 
         firebaseConfig.projectId && 
         firebaseConfig.appId;
};

// Initialize Firebase services
const initializeFirebaseServices = () => {
  if (!isFirebaseConfigured()) {
    console.log('🔥 Firebase configuration incomplete - services disabled');
    console.log('📊 To enable Firebase, configure environment variables in .env.local');
    return { app: null, performance: null, analytics: null };
  }

  try {
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
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return { app: null, performance: null, analytics: null };
  }
};

const { app, performance, analytics } = initializeFirebaseServices();

export { app, performance, analytics };
export default app;
