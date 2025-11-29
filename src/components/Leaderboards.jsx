import React, { useState } from 'react';
import { Trophy, Users, Zap } from 'lucide-react';
import GlobalLeaderboard from './GlobalLeaderboard';
import FriendLeaderboard from './FriendLeaderboard';
import WeeklyLeaderboard from './WeeklyLeaderboard';

const Leaderboards = ({ isOpen, onClose, playerScore, playerName, playerUID, weeklyXP }) => {
  const [activeTab, setActiveTab] = useState('global');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-cyan-500/50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex items-center justify-between border-b border-cyan-400/30">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy size={28} /> CLASIFICACIONES
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-800/50">
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-3 font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'global'
                ? 'bg-cyan-600/20 border-b-2 border-cyan-400 text-cyan-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy size={18} /> Global
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'friends'
                ? 'bg-cyan-600/20 border-b-2 border-cyan-400 text-cyan-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={18} /> Amigos
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 py-3 font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'weekly'
                ? 'bg-cyan-600/20 border-b-2 border-cyan-400 text-cyan-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap size={18} /> Semanal
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'global' && (
            <GlobalLeaderboard
              playerScore={playerScore}
              playerName={playerName}
              playerUID={playerUID}
            />
          )}
          {activeTab === 'friends' && (
            <FriendLeaderboard playerName={playerName} playerScore={playerScore} />
          )}
          {activeTab === 'weekly' && (
            <WeeklyLeaderboard playerUID={playerUID} playerName={playerName} weeklyXP={weeklyXP} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;
