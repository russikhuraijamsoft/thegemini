import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

export const SUPER_ADMIN_UIDS = ['DeQd1Y2YWjQt0eFjQ4iWPThuBAJ3'];
export const SUPER_ADMIN_EMAILS = ['talkofthetown312@gmail.com'];

export function getFriendlyAuthErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred';
  const code = err.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password. If you do not have an account yet, create one below.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please create an account or verify your email.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many login attempts. Please wait a moment or reset your password.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by the browser. We will attempt a redirect.';
    case 'auth/operation-not-supported-in-this-environment':
      return 'Popup sign-in is not supported in this environment. Please sign in with Email & Password or use Terminal PIN.';
    case 'auth/unauthorized-domain':
      return 'This app origin is not in Firebase Authorized Domains. Sign in directly with Email & Password.';
    default:
      return err.message || 'Authentication error. Please try again.';
  }
}

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

  async loginWithGoogle(): Promise<User | null> {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if profile exists, if not create one
      const profile = await this.getUserProfile(userCredential.user.uid);
      if (!profile) {
        await this.createUserProfile(userCredential.user, userCredential.user.displayName || 'Google User');
      }
      
      return userCredential.user;
    } catch (popupError: any) {
      const isPopupBlockedOrUnsupported = 
        popupError.code === 'auth/popup-blocked' ||
        popupError.code === 'auth/operation-not-supported-in-this-environment' ||
        popupError.code === 'auth/popup-closed-by-user';
      if (isPopupBlockedOrUnsupported) {
        logger.info('Falling back to signInWithRedirect for Google auth');
        await signInWithRedirect(auth, provider);
        return null;
      }
      throw popupError;
    }
  }

  async loginWithApple(): Promise<User | null> {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new OAuthProvider('apple.com');
    try {
      const userCredential = await signInWithPopup(auth, provider);
      
      const profile = await this.getUserProfile(userCredential.user.uid);
      if (!profile) {
        await this.createUserProfile(userCredential.user, userCredential.user.displayName || 'Apple User');
      }
      
      return userCredential.user;
    } catch (popupError: any) {
      const isPopupBlockedOrUnsupported = 
        popupError.code === 'auth/popup-blocked' ||
        popupError.code === 'auth/operation-not-supported-in-this-environment' ||
        popupError.code === 'auth/popup-closed-by-user';
      if (isPopupBlockedOrUnsupported) {
        logger.info('Falling back to signInWithRedirect for Apple auth');
        await signInWithRedirect(auth, provider);
        return null;
      }
      throw popupError;
    }
  }

  async checkRedirectResult(): Promise<User | null> {
    if (!auth) return null;
    try {
      const credential = await getRedirectResult(auth);
      if (credential?.user) {
        const profile = await this.getUserProfile(credential.user.uid);
        if (!profile) {
          await this.createUserProfile(credential.user, credential.user.displayName || 'OAuth User');
        }
        return credential.user;
      }
    } catch (err) {
      logger.warn('Redirect auth result check completed with note', err);
    }
    return null;
  }

  loginWithTerminalPin(pin: string): UserProfile {
    const validPins: Record<string, { role: string; name: string }> = {
      '1234': { role: 'OWNER', name: 'Talk of the Town (Owner)' },
      '9999': { role: 'MANAGER', name: 'Duty Manager (Terminal)' },
      '0000': { role: 'CASHIER', name: 'Cashier 1' }
    };
    const match = validPins[pin];
    if (!match) {
      throw new Error('Invalid PIN. Use 1234 (Owner) or 9999 (Manager)');
    }
    const profile: UserProfile = {
      uid: 'terminal_user_' + pin,
      email: pin === '1234' ? 'talkofthetown312@gmail.com' : `terminal-${pin}@talkos.app`,
      phoneNumber: null,
      displayName: match.name,
      roles: match.role === 'OWNER' ? ['OWNER', 'ADMIN', 'MANAGER'] : [match.role],
      permissions: ['*'],
      branches: ['br_main'],
      defaultBranch: 'br_main',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('talkos_terminal_session', JSON.stringify(profile));
    return profile;
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
    
    const isSuperAdmin = SUPER_ADMIN_UIDS.includes(user.uid) || 
      (user.email ? SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase()) : false);

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email,
      phoneNumber: user.phoneNumber,
      displayName: displayName || (isSuperAdmin ? 'Talk of the Town (Owner)' : 'User'),
      roles: isSuperAdmin ? ['OWNER', 'ADMIN', 'MANAGER'] : ['CASHIER'],
      permissions: isSuperAdmin ? ['*'] : ['pos.order.create'],
      branches: ['br_main'],
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profile);
      logger.info('Created user profile', { uid: user.uid });
    } catch (err) {
      logger.warn('Failed to save profile in Firestore', err);
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const isSuperAdmin = SUPER_ADMIN_UIDS.includes(uid);
    if (!db) {
      if (isSuperAdmin) {
        return {
          uid,
          email: 'talkofthetown312@gmail.com',
          phoneNumber: null,
          displayName: 'Talk of the Town (Owner)',
          roles: ['OWNER', 'ADMIN', 'MANAGER'],
          permissions: ['*'],
          branches: ['br_main'],
          createdAt: new Date().toISOString()
        };
      }
      return null;
    }
    
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        if (isSuperAdmin && (!data.roles.includes('OWNER') || !data.roles.includes('ADMIN'))) {
          data.roles = Array.from(new Set([...data.roles, 'OWNER', 'ADMIN', 'MANAGER']));
          data.permissions = ['*'];
          try {
            await setDoc(docRef, data, { merge: true });
          } catch (e) {
            logger.warn('Could not update superadmin roles on profile', e);
          }
        }
        return data;
      }

      if (isSuperAdmin) {
        const ownerProfile: UserProfile = {
          uid,
          email: 'talkofthetown312@gmail.com',
          phoneNumber: null,
          displayName: 'Talk of the Town (Owner)',
          roles: ['OWNER', 'ADMIN', 'MANAGER'],
          permissions: ['*'],
          branches: ['br_main'],
          createdAt: new Date().toISOString()
        };
        try {
          await setDoc(docRef, ownerProfile);
        } catch (e) {
          logger.warn('Could not persist superadmin profile to Firestore', e);
        }
        return ownerProfile;
      }
    } catch (error) {
      logger.warn('Could not fetch user profile from Firestore', error);
      if (isSuperAdmin) {
        return {
          uid,
          email: 'talkofthetown312@gmail.com',
          phoneNumber: null,
          displayName: 'Talk of the Town (Owner)',
          roles: ['OWNER', 'ADMIN', 'MANAGER'],
          permissions: ['*'],
          branches: ['br_main'],
          createdAt: new Date().toISOString()
        };
      }
    }
    
    return null;
  }

  async updateUserProfile(profile: Partial<UserProfile> & { uid: string }): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', profile.uid);
    await setDoc(docRef, profile, { merge: true });
  }
}

export const authService = new AuthService();
