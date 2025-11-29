import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Zap } from 'lucide-react';
import { LEADERBOARD_TIERS, DEMO_PLAYER_NAMES } from '../data/constants';

const GlobalLeaderboard = ({ playerScore, playerName, playerUID }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchPlayer, setSearchPlayer] = useState('');

  useEffect(() => {
    // Generar leaderboard simulado (50 jugadores)
    const mock = DEMO_PLAYER_NAMES.map((name, idx) => {
      const baseScore = 80000 - (idx * 800) + Math.random() * 5000;
      return {
        id: idx,
        name,
        score: Math.floor(baseScore),
        rank: idx + 1,
        tier: getTier(baseScore),
        weeklyXP: Math.floor(Math.random() * 5000),
        streak: Math.floor(Math.random() * 30)
      };
    });

    // Agregar al jugador si no está
    if (!mock.find(p => p.id === playerUID)) {
      mock.push({
        id: playerUID,
        name: playerName,
        score: playerScore,
        rank: mock.length + 1,
        tier: getTier(playerScore),
        weeklyXP: 0,
        streak: 0
      });
    }

    // Ordenar por score
    mock.sort((a, b) => b.score - a.score);
    mock.forEach((p, idx) => p.rank = idx + 1);

    setLeaderboard(mock.slice(0, 50));
  }, [playerScore, playerName, playerUID]);

  const getTier = (score) => {
    if (score >= 70000) return 'DIAMOND';
    if (score >= 35000) return 'PLATINUM';
    if (score >= 15000) return 'GOLD';
    if (score >= 5000) return 'SILVER';
    return 'BRONZE';
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const filtered = leaderboard.filter(p =>
    p.name.toLowerCase().includes(searchPlayer.toLowerCase())
  );

  const isMe = (id) => id === playerUID;

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Buscar jugador..."
        value={searchPlayer}
        onChange={(e) => setSearchPlayer(e.target.value)}
        className="w-full bg-slate-800/50 border border-cyan-500/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
      />

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filtered.map((player) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
              isMe(player.id)
                ? 'bg-cyan-500/20 border-cyan-400 animate-rank-bounce'
                : 'bg-slate-800/30 border-slate-600 hover:border-cyan-500/50'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl font-black w-8 text-center">{getMedalIcon(player.rank)}</span>
              <div className="flex-1">
                <p className={`font-bold ${isMe(player.id) ? 'text-cyan-300' : 'text-white'}`}>
                  {player.name} {isMe(player.id) && '👤'}
                </p>
                <p className="text-xs text-slate-400">{LEADERBOARD_TIERS[player.tier].name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-lg text-yellow-400">{player.score.toLocaleString()}</p>
              <p className="text-xs text-emerald-400">🔥 {player.streak}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalLeaderboard;
