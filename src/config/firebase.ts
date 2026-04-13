/**
 * Firebase Configuration — Quikix (project: quikix-app)
 *
 * Credentials are loaded from .env via react-native-dotenv (@env).
 * Hardcoded project defaults are used as fallbacks so the app works
 * immediately after cloning without requiring a separate .env file.
 *
 * Firebase web API keys are designed to be included in client bundles;
 * security is enforced through Firebase Security Rules.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY ?? 'AIzaSyDgTeYwIOIauFhzlTg-KVOBnp7gC2zm_uQ',
  authDomain: FIREBASE_AUTH_DOMAIN ?? 'quikix-app.firebaseapp.com',
  projectId: FIREBASE_PROJECT_ID ?? 'quikix-app',
  storageBucket: FIREBASE_STORAGE_BUCKET ?? 'quikix-app.firebasestorage.app',
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID ?? '357543823105',
  appId: FIREBASE_APP_ID ?? '1:357543823105:web:34f6de8e0a38bfc52cfd00',
  measurementId: FIREBASE_MEASUREMENT_ID ?? 'G-0WJY9XNK27',
};

// Prevent re-initialization on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Auth with AsyncStorage persistence so sessions survive app restarts
let auth: ReturnType<typeof getAuth>;
if (getApps().length === 1) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  auth = getAuth(app);
}

const db = getFirestore(app);

// Analytics is only supported in browser / standalone environments, not Expo Go
let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, auth, db, analytics };
