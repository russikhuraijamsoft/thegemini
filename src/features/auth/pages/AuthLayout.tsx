import React from 'react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#800000] text-white font-black text-2xl shadow-md mb-3">
          T
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#800000] mb-1">TalkOS</h1>
        <p className="text-[#800000]/70 font-semibold tracking-widest text-xs uppercase">Enterprise Restaurant OS</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-[#ebd5da]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
