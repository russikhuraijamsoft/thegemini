import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../../core/auth/AuthContext';

export function PinAuthPage() {
  const navigate = useNavigate();
  const { user, loginWithTerminalPin } = useAuth();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (pin.length < 4) {
        throw new Error('PIN must be at least 4 digits');
      }

      loginWithTerminalPin(pin);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid Terminal PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/auth" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white ml-4">Manager PIN Login</h2>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mb-4 bg-[#fee8eb] border border-[#ebd5da] text-[#800000] px-4 py-3 rounded-lg text-xs font-medium space-y-1">
        <div className="font-bold">Terminal Quick Unlock PINs:</div>
        <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
          <span className="bg-white/80 py-1 rounded">1234 (Owner)</span>
          <span className="bg-white/80 py-1 rounded">9999 (Manager)</span>
          <span className="bg-white/80 py-1 rounded">0000 (Cashier)</span>
        </div>
      </div>

      <form onSubmit={handlePinLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Enter your 4-digit PIN</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password"
              required
              maxLength={4}
              pattern="[0-9]*"
              inputMode="numeric"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-2xl text-center tracking-[1em]"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Unlock Terminal'}
        </button>
      </form>
    </div>
  );
}
