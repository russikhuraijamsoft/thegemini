import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import appletConfig from '../../../firebase-applet-config.json';
export { OperationType, handleFirestoreError } from './firestoreErrorHandler';
export type { FirestoreErrorInfo } from './firestoreErrorHandler';

const resolvedConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || appletConfig.measurementId || '',
};

const databaseId =
  import.meta.env.VITE_FIREBASE_DATABASE_ID ||
  appletConfig.firestoreDatabaseId ||
  'ai-studio-talkosarchitectu-438c4707-59bb-4b28-aa84-26b8ca15c574';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(resolvedConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, databaseId);
export const storage = getStorage(app);

let analytics: any = null;
if (typeof window !== 'undefined' && resolvedConfig.measurementId) {
  isSupported()
    .then((supported) => {
      if (supported) {
        try {
          analytics = getAnalytics(app);
        } catch {
          // Analytics safely ignored if dynamic config blocked
        }
      }
    })
    .catch(() => {
      // Ignored in unsupported environments
    });
}
export { analytics };

// Export standard client instances
export default {
  app,
  auth,
  db,
  storage,
  analytics
};
