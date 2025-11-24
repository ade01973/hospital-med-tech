import { useState, useEffect } from 'react';

export const useMissions = () => {
  const [dailyMissions, setDailyMissions] = useState({});
  const [weeklyMission, setWeeklyMission] = useState({});

  // Inicializar desde localStorage al cargar
  useEffect(() => {
    const checkAndResetMissions = () => {
      const lastReset = localStorage.getItem('lastMissionReset');
      const now = new Date();
      const today = now.toDateString();

      // Reset diario cada 24h
      if (lastReset !== today) {
        console.log('🔄 Reset diario de misiones - día nuevo:', today);
        localStorage.setItem('lastMissionReset', today);
        localStorage.removeItem('dailyMissions');
        const freshDaily = {
          questions_answered: { progress: 0, target: 10, completed: false, claimed: false, reward: 300 },
          streak_active: { progress: 0, target: 1, completed: false, claimed: false, reward: 200 },
          fast_answers: { progress: 0, target: 5, completed: false, claimed: false, reward: 'powerup' }
        };
        localStorage.setItem('dailyMissions', JSON.stringify(freshDaily));
        setDailyMissions(freshDaily);
      } else {
        // Cargar misiones guardadas del día
        const saved = localStorage.getItem('dailyMissions');
        if (saved) {
          setDailyMissions(JSON.parse(saved));
        } else {
          const freshDaily = {
            questions_answered: { progress: 0, target: 10, completed: false, claimed: false, reward: 300 },
            streak_active: { progress: 0, target: 1, completed: false, claimed: false, reward: 200 },
            fast_answers: { progress: 0, target: 5, completed: false, claimed: false, reward: 'powerup' }
          };
          localStorage.setItem('dailyMissions', JSON.stringify(freshDaily));
          setDailyMissions(freshDaily);
        }
      }

      // Reset semanal cada lunes
      const lastWeeklyReset = localStorage.getItem('lastWeeklyReset');
      if (now.getDay() === 1) { // Monday
        if (lastWeeklyReset !== today) {
          console.log('🔄 Reset semanal de misiones - lunes nuevo:', today);
          localStorage.setItem('lastWeeklyReset', today);
          localStorage.removeItem('weeklyMission');
          const freshWeekly = {
            perfect_levels: { progress: 0, target: 3, completed: false, claimed: false, reward: 1500, badge: 'Estudiante Dedicado' }
          };
          localStorage.setItem('weeklyMission', JSON.stringify(freshWeekly));
          setWeeklyMission(freshWeekly);
        } else {
          const saved = localStorage.getItem('weeklyMission');
          if (saved) {
            setWeeklyMission(JSON.parse(saved));
          }
        }
      } else if (lastWeeklyReset) {
        const saved = localStorage.getItem('weeklyMission');
        if (saved) {
          setWeeklyMission(JSON.parse(saved));
        } else {
          const freshWeekly = {
            perfect_levels: { progress: 0, target: 3, completed: false, claimed: false, reward: 1500, badge: 'Estudiante Dedicado' }
          };
          localStorage.setItem('weeklyMission', JSON.stringify(freshWeekly));
          setWeeklyMission(freshWeekly);
        }
      }
    };

    checkAndResetMissions();
  }, []);

  // Sincronizar cambios de localStorage cada segundo (polling)
  useEffect(() => {
    const interval = setInterval(() => {
      const savedDaily = localStorage.getItem('dailyMissions');
      const savedWeekly = localStorage.getItem('weeklyMission');
      
      if (savedDaily) {
        setDailyMissions(JSON.parse(savedDaily));
      }
      if (savedWeekly) {
        setWeeklyMission(JSON.parse(savedWeekly));
      }
    }, 1000); // Sincronizar cada 1 segundo

    return () => clearInterval(interval);
  }, []);

  // Incrementar contador de preguntas respondidas
  const trackQuestionAnswered = () => {
    console.log('🎯 Mission tracking: question answered');
    const saved = localStorage.getItem('dailyMissions');
    if (saved) {
      const missions = JSON.parse(saved);
      const newProgress = missions.questions_answered.progress + 1;
      
      missions.questions_answered = {
        ...missions.questions_answered,
        progress: newProgress,
        completed: newProgress >= missions.questions_answered.target
      };
      
      console.log(`📊 Preguntas respondidas: ${missions.questions_answered.progress}/${missions.questions_answered.target}`);
      localStorage.setItem('dailyMissions', JSON.stringify(missions));
      setDailyMissions(missions);
    }
  };

  // Verificar racha activa
  const trackStreakCheck = (streak) => {
    console.log('🔥 Mission tracking: streak active -', streak);
    const saved = localStorage.getItem('dailyMissions');
    if (saved) {
      const missions = JSON.parse(saved);
      missions.streak_active = {
        ...missions.streak_active,
        progress: streak >= 1 ? 1 : 0,
        completed: streak >= 1
      };
      
      console.log(`🔥 Racha: ${missions.streak_active.progress}/${missions.streak_active.target} (completada: ${missions.streak_active.completed})`);
      localStorage.setItem('dailyMissions', JSON.stringify(missions));
      setDailyMissions(missions);
    }
  };

  // Incrementar respuestas rápidas (<10s)
  const trackFastAnswer = () => {
    console.log('⚡ Mission tracking: fast response detected');
    const saved = localStorage.getItem('dailyMissions');
    if (saved) {
      const missions = JSON.parse(saved);
      const newProgress = missions.fast_answers.progress + 1;
      
      missions.fast_answers = {
        ...missions.fast_answers,
        progress: newProgress,
        completed: newProgress >= missions.fast_answers.target
      };
      
      console.log(`⚡ Respuestas rápidas: ${missions.fast_answers.progress}/${missions.fast_answers.target}`);
      localStorage.setItem('dailyMissions', JSON.stringify(missions));
      setDailyMissions(missions);
    }
  };

  // Incrementar niveles perfectos (3 estrellas = 100% correctas)
  const trackPerfectLevel = () => {
    console.log('🏆 Mission tracking: perfect level completed');
    const saved = localStorage.getItem('weeklyMission');
    if (saved) {
      const mission = JSON.parse(saved);
      const newProgress = mission.perfect_levels.progress + 1;
      
      mission.perfect_levels = {
        ...mission.perfect_levels,
        progress: newProgress,
        completed: newProgress >= mission.perfect_levels.target
      };
      
      console.log(`🏆 Niveles perfectos: ${mission.perfect_levels.progress}/${mission.perfect_levels.target}`);
      localStorage.setItem('weeklyMission', JSON.stringify(mission));
      setWeeklyMission(mission);
    }
  };

  // Reclamar recompensa
  const claimReward = (missionType, missionKey) => {
    console.log(`🎁 Claiming reward: ${missionType}/${missionKey}`);
    
    if (missionType === 'daily') {
      const saved = localStorage.getItem('dailyMissions');
      if (saved) {
        const missions = JSON.parse(saved);
        missions[missionKey] = {
          ...missions[missionKey],
          claimed: true
        };
        localStorage.setItem('dailyMissions', JSON.stringify(missions));
        setDailyMissions(missions);
        
        // Award MediCoins for claiming mission
        const savedCoins = localStorage.getItem('mediCoins');
        const currentCoins = savedCoins ? parseInt(savedCoins, 10) : 0;
        localStorage.setItem('mediCoins', (currentCoins + 200).toString());
        console.log('💰 +200 MediCoins por misión reclamada');
      }
    } else if (missionType === 'weekly') {
      const saved = localStorage.getItem('weeklyMission');
      if (saved) {
        const mission = JSON.parse(saved);
        mission[missionKey] = {
          ...mission[missionKey],
          claimed: true
        };
        localStorage.setItem('weeklyMission', JSON.stringify(mission));
        setWeeklyMission(mission);
        
        // Award MediCoins for claiming weekly mission
        const savedCoins = localStorage.getItem('mediCoins');
        const currentCoins = savedCoins ? parseInt(savedCoins, 10) : 0;
        localStorage.setItem('mediCoins', (currentCoins + 200).toString());
        console.log('💰 +200 MediCoins por misión semanal reclamada');
      }
    }
  };

  // Contar misiones completadas no reclamadas
  const getCompletedNotClaimed = () => {
    let count = 0;
    Object.values(dailyMissions).forEach(mission => {
      if (mission.completed && !mission.claimed) count++;
    });
    if (weeklyMission.perfect_levels?.completed && !weeklyMission.perfect_levels?.claimed) count++;
    return count;
  };

  return {
    dailyMissions,
    weeklyMission,
    trackQuestionAnswered,
    trackStreakCheck,
    trackFastAnswer,
    trackPerfectLevel,
    claimReward,
    getCompletedNotClaimed
  };
};
