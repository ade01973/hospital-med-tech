import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { LEADERBOARD_TIERS } from '../data/constants';

const FriendLeaderboard = ({ playerName, playerScore }) => {
  const [friends, setFriends] = useState(() => {
    const saved = localStorage.getItem('friendList');
    return saved ? JSON.parse(saved) : [];
  });
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendScore, setNewFriendScore] = useState('');

  const addFriend = () => {
    if (!newFriendName || !newFriendScore) return;

    const newFriend = {
      id: Date.now(),
      name: newFriendName,
      score: parseInt(newFriendScore),
      addedDate: new Date().toLocaleDateString(),
      tier: getTier(parseInt(newFriendScore))
    };

    const updated = [...friends, newFriend];
    setFriends(updated);
    localStorage.setItem('friendList', JSON.stringify(updated));
    setNewFriendName('');
    setNewFriendScore('');
  };

  const removeFriend = (id) => {
    const updated = friends.filter(f => f.id !== id);
    setFriends(updated);
    localStorage.setItem('friendList', JSON.stringify(updated));
  };

  const getTier = (score) => {
    if (score >= 70000) return 'DIAMOND';
    if (score >= 35000) return 'PLATINUM';
    if (score >= 15000) return 'GOLD';
    if (score >= 5000) return 'SILVER';
    return 'BRONZE';
  };

  const sorted = [
    { name: playerName, score: playerScore, tier: getTier(playerScore), isMe: true },
    ...friends.sort((a, b) => b.score - a.score)
  ];

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/30 border border-slate-600 rounded-lg p-4 space-y-3">
        <label className="text-sm font-bold text-cyan-300">Agregar Amigo</label>
        <input
          type="text"
          placeholder="Nombre..."
          value={newFriendName}
          onChange={(e) => setNewFriendName(e.target.value)}
          className="w-full bg-slate-800/50 border border-cyan-500/30 rounded px-3 py-2 text-sm text-white placeholder-slate-500"
        />
        <input
          type="number"
          placeholder="Puntuación..."
          value={newFriendScore}
          onChange={(e) => setNewFriendScore(e.target.value)}
          className="w-full bg-slate-800/50 border border-cyan-500/30 rounded px-3 py-2 text-sm text-white placeholder-slate-500"
        />
        <button
          onClick={addFriend}
          disabled={!newFriendName || !newFriendScore}
          className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold py-2 rounded flex items-center justify-center gap-2"
        >
          <UserPlus size={16} /> Agregar
        </button>
      </div>

      <div className="space-y-2 max-h-[350px] overflow-y-auto">
        {sorted.map((friend, idx) => (
          <div
            key={friend.isMe ? 'me' : friend.id}
            className={`flex items-center justify-between p-3 rounded-lg border-2 ${
              friend.isMe
                ? 'bg-cyan-500/20 border-cyan-400'
                : 'bg-slate-800/30 border-slate-600 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="font-black text-lg">{idx === 0 ? '👑' : `#${idx}`}</span>
              <div>
                <p className={`font-bold ${friend.isMe ? 'text-cyan-300' : 'text-white'}`}>
                  {friend.name} {friend.isMe && '(Tú)'}
                </p>
                <p className="text-xs text-slate-400">{LEADERBOARD_TIERS[friend.tier].name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-black text-yellow-400">{friend.score.toLocaleString()}</span>
              {!friend.isMe && (
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="text-slate-400 hover:text-red-400 transition"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendLeaderboard;
