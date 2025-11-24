import { useState, useEffect } from 'react';

export const useMissions = () => {
  const [dailyMissions, setDailyMissions] = useState({
    questions_answered: { progress: 0, target: 10, completed: false, claimed: false, reward: 300 },
    streak_active: { progress: 0, target: 1, completed: false, claimed: false, reward: 200 },
    fast_answers: { progress: 0, target: 5, completed: false, claimed: false, reward: 'powerup' }
  });

  const [weeklyMission, setWeeklyMission] = useState({
    perfect_levels: { progress: 0, target: 3, completed: false, claimed: false, reward: 1500, badge: 'Estudiante Dedicado' }
  });

  // Inicializar desde localStorage al cargar
  useEffect(() => {
    const checkAndResetMissions = () => {
      const lastReset = localStorage.getItem('lastMissionReset');
      const now = new Date();
      const today = now.toDateString();

      // Reset diario cada 24h
      if (lastReset !== today) {
        localStorage.setItem('lastMissionReset', today);
        localStorage.removeItem('dailyMissions');
        setDailyMissions({
          questions_answered: { progress: 0, target: 10, completed: false, claimed: false, reward: 300 },
          streak_active: { progress: 0, target: 1, completed: false, claimed: false, reward: 200 },
          fast_answers: { progress: 0, target: 5, completed: false, claimed: false, reward: 'powerup' }
        });
      } else {
        // Cargar misiones guardadas del día
        const saved = localStorage.getItem('dailyMissions');
        if (saved) {
          setDailyMissions(JSON.parse(saved));
        }
      }

      // Reset semanal cada lunes
      const lastWeeklyReset = localStorage.getItem('lastWeeklyReset');
      if (now.getDay() === 1) { // Monday
        if (lastWeeklyReset !== today) {
          localStorage.setItem('lastWeeklyReset', today);
          localStorage.removeItem('weeklyMission');
          setWeeklyMission({
            perfect_levels: { progress: 0, target: 3, completed: false, claimed: false, reward: 1500, badge: 'Estudiante Dedicado' }
          });
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
        }
      }
    };

    checkAndResetMissions();
  }, []);

  // Guardar misiones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('dailyMissions', JSON.stringify(dailyMissions));
  }, [dailyMissions]);

  useEffect(() => {
    localStorage.setItem('weeklyMission', JSON.stringify(weeklyMission));
  }, [weeklyMission]);

  // Incrementar contador de preguntas respondidas
  const trackQuestionAnswered = () => {
    setDailyMissions(prev => {
      const updated = { ...prev };
      const newProgress = updated.questions_answered.progress + 1;
      
      return {
        ...updated,
        questions_answered: {
          ...updated.questions_answered,
          progress: newProgress,
          completed: newProgress >= updated.questions_answered.target
        }
      };
    });
  };

  // Verificar racha activa
  const trackStreakCheck = (streak) => {
    setDailyMissions(prev => ({
      ...prev,
      streak_active: {
        ...prev.streak_active,
        progress: streak >= 1 ? 1 : 0,
        completed: streak >= 1
      }
    }));
  };

  // Incrementar respuestas rápidas (<10s)
  const trackFastAnswer = () => {
    setDailyMissions(prev => {
      const updated = { ...prev };
      const newProgress = updated.fast_answers.progress + 1;
      
      return {
        ...updated,
        fast_answers: {
          ...updated.fast_answers,
          progress: newProgress,
          completed: newProgress >= updated.fast_answers.target
        }
      };
    });
  };

  // Incrementar niveles perfectos (3 estrellas = 100% correctas)
  const trackPerfectLevel = () => {
    setWeeklyMission(prev => {
      const updated = { ...prev };
      const newProgress = updated.perfect_levels.progress + 1;
      
      return {
        ...updated,
        perfect_levels: {
          ...updated.perfect_levels,
          progress: newProgress,
          completed: newProgress >= updated.perfect_levels.target
        }
      };
    });
  };

  // Reclamar recompensa
  const claimReward = (missionType, missionKey) => {
    if (missionType === 'daily') {
      setDailyMissions(prev => ({
        ...prev,
        [missionKey]: {
          ...prev[missionKey],
          claimed: true
        }
      }));
    } else if (missionType === 'weekly') {
      setWeeklyMission(prev => ({
        ...prev,
        [missionKey]: {
          ...prev[missionKey],
          claimed: true
        }
      }));
    }
  };

  // Contar misiones completadas no reclamadas
  const getCompletedNotClaimed = () => {
    let count = 0;
    Object.values(dailyMissions).forEach(mission => {
      if (mission.completed && !mission.claimed) count++;
    });
    if (weeklyMission.perfect_levels.completed && !weeklyMission.perfect_levels.claimed) count++;
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
