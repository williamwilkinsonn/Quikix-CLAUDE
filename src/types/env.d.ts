/**
 * Type declarations for environment variables loaded via react-native-dotenv.
 * Variables are imported as: import { FIREBASE_API_KEY } from '@env';
 */
declare module '@env' {
  export const FIREBASE_API_KEY: string | undefined;
  export const FIREBASE_AUTH_DOMAIN: string | undefined;
  export const FIREBASE_PROJECT_ID: string | undefined;
  export const FIREBASE_STORAGE_BUCKET: string | undefined;
  export const FIREBASE_MESSAGING_SENDER_ID: string | undefined;
  export const FIREBASE_APP_ID: string | undefined;
  export const FIREBASE_MEASUREMENT_ID: string | undefined;
}
