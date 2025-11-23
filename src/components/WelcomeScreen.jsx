import React from 'react';
import { ChevronRight, LogOut } from 'lucide-react';
import { NURSING_RANKS } from '../data/constants.js';

const WelcomeScreen = ({ onContinue, onLogout }) => {
  const currentRank = NURSING_RANKS[0];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10">
        <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${currentRank.color} rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 transform hover:scale-110 transition-all duration-500 text-4xl`}>
          {currentRank.icon}
        </div>
        
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">¡BIENVENIDO!</h1>
        <p className="text-slate-400 mb-4 text-sm uppercase tracking-widest font-bold">Al Simulador de Gestión</p>
        
        <div className="bg-slate-950/50 rounded-2xl p-6 mb-8 border border-white/5">
          <p className="text-slate-300 mb-4 font-medium">
            Eres un <span className="text-cyan-400 font-bold">{currentRank.title}</span>
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-slate-500 text-sm">Experiencia:</span>
            <span className="text-cyan-400 font-black text-lg">0 XP</span>
          </div>
        </div>

        <p className="text-slate-400 text-xs mb-6 leading-relaxed">
          Completa módulos de gestión sanitaria, resuelve casos desafiantes y sube de rango mientras mejoram tus habilidades de liderazgo.
        </p>

        <div className="space-y-3">
          <button 
            onClick={onContinue}
            className="w-full bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
          >
            Comenzar <ChevronRight className="w-5 h-5" />
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
