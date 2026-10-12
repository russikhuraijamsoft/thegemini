import React from 'react';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-50">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8"></div>
      <h1 className="text-3xl font-bold tracking-tight text-white mb-2">TalkOS</h1>
      <p className="text-slate-400 font-medium tracking-wide text-sm">ENTERPRISE RESTAURANT OS</p>
    </div>
  );
}
