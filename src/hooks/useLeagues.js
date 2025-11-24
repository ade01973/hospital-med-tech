import { useState, useEffect } from 'react';
import { NURSING_RANKS, LEAGUE_SYSTEM, DEMO_PLAYER_NAMES } from '../data/constants';

export const useLeagues = (playerRank = 'Estudiante', playerXP = 0, playerId = 'demo') => {
  const [currentLeague, setCurrentLeague] = useState(null);
  const [leagueRanking, setLeagueRanking] = useState([]);
  const [playerPosition, setPlayerPosition] = useState(null);
  const [weeklyXP, setWeeklyXP] = useState(0);

  // Obtener liga basada en rango
  const getRankLeague = (rank) => {
    const rankData = NURSING_RANKS.find(r => r.title === rank);
    if (!rankData?.league) return null;
    return LEAGUE_SYSTEM[rankData.league];
  };

  // Inicializar datos de liga
  useEffect(() => {
    const initializeLeagueData = () => {
      const league = getRankLeague(playerRank);
      setCurrentLeague(league);

      if (league) {
        // Cargar o crear datos de ranking semanal
        const leagueKey = `league_${league.name.replace(/\s+/g, '_')}`;
        let leagueData = JSON.parse(localStorage.getItem(leagueKey)) || {
          lastReset: new Date().toDateString(),
          players: []
        };

        // Verificar si es nueva semana
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);
        const thisWeekMonday = monday.toDateString();

        if (leagueData.lastReset !== thisWeekMonday) {
          console.log('🔄 Reset de liga - nueva semana');
          leagueData = {
            lastReset: thisWeekMonday,
            players: generateDemoPlayers(league, playerId)
          };
          localStorage.setItem(leagueKey, JSON.stringify(leagueData));
        }

        // Actualizar XP del jugador
        const playerInLeague = leagueData.players.find(p => p.id === playerId);
        if (playerInLeague) {
          playerInLeague.xp = playerXP; // XP ganado esta semana
        } else {
          leagueData.players.push({
            id: playerId,
            name: 'TÚ',
            rank: playerRank,
            xp: playerXP,
            badge: null,
            isPlayer: true
          });
        }

        // Ordenar y obtener Top 10
        const sorted = leagueData.players.sort((a, b) => b.xp - a.xp).slice(0, 10);
        
        // Encontrar posición del jugador
        const pos = sorted.findIndex(p => p.id === playerId) + 1;
        setPlayerPosition(pos || null);
        setWeeklyXP(playerXP);
        setLeagueRanking(sorted);

        // Guardar actualizado
        localStorage.setItem(leagueKey, JSON.stringify(leagueData));
      }
    };

    initializeLeagueData();
  }, [playerRank, playerXP, playerId]);

  // Generar jugadores demo
  const generateDemoPlayers = (league, playerId) => {
    const demoPlayers = [];
    
    // Generar 9 jugadores ficticios
    for (let i = 0; i < 9; i++) {
      const name = DEMO_PLAYER_NAMES[i] || `Jugador ${i + 1}`;
      const xp = Math.floor(Math.random() * 3000) + 500;
      
      demoPlayers.push({
        id: `demo_${i}`,
        name,
        rank: league.ranks[Math.floor(Math.random() * league.ranks.length)],
        xp,
        badge: i === 0 ? league.rewards.first.badge : i === 1 ? league.rewards.second.badge : i === 2 ? league.rewards.third.badge : null,
        isPlayer: false
      });
    }

    return demoPlayers;
  };

  // Obtener siguiente liga
  const getNextLeague = () => {
    if (!currentLeague) return null;

    const leagueKeys = ['BRONCE', 'PLATA', 'ORO', 'PLATINO', 'LEYENDA'];
    const currentLeagueKey = leagueKeys.find(k => LEAGUE_SYSTEM[k]?.name === currentLeague?.name);
    const currentIndex = currentLeagueKey ? leagueKeys.indexOf(currentLeagueKey) : -1;

    if (currentIndex >= 0 && currentIndex < leagueKeys.length - 1) {
      const nextKey = leagueKeys[currentIndex + 1];
      return LEAGUE_SYSTEM[nextKey] || null;
    }

    return null;
  };

  // Calcular días hasta fin de semana
  const getDaysUntilWeekEnd = () => {
    try {
      const today = new Date();
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay() + 7);
      
      const diffTime = sunday.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return Math.max(0, diffDays);
    } catch (e) {
      return 0;
    }
  };

  return {
    currentLeague,
    leagueRanking,
    playerPosition,
    weeklyXP,
    getNextLeague,
    getDaysUntilWeekEnd
  };
};
