import React, { useState, useEffect } from 'react';
import { Heart, Zap, Shield } from 'lucide-react';
import { BOSS_BATTLES } from '../data/constants';

const BossBattle = ({ selectedTeam, onBattleStart, onBattleComplete }) => {
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [bossHealth, setBossHealth] = useState(0);
  const [teamHealth, setTeamHealth] = useState(100);
  const [damageFlash, setDamageFlash] = useState(false);

  const startBattle = (boss) => {
    setSelectedBoss(boss);
    setBossHealth(boss.health);
    setTeamHealth(100);
    setIsBattleActive(true);
    onBattleStart(boss);
  };

  const attack = () => {
    if (!isBattleActive || !selectedBoss) return;

    const baseDamage = 25;
    const teamDamage = baseDamage * (selectedTeam.members.length / 2);
    const newBossHealth = Math.max(0, bossHealth - teamDamage);
    
    setBossHealth(newBossHealth);
    setDamageFlash(true);
    setTimeout(() => setDamageFlash(false), 300);

    // Boss counter-attack
    const bossDamage = selectedBoss.damage / selectedTeam.members.length;
    const newTeamHealth = Math.max(0, teamHealth - bossDamage);
    setTeamHealth(newTeamHealth);

    if (newBossHealth === 0) {
      setIsBattleActive(false);
      onBattleComplete({
        boss: selectedBoss,
        victory: true,
        teamSize: selectedTeam.members.length
      });
    }

    if (newTeamHealth === 0) {
      setIsBattleActive(false);
      onBattleComplete({
        boss: selectedBoss,
        victory: false,
        teamSize: selectedTeam.members.length
      });
    }
  };

  if (!selectedTeam) {
    return <p className="text-slate-400 text-center py-8">Selecciona un equipo</p>;
  }

  if (!isBattleActive && selectedBoss) {
    return (
      <div className="text-center space-y-4">
        <p className={`text-xl font-black ${bossHealth === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {bossHealth === 0 ? '¡VICTORIA!' : '¡DERROTA!'}
        </p>
        <button
          onClick={() => setSelectedBoss(null)}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded"
        >
          Volver
        </button>
      </div>
    );
  }

  if (isBattleActive && selectedBoss) {
    return (
      <div className="space-y-4">
        {/* Boss */}
        <div className={`text-center p-4 rounded-lg border-2 transition-all ${
          damageFlash ? 'bg-red-600/20 border-red-500 animate-boss-shake' : 'bg-slate-800/50 border-slate-600'
        }`}>
          <p className="text-4xl mb-2">{selectedBoss.name.split(' ')[0]}</p>
          <div className="bg-slate-700 rounded-full h-3 overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all animate-health-pulse"
              style={{ width: `${(bossHealth / selectedBoss.health) * 100}%` }}
            />
          </div>
          <p className="text-sm text-slate-300">{Math.max(0, bossHealth.toFixed(0))}/{selectedBoss.health} HP</p>
        </div>

        {/* Team Health */}
        <div className="bg-emerald-600/20 border-2 border-emerald-500/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={18} className="text-emerald-400" />
            <p className="font-bold text-emerald-300">Salud del Equipo</p>
          </div>
          <div className="bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
              style={{ width: `${teamHealth}%` }}
            />
          </div>
          <p className="text-xs text-slate-300 mt-1">{teamHealth.toFixed(0)}/100</p>
        </div>

        {/* Attack Button */}
        <button
          onClick={attack}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black py-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
        >
          <Zap size={20} /> ¡ATACAR!
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-cyan-300 flex items-center gap-2">
        <Shield size={18} /> Bosses Disponibles
      </h3>

      {BOSS_BATTLES.map(boss => (
        <button
          key={boss.id}
          onClick={() => startBattle(boss)}
          className="w-full bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-600 hover:border-red-500/50 rounded-lg p-4 text-left transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">{boss.name}</p>
              <p className="text-xs text-slate-400">
                {boss.health} HP • {boss.rewards.xp} XP • {boss.rewards.coins} coins
              </p>
            </div>
            <Zap size={20} className="text-red-400" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default BossBattle;
