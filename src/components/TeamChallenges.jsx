import React, { useState } from 'react';
import { Users, Swords } from 'lucide-react';
import TeamFormation from './TeamFormation';
import TeamQuest from './TeamQuest';
import BossBattle from './BossBattle';
import { TOPICS } from '../data/constants';

const TeamChallenges = ({ isOpen, onClose, playerName, playerUID }) => {
  const [activeTab, setActiveTab] = useState('formation');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-emerald-500/50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex items-center justify-between border-b border-emerald-400/30">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Users size={28} /> DESAFÍOS EN EQUIPO
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
            onClick={() => setActiveTab('formation')}
            className={`flex-1 py-3 font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'formation'
                ? 'bg-emerald-600/20 border-b-2 border-emerald-400 text-emerald-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={18} /> Formación
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            disabled={!selectedTeam}
            className={`flex-1 py-3 font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
              activeTab === 'quests'
                ? 'bg-emerald-600/20 border-b-2 border-emerald-400 text-emerald-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={18} /> Quests
          </button>
          <button
            onClick={() => setActiveTab('boss')}
            disabled={!selectedTeam}
            className={`flex-1 py-3 font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
              activeTab === 'boss'
                ? 'bg-emerald-600/20 border-b-2 border-emerald-400 text-emerald-300'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords size={18} /> Boss
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'formation' && (
            <TeamFormation
              playerName={playerName}
              playerUID={playerUID}
              onTeamCreated={setSelectedTeam}
            />
          )}
          {activeTab === 'quests' && selectedTeam && (
            <div className="space-y-4">
              {/* Topic Selector */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-cyan-300">Selecciona un Tema:</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(parseInt(e.target.value))}
                  className="w-full bg-slate-800 border-2 border-slate-600 text-white rounded-lg p-3 font-bold hover:border-cyan-400 transition"
                >
                  {TOPICS.map((topic, idx) => (
                    <option key={idx} value={idx}>
                      {topic.icon} {topic.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* TeamQuest Component */}
              <TeamQuest
                selectedTeam={selectedTeam}
                selectedTopic={selectedTopic}
                onQuestStart={() => {}}
                onQuestComplete={() => {}}
              />
            </div>
          )}
          {activeTab === 'boss' && selectedTeam && (
            <BossBattle
              selectedTeam={selectedTeam}
              onBattleStart={() => {}}
              onBattleComplete={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamChallenges;
