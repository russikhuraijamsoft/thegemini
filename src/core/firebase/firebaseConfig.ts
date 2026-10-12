import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if config is valid
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let analytics: any = null;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-talkosarchitectu-438c4707-59bb-4b28-aa84-26b8ca15c574");
    storage = getStorage(app);
    
    // Initialize Analytics only if we are in the browser, measurementId exists, and is supported
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      isSupported().then((supported) => {
        if (supported) {
          try {
            analytics = getAnalytics(app);
          } catch {
            // Analytics dynamic config fetch not available or blocked, safely ignored
          }
        }
      }).catch(() => {
        // Analytics unsupported in current environment
      });
    }

    // Validate connection
    if (db) {
      const testConnection = async () => {
        try {
          await getDocFromServer(doc(db, 'system', 'connection_test'));
        } catch (error) {
          if (error instanceof Error && error.message.includes('the client is offline')) {
            console.warn("Please check your Firebase configuration. The client is offline.");
          }
        }
      };
      testConnection();
    }
  } catch (error) {
    console.warn("Firebase initialization failed. Check environment variables.", error);
  }
} else {
  console.warn("Firebase configuration is missing. The app will run in degraded mode without backend access.");
}

export { app, auth, db, storage, analytics };
