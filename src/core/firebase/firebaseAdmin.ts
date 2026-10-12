import { App, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

let adminApp: App | null = null;

export function getFirebaseAdmin(): App {
  if (!adminApp) {
    try {
      adminApp = initializeApp({
        credential: applicationDefault()
      });
      console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
      console.error("Error initializing Firebase Admin:", error);
    }
  }
  return adminApp!;
}

export function getAdminAuthService() {
  const app = getFirebaseAdmin();
  return getAdminAuth(app);
}

export function getAdminFirestoreService() {
  const app = getFirebaseAdmin();
  return getAdminFirestore(app);
}


