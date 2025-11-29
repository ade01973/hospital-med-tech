import React, { useState, useEffect } from 'react';
import { Heart, Zap, Shield, RotateCcw } from 'lucide-react';
import { BOSS_BATTLES, BATTLE_MECHANICS } from '../data/constants';

const BossBattle = ({
  selectedTeam,
  onBattleStart,
  onBattleComplete
}) => {
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [bossHealth, setBossHealth] = useState(0);
  const [teamHealth, setTeamHealth] = useState(100);
  const [turnCount, setTurnCount] = useState(0);
  const [lastAction, setLastAction] = useState(null);
  const [bossAction, setBossAction] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [battleLog, setBattleLog] = useState([]);

  // Seleccionar un boss
  const startBattle = (boss) => {
    setSelectedBoss(boss);
    setBossHealth(boss.health);
    setTeamHealth(100);
    setTurnCount(0);
    setLastAction(null);
    setBossAction(null);
    setRoundResult(null);
    setBattleLog([]);
    setIsBattleActive(true);
    onBattleStart(boss);
  };

  // Función para calcular el ganador de una ronda
  const calculateRoundWinner = (teamAction, bossAct) => {
    if (teamAction === bossAct) {
      return 'draw';
    }

    const key = `${teamAction}-${bossAct}`;
    const modifier = BATTLE_MECHANICS.EFFECTIVENESS[key];

    if (modifier > 0) return 'win';
    if (modifier < 0) return 'loss';
    return 'draw';
  };

  // Función para hacer una acción
  const performAction = (teamAction) => {
    if (!isBattleActive || !selectedBoss) return;

    // Boss elige una acción al azar
    const possibleActions = BATTLE_MECHANICS.ACTIONS;
    const bossActs = [
      possibleActions.ATTACK,
      possibleActions.DEFEND,
      possibleActions.COUNTER
    ];
    const randomBossAction = bossActs[Math.floor(Math.random() * bossActs.length)];
    setBossAction(randomBossAction);
    setLastAction(teamAction);

    // Calcular resultado
    const result = calculateRoundWinner(teamAction, randomBossAction);
    setRoundResult(result);

    let newBossHealth = bossHealth;
    let newTeamHealth = teamHealth;
    let logMessage = '';

    // Aplicar daño según resultado
    if (result === 'win') {
      const modifier = BATTLE_MECHANICS.EFFECTIVENESS[`${teamAction}-${randomBossAction}`];
      const teamDamage = BATTLE_MECHANICS.TEAM_BASE_DAMAGE + modifier;
      newBossHealth = Math.max(0, bossHealth - teamDamage);
      logMessage = `✅ **${teamAction}** vence a **${randomBossAction}**! Daño al boss: ${teamDamage}`;
    } else if (result === 'loss') {
      const modifier = Math.abs(BATTLE_MECHANICS.EFFECTIVENESS[`${teamAction}-${randomBossAction}`]);
      const bossDamage = selectedBoss.damage + modifier;
      newTeamHealth = Math.max(0, teamHealth - bossDamage);
      logMessage = `❌ **${randomBossAction}** del boss es más fuerte! Daño al equipo: ${bossDamage}`;
    } else {
      // Draw - ambos reciben daño reducido
      const drawDamage = 5;
      newBossHealth = Math.max(0, bossHealth - drawDamage);
      newTeamHealth = Math.max(0, teamHealth - drawDamage);
      logMessage = `🔄 Ambos se atacan simultáneamente! Daño mutuo: ${drawDamage}`;
    }

    setBossHealth(newBossHealth);
    setTeamHealth(newTeamHealth);
    setTurnCount(turnCount + 1);
    setBattleLog([logMessage, ...battleLog]);

    // Verificar condiciones de fin
    if (newBossHealth === 0) {
      setIsBattleActive(false);
      onBattleComplete({
        boss: selectedBoss,
        victory: true,
        teamSize: selectedTeam.members.length,
        turns: turnCount + 1
      });
    } else if (newTeamHealth === 0) {
      setIsBattleActive(false);
      onBattleComplete({
        boss: selectedBoss,
        victory: false,
        teamSize: selectedTeam.members.length,
        turns: turnCount + 1
      });
    }
  };

  // Resetear batalla
  const resetBattle = () => {
    setSelectedBoss(null);
    setIsBattleActive(false);
    setBossHealth(0);
    setTeamHealth(100);
    setTurnCount(0);
    setLastAction(null);
    setBossAction(null);
    setRoundResult(null);
    setBattleLog([]);
  };

  if (!selectedTeam) {
    return (
      <div className="text-slate-400 text-center py-8">
        Selecciona un equipo
      </div>
    );
  }

  // Vista de selección de boss
  if (!isBattleActive && !selectedBoss) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-cyan-400 mb-4">🐉 Elige un Boss para Enfrentar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BOSS_BATTLES.map((boss) => (
            <div
              key={boss.id}
              className="bg-slate-700 border-2 border-cyan-500 rounded-lg p-4 hover:border-cyan-300 cursor-pointer transition-all"
              onClick={() => startBattle(boss)}
            >
              <div className="text-3xl mb-2">{boss.emoji}</div>
              <h4 className="font-bold text-cyan-300">{boss.name}</h4>
              <p className="text-slate-400 text-sm mb-2">{boss.description}</p>
              <div className="flex justify-between text-sm">
                <span>❤️ {boss.health} HP</span>
                <span className={`font-bold ${
                  boss.difficulty === 'Fácil'
                    ? 'text-green-400'
                    : boss.difficulty === 'Normal'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}>
                  {boss.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vista de batalla en progreso
  if (isBattleActive && selectedBoss) {
    return (
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-cyan-400 mb-2">
            {selectedBoss.emoji} {selectedBoss.name}
          </h3>
          <p className="text-slate-400">Turno {turnCount + 1}</p>
        </div>

        {/* Barras de Salud */}
        <div className="grid grid-cols-2 gap-4">
          {/* Boss */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-red-500" size={20} />
              <span className="font-bold text-red-400">Boss</span>
            </div>
            <div className="bg-slate-800 rounded-full h-6 overflow-hidden border-2 border-red-500">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                style={{ width: `${(bossHealth / selectedBoss.health) * 100}%` }}
              />
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {bossHealth} / {selectedBoss.health} HP
            </div>
          </div>

          {/* Equipo */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="text-green-500" size={20} />
              <span className="font-bold text-green-400">Tu Equipo</span>
            </div>
            <div className="bg-slate-800 rounded-full h-6 overflow-hidden border-2 border-green-500">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300"
                style={{ width: `${(teamHealth / 100) * 100}%` }}
              />
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {teamHealth} / 100 HP
            </div>
          </div>
        </div>

        {/* Último turno resultado */}
        {roundResult && (
          <div
            className={`p-4 rounded-lg border-2 ${
              roundResult === 'win'
                ? 'border-green-500 bg-green-500/20'
                : roundResult === 'loss'
                ? 'border-red-500 bg-red-500/20'
                : 'border-yellow-500 bg-yellow-500/20'
            }`}
          >
            <div className="text-center">
              <div className="font-bold text-lg mb-2">
                {roundResult === 'win'
                  ? '✅ ¡Ganaste esta ronda!'
                  : roundResult === 'loss'
                  ? '❌ El boss ganó esta ronda'
                  : '🔄 Empate - Ambos se atacan'}
              </div>
              <div className="text-sm">
                Tu equipo: <span className="font-bold">{lastAction}</span> vs Boss:
                <span className="font-bold">{bossAction}</span>
              </div>
            </div>
          </div>
        )}

        {/* Botones de Acciones */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { action: 'Atacar', icon: '⚔️', desc: 'Daño directo' },
            { action: 'Defender', icon: '🛡️', desc: 'Reduce daño' },
            { action: 'Contra-ataque', icon: '⚡', desc: 'Ataque estratégico' }
          ].map(({ action, icon, desc }) => (
            <button
              key={action}
              onClick={() => performAction(action)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95"
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-sm font-bold">{action}</div>
              <div className="text-xs text-cyan-200">{desc}</div>
            </button>
          ))}
        </div>

        {/* Battle Log */}
        {battleLog.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-3 max-h-32 overflow-y-auto">
            <div className="text-xs font-bold text-slate-400 mb-2">📝 Registro de Batalla</div>
            {battleLog.map((log, idx) => (
              <div key={idx} className="text-sm text-slate-300 mb-1">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Vista de resultado
  return (
    <div className="text-center space-y-4">
      <div className="text-4xl mb-4">
        {bossHealth === 0 ? '🎉' : '💀'}
      </div>
      <h3
        className={`text-2xl font-bold ${
          bossHealth === 0 ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {bossHealth === 0 ? '¡VICTORIA!' : 'DERROTA'}
      </h3>
      <p className="text-slate-400">
        {bossHealth === 0
          ? `Has derrotado a ${selectedBoss.name}! +${selectedBoss.rewards.xp} XP`
          : `El ${selectedBoss.name} fue demasiado poderoso. Intenta de nuevo.`}
      </p>
      <p className="text-sm text-slate-500">Duraste {turnCount} turnos</p>
      <button
        onClick={resetBattle}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 mx-auto"
      >
        <RotateCcw size={18} />
        Volver a Intentar
      </button>
    </div>
  );
};

export default BossBattle;