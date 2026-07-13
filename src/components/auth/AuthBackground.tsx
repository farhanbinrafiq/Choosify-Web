import React from 'react';

export const AuthBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#000435]">
      {/* Background Grid */}
      <div className="absolute -inset-20 grid grid-cols-4 gap-4 p-10 opacity-30 blur-[40px] animate-pulse">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-64 bg-white/10 rounded-3xl" />
        ))}
      </div>
      
      {/* Dark Navy Overlay */}
      <div className="absolute inset-0 bg-[#000435]/85 z-10" />
      
      {/* Vignette */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,4,53,0.6)_100%)]" />
    </div>
  );
};
