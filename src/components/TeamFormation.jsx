import React, { useState, useEffect } from 'react';
import { Users, UserPlus, X } from 'lucide-react';
import { TEAM_CONFIG, DEMO_PLAYER_NAMES } from '../data/constants';

const TeamFormation = ({ playerName, playerUID, onTeamCreated }) => {
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('userTeams');
    return saved ? JSON.parse(saved) : [];
  });
  const [myTeams, setMyTeams] = useState(() => {
    const saved = localStorage.getItem('userTeams');
    return saved ? JSON.parse(saved).filter(t => t.leader === playerUID) : [];
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([playerName]);

  const createTeam = () => {
    if (!teamName || selectedMembers.length < TEAM_CONFIG.MIN_TEAM_SIZE) return;

    const newTeam = {
      id: Date.now(),
      name: teamName,
      leader: playerUID,
      members: selectedMembers,
      createdDate: new Date().toLocaleDateString(),
      questsCompleted: 0,
      totalXP: 0,
      achievements: []
    };

    const updated = [...teams, newTeam];
    setTeams(updated);
    setMyTeams([...myTeams, newTeam]);
    localStorage.setItem('userTeams', JSON.stringify(updated));
    
    onTeamCreated(newTeam);
    
    setTeamName('');
    setSelectedMembers([playerName]);
    setShowCreateForm(false);
  };

  const toggleMember = (memberName) => {
    if (memberName === playerName) return; // Always included

    setSelectedMembers(prev =>
      prev.includes(memberName)
        ? prev.filter(m => m !== memberName)
        : prev.length < TEAM_CONFIG.MAX_TEAM_SIZE
        ? [...prev, memberName]
        : prev
    );
  };

  const deleteTeam = (teamId) => {
    const updated = teams.filter(t => t.id !== teamId);
    setTeams(updated);
    setMyTeams(myTeams.filter(t => t.id !== teamId));
    localStorage.setItem('userTeams', JSON.stringify(updated));
  };

  const availableMembers = DEMO_PLAYER_NAMES.filter(name => name !== playerName).slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Create Team Button */}
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
      >
        <UserPlus size={20} /> Crear Equipo
      </button>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-slate-800/50 border-2 border-emerald-500/30 rounded-lg p-4 space-y-3">
          <input
            type="text"
            placeholder="Nombre del equipo..."
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            maxLength={20}
            className="w-full bg-slate-800/50 border border-emerald-500/30 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
          />

          <div>
            <p className="text-xs font-bold text-emerald-300 mb-2">
              Miembros ({selectedMembers.length}/{TEAM_CONFIG.MAX_TEAM_SIZE})
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {/* Always included */}
              <div className="flex items-center gap-2 p-2 bg-emerald-600/20 rounded border border-emerald-500/50">
                <input type="checkbox" checked disabled className="w-4 h-4" />
                <span className="text-white font-bold">{playerName} (Tú)</span>
              </div>

              {/* Available members */}
              {availableMembers.map(member => (
                <label key={member} className="flex items-center gap-2 p-2 hover:bg-slate-700/50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member)}
                    onChange={() => toggleMember(member)}
                    disabled={selectedMembers.length >= TEAM_CONFIG.MAX_TEAM_SIZE && !selectedMembers.includes(member)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">{member}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={createTeam}
            disabled={!teamName || selectedMembers.length < TEAM_CONFIG.MIN_TEAM_SIZE}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2 rounded transition"
          >
            Crear Equipo
          </button>
        </div>
      )}

      {/* My Teams */}
      <div>
        <h3 className="font-bold text-cyan-300 mb-3 flex items-center gap-2">
          <Users size={18} /> Mis Equipos ({myTeams.length})
        </h3>
        <div className="space-y-2">
          {myTeams.length === 0 ? (
            <p className="text-slate-400 text-sm">No tienes equipos aún.</p>
          ) : (
            myTeams.map(team => (
              <div key={team.id} className="bg-slate-800/30 border border-slate-600 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-white">{team.name}</p>
                    <p className="text-xs text-slate-400">{team.members.length} miembros</p>
                  </div>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="text-slate-400 hover:text-red-400 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {team.members.map(member => (
                    <span key={member} className="text-xs bg-cyan-600/20 text-cyan-300 px-2 py-1 rounded">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamFormation;
