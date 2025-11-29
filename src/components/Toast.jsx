import React, { useEffect, useState } from 'react';

/**
 * Toast - Simple notification toast
 * Aparece en la esquina superior derecha y desaparece automáticamente
 */
const Toast = ({ message, icon, duration = 2000, type = 'success' }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'from-cyan-600 to-blue-600' : type === 'error' ? 'from-red-600 to-pink-600' : 'from-slate-700 to-slate-800';

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slideInRight">
      <div className={`bg-gradient-to-r ${bgColor} text-white px-6 py-3 rounded-lg font-bold shadow-lg flex items-center gap-3 backdrop-blur-md border border-white/20`}>
        {icon && <span className="text-xl">{icon}</span>}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
