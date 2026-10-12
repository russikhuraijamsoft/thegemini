import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  signOut,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../core/firebase/firebaseConfig';
import { logger } from '../../../core/logging/logger';

export interface UserProfile {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  roles: string[];
  permissions: string[];
  branches: string[];
  defaultBranch?: string;
  createdAt: string;
}

class AuthService {
  async registerWithEmail(email: string, password: string, displayName: string): Promise<User> {
    if (!auth || !db) throw new Error('Firebase not initialized');
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create initial user profile
    await this.createUserProfile(user, displayName);
    
    return user;
  }

  async loginWithEmail(email: string, password: string): Promise<User> {
    if (!auth) throw new Error('Firebase not initialized');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  async loginWithGoogle(): Promise<User> {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if profile exists, if not create one
    const profile = await this.getUserProfile(userCredential.user.uid);
    if (!profile) {
      await this.createUserProfile(userCredential.user, userCredential.user.displayName || 'Google User');
    }
    
    return userCredential.user;
  }

  async loginWithApple(): Promise<User> {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new OAuthProvider('apple.com');
    const userCredential = await signInWithPopup(auth, provider);
    
    const profile = await this.getUserProfile(userCredential.user.uid);
    if (!profile) {
      await this.createUserProfile(userCredential.user, userCredential.user.displayName || 'Apple User');
    }
    
    return userCredential.user;
  }

  async setupRecaptcha(containerId: string): Promise<RecaptchaVerifier> {
    if (!auth) throw new Error('Firebase not initialized');
    return new RecaptchaVerifier(auth, containerId, {
      size: 'invisible'
    });
  }

  async sendPhoneOTP(phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
    if (!auth) throw new Error('Firebase not initialized');
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  }

  async resetPassword(email: string): Promise<void> {
    if (!auth) throw new Error('Firebase not initialized');
    await sendPasswordResetEmail(auth, email);
  }

  async logout(): Promise<void> {
    if (!auth) throw new Error('Firebase not initialized');
    await signOut(auth);
  }

  private async createUserProfile(user: User, displayName: string): Promise<void> {
    if (!db) return;
    
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email,
      phoneNumber: user.phoneNumber,
      displayName,
      roles: ['CASHIER'], // Default role, should be updated by admin
      permissions: ['pos.order.create'],
      branches: [], // Needs to be assigned
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), profile);
    logger.info('Created user profile', { uid: user.uid });
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!db) return null;
    
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
    } catch (error) {
      logger.warn('Could not fetch user profile from Firestore', error);
    }
    
    return null;
  }
}

export const authService = new AuthService();
