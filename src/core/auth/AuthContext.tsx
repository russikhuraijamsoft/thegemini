import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { logger } from '../logging/logger';
import { authService, UserProfile } from '../../features/auth/services/authService';
import { useAppStore } from '../store/appStore';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginWithTerminalPin: (pin: string) => UserProfile;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const setBranchId = useAppStore(state => state.setBranchId);
  const currentBranchId = useAppStore(state => state.branchId);

  useEffect(() => {
    // Check for any pending redirect auth result first (e.g. Google Sign-In redirect on mobile)
    authService.checkRedirectResult().catch((e) => logger.warn('Redirect auth check completed', e));

    if (!auth) {
      console.warn('Firebase Auth is not initialized. Checking terminal session.');
      const savedSession = localStorage.getItem('talkos_terminal_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          setProfile(parsed);
          setUser({ uid: parsed.uid, email: parsed.email, displayName: parsed.displayName });
        } catch {
          // ignore parsing error
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Fetch user profile from Firestore to get roles, branches, permissions
          const isOwnerUid = currentUser.uid === 'DeQd1Y2YWjQt0eFjQ4iWPThuBAJ3' || currentUser.email === 'talkofthetown312@gmail.com';
          const userProfile = await authService.getUserProfile(currentUser.uid);
          if (userProfile) {
            userProfile.roles = Array.from(new Set([...(userProfile.roles || []), 'OWNER', 'ADMIN', 'MANAGER', 'CASHIER']));
            userProfile.permissions = ['*'];
            setProfile(userProfile);
            if (userProfile.defaultBranch && !currentBranchId) {
               setBranchId(userProfile.defaultBranch);
            }
          } else {
            // Default profile for authenticated user when document is pending/not created
            setProfile({
              uid: currentUser.uid,
              email: currentUser.email,
              phoneNumber: currentUser.phoneNumber,
              displayName: currentUser.displayName || (isOwnerUid ? 'Talk of the Town (Owner)' : 'Talk of the Town Manager'),
              roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER'],
              permissions: ['*'],
              branches: ['br_main'],
              defaultBranch: 'br_main',
              createdAt: new Date().toISOString()
            });
          }
          
          logger.info('User authenticated', { uid: currentUser.uid });
        } catch (error) {
          logger.warn('Failed to retrieve user profile, using fallback profile', error);
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
            displayName: currentUser.displayName || 'Talk of the Town Manager',
            roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER'],
            permissions: ['*'],
            branches: ['br_main'],
            defaultBranch: 'br_main',
            createdAt: new Date().toISOString()
          });
        }
      } else {
        // Fall back to saved terminal PIN session if available
        const savedSession = localStorage.getItem('talkos_terminal_session');
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            setProfile(parsed);
            setUser({ uid: parsed.uid, email: parsed.email, displayName: parsed.displayName });
          } catch {
            setUser(null);
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setBranchId, currentBranchId]);

  const loginWithTerminalPin = (pin: string): UserProfile => {
    const prof = authService.loginWithTerminalPin(pin);
    setProfile(prof);
    setUser({ uid: prof.uid, email: prof.email, displayName: prof.displayName });
    if (prof.defaultBranch && !currentBranchId) {
      setBranchId(prof.defaultBranch);
    }
    return prof;
  };

  const logout = async () => {
    localStorage.removeItem('talkos_terminal_session');
    setUser(null);
    setProfile(null);
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        logger.warn('SignOut error', err);
      }
    }
  };

  const hasRole = (role: string): boolean => {
    return profile?.roles?.includes(role) || false;
  };

  const hasPermission = (permission: string): boolean => {
    return profile?.permissions?.includes(permission) || false;
  };

  const value = {
    user,
    profile,
    loading,
    logout,
    loginWithTerminalPin,
    hasRole,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

