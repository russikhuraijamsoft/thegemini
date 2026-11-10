import React, { useEffect, useState } from 'react';

import {
  hashOwnerPassword,
  OWNER_PASSWORD_STORAGE_KEY,
  validateOwnerPassword,
} from './firstRunPassword';

export function FirstRunPasswordGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [unlock, setUnlock] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHasPassword(Boolean(localStorage.getItem(OWNER_PASSWORD_STORAGE_KEY)));
    setLoading(false);
  }, []);

  const handleSetup = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const validationError = validateOwnerPassword(password, confirm);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const hash = await hashOwnerPassword(password);
      localStorage.setItem(OWNER_PASSWORD_STORAGE_KEY, hash);
      setHasPassword(true);
      setPassword('');
      setConfirm('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save the password.');
    }
  };

  const handleUnlock = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const stored = localStorage.getItem(OWNER_PASSWORD_STORAGE_KEY);
      const hash = await hashOwnerPassword(unlock);
      if (stored && hash === stored) {
        setReady(true);
        setUnlock('');
        return;
      }

      setError('Incorrect password.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to unlock the terminal.');
    }
  };

  if (loading) return null;

  if (!hasPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 dark:bg-slate-900">
        <form onSubmit={handleSetup} className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow dark:bg-slate-800">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Set Owner Password</h1>
          <p className="text-sm text-slate-500">First launch: choose a password to protect this terminal.</p>
          {error && <div role="alert" className="text-sm text-red-600">{error}</div>}
          <label className="block">
            <span className="sr-only">Password</span>
            <input autoComplete="new-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full rounded border px-3 py-2" />
          </label>
          <label className="block">
            <span className="sr-only">Confirm password</span>
            <input autoComplete="new-password" required type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Confirm password" className="w-full rounded border px-3 py-2" />
          </label>
          <button type="submit" className="w-full rounded bg-indigo-600 py-2 text-white">Save Password</button>
        </form>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 dark:bg-slate-900">
        <form onSubmit={handleUnlock} className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow dark:bg-slate-800">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Unlock Terminal</h1>
          {error && <div role="alert" className="text-sm text-red-600">{error}</div>}
          <label className="block">
            <span className="sr-only">Password</span>
            <input autoComplete="current-password" required type="password" value={unlock} onChange={(event) => setUnlock(event.target.value)} placeholder="Password" className="w-full rounded border px-3 py-2" />
          </label>
          <button type="submit" className="w-full rounded bg-indigo-600 py-2 text-white">Unlock</button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
