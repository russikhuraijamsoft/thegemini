import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './config/routes';
import { AuthProvider } from './core/auth/AuthContext';
import { ThemeProvider } from './core/theme/ThemeProvider';
import { ErrorBoundary } from './core/error/ErrorBoundary';
import { useAppStore } from './core/store/appStore';
import './core/i18n/i18n'; // Initialize i18n

export default function App() {
  const setOfflineMode = useAppStore(state => state.setOfflineMode);

  useEffect(() => {
    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOfflineMode]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
