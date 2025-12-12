import React from 'react';
import { Crown, Shield, Sparkles, Swords, Wand2 } from 'lucide-react';

const BrainstormBattleHero = ({ onJoin, onHost }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Energy layers */}
      <div className="absolute inset-0 opacity-70 mix-blend-screen">
        <div className="absolute -top-32 -left-20 w-80 h-80 bg-cyan-600/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-40 -right-10 w-96 h-96 bg-orange-500/25 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-600/25 blur-[110px] rounded-full animate-pulse" />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(59,130,246,0.1)_0%,rgba(249,115,22,0.08)_50%,rgba(79,70,229,0.1)_100%)] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-5xl w-full text-center space-y-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.35)] backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span className="text-xs font-semibold tracking-[0.35em] text-cyan-200 uppercase">Modo Versus Creativo</span>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-cyan-200/80 tracking-[0.35em] uppercase">Evento especial</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black drop-shadow-[0_0_35px_rgba(255,255,255,0.35)] leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-white to-amber-400 drop-shadow-[0_0_28px_rgba(255,200,87,0.5)]">
              La Batalla de las Ideas
            </span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={onJoin}
            className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-lg uppercase tracking-wide overflow-hidden border-2 border-cyan-400/70 bg-gradient-to-br from-sky-500 via-cyan-500 to-orange-500 shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:shadow-[0_0_55px_rgba(249,115,22,0.5)] transition-all duration-300"
          >
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.4),transparent_30%)] group-hover:opacity-60 transition-opacity" />
            <div className="relative flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 shadow-inner shadow-cyan-500/30">
                <div className="relative">
                  <Shield className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  <Swords className="w-5 h-5 text-orange-200 absolute -bottom-1 -right-2 drop-shadow-[0_0_10px_rgba(251,146,60,0.9)]" />
                </div>
              </div>
              <span className="relative">Unirse a la Batalla</span>
            </div>
          </button>

          <button
            onClick={onHost}
            className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-lg uppercase tracking-wide overflow-hidden border-2 border-purple-400/70 bg-gradient-to-br from-purple-700 via-violet-600 to-amber-500 shadow-[0_0_35px_rgba(168,85,247,0.45)] hover:shadow-[0_0_55px_rgba(251,191,36,0.55)] transition-all duration-300"
          >
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.6),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.45),transparent_30%)] group-hover:opacity-60 transition-opacity" />
            <div className="relative flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 shadow-inner shadow-purple-500/30">
                <div className="relative">
                  <Crown className="w-6 h-6 text-amber-200 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                  <Wand2 className="w-5 h-5 text-violet-200 absolute -bottom-1 -right-2 drop-shadow-[0_0_10px_rgba(167,139,250,0.9)]" />
                </div>
              </div>
              <span className="relative">Ir a la Batalla</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrainstormBattleHero;
