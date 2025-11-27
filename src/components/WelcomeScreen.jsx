import React from 'react';
import { ChevronRight, LogOut } from 'lucide-react';
import hospitalBg from '../assets/hospital-background.png';

const WelcomeScreen = ({ onContinue, onLogout }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${hospitalBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center relative z-10">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 transform hover:scale-110 transition-all duration-500">
          <span className="text-5xl">🏥</span>
        </div>
        
        <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">¡Bienvenid@s!</h1>
        <p className="text-2xl text-cyan-400 font-bold mb-8">al Hospital Gest-Tech</p>
        
        <p className="text-slate-300 text-base mb-8 leading-relaxed max-w-lg mx-auto">
          Ingresa en el simulador de gestión sanitaria más avanzado. Completa módulos de liderazgo, toma de decisiones y gestión hospitalaria. Sube de rango y demuestra tus habilidades como gestor sanitario.
        </p>

        <div className="space-y-3">
          <button 
            onClick={onContinue}
            className="w-full bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-base"
          >
            Crear mi Avatar <ChevronRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold py-3 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
