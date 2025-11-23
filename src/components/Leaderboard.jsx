import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';
import { db, appId } from '../firebase.js';
import { NURSING_RANKS } from '../data/constants.js';

const Leaderboard = ({ onBack }) => {
  const [leaders, setLeaders] = useState([]);
  
  useEffect(() => {
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'profiles');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => users.push(doc.data()));
      users.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
      setLeaders(users);
    });
    return () => unsubscribe();
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-950 p-4 font-sans text-white">
      <div className="max-w-2xl mx-auto mt-10">
        <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 mb-8 font-bold transition-colors uppercase tracking-wider text-xs">
          <ArrowLeft size={16}/> Volver al Mapa
        </button>
        
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4 tracking-tighter">TOP PLAYERS</h2>
           <p className="text-slate-400 font-medium uppercase tracking-widest text-sm">Ranking Global de Gestión</p>
        </div>

        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden backdrop-blur-md">
          <div className="overflow-y-auto max-h-[600px]">
            {leaders.length === 0 ? (
              <div className="p-12 text-center text-slate-600 font-mono text-sm">Cargando base de datos...</div>
             ) : (
              leaders.map((l, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-6 border-b border-slate-800/50 transition-all ${
                     idx === 0 ? 'bg-yellow-500/10 border-yellow-500/20' : 
                    idx === 1 ? 'bg-slate-400/10 border-slate-400/20' : 
                    idx === 2 ? 'bg-orange-500/10 border-orange-500/20' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 flex items-center justify-center font-black rounded-xl text-xl transform ${
                      idx === 0 ? 'bg-yellow-500 text-slate-950 rotate-3 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 
                      idx === 1 ? 'bg-slate-400 text-slate-950 -rotate-3' : 
                      idx === 2 ? 'bg-orange-500 text-slate-950 rotate-1' : 'bg-slate-800 text-slate-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                       <p className="font-black text-white text-lg tracking-tight">{l.displayName}</p>
                      <div className="flex items-center gap-2">
                         <span className={`w-2 h-2 rounded-full ${idx < 3 ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
                         <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                           {NURSING_RANKS.slice().reverse().find(r => (l.totalScore || 0) >= r.minScore)?.title || "Novato"}
                         </p>
                      </div>
                    </div>
                  </div>
                   <div className="text-right">
                    <span className="block font-black text-cyan-400 text-2xl leading-none">{l.totalScore || 0}</span>
                    <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
         </div>
      </div>
    </div>
  );
};

export default Leaderboard;
