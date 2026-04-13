/**
 * Firebase Configuration
 *
 * This file initializes Firebase using the Web SDK (for Expo Go / web compatibility).
 * For production native builds, use @react-native-firebase/app instead and provide
 * google-services.json (Android) and GoogleService-Info.plist (iOS).
 *
 * Setup:
 * 1. Copy .env.example to .env
 * 2. Fill in your Firebase project credentials from Firebase Console
 * 3. Go to: https://console.firebase.google.com > Your Project > Project Settings > Your Apps
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
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

export { app, auth, db };
