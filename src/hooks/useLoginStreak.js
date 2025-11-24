import { useState, useEffect, useCallback } from 'react';

const LOGIN_CALENDAR_KEY = 'dailyCalendar';

// Definiciones de recompensas por día
export const DAILY_REWARDS = {
  1: { xp: 50, powerUps: 0, badge: null },
  2: { xp: 75, powerUps: 0, badge: null },
  3: { xp: 100, powerUps: 0, badge: null },
  4: { xp: 125, powerUps: 0, badge: null },
  5: { xp: 150, powerUps: 1, badge: null },
  6: { xp: 175, powerUps: 0, badge: null },
  7: { xp: 200, powerUps: 0, badge: { id: 'weekly', title: 'Dedicación Semanal', emoji: '🏆' } },
  8: { xp: 225, powerUps: 0, badge: null },
  9: { xp: 250, powerUps: 0, badge: null },
  10: { xp: 275, powerUps: 0, badge: null },
  11: { xp: 300, powerUps: 0, badge: null },
  12: { xp: 325, powerUps: 0, badge: null },
  13: { xp: 350, powerUps: 0, badge: null },
  14: { xp: 400, powerUps: 2, badge: { id: 'biweekly', title: 'Consistencia Extrema', emoji: '🎯' } },
  15: { xp: 425, powerUps: 0, badge: null },
  16: { xp: 450, powerUps: 0, badge: null },
  17: { xp: 475, powerUps: 0, badge: null },
  18: { xp: 500, powerUps: 0, badge: null },
  19: { xp: 525, powerUps: 0, badge: null },
  20: { xp: 550, powerUps: 0, badge: null },
  21: { xp: 600, powerUps: 0, badge: { id: 'constant', title: 'Estudiante Constante', emoji: '⭐' } },
  22: { xp: 625, powerUps: 0, badge: null },
  23: { xp: 650, powerUps: 0, badge: null },
  24: { xp: 675, powerUps: 0, badge: null },
  25: { xp: 700, powerUps: 0, badge: null },
  26: { xp: 725, powerUps: 0, badge: null },
  27: { xp: 750, powerUps: 0, badge: null },
  28: { xp: 800, powerUps: 0, badge: null },
  29: { xp: 900, powerUps: 0, badge: null },
  30: { xp: 1000, powerUps: 3, badge: { id: 'mastery', title: 'Maestría Mensual', emoji: '👑' } }
};

export const useLoginStreak = () => {
  const [calendarData, setCalendarData] = useState(null);
  const [currentStreakDay, setCurrentStreakDay] = useState(0);
  const [claimedToday, setClaimedToday] = useState(false);
  const [rewardNotification, setRewardNotification] = useState(null);

  // Cargar datos del calendario desde localStorage
  const loadCalendarData = () => {
    const saved = localStorage.getItem(LOGIN_CALENDAR_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      loginDays: [],
      currentStreak: 0,
      lastLoginDate: null,
      badgesEarned: [],
      monthYear: getMonthYearKey()
    };
  };

  // Obtener clave del mes/año actual
  const getMonthYearKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // Obtener fecha actual como string (YYYY-MM-DD)
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Calcular racha
  const calculateStreak = (loginDays) => {
    if (loginDays.length === 0) return 0;

    const today = new Date();
    const sortedDays = loginDays.map(d => new Date(d)).sort((a, b) => b - a);
    
    let streak = 0;
    let currentDate = new Date(today);
    currentDate.setHours(0, 0, 0, 0);

    for (const loginDate of sortedDays) {
      loginDate.setHours(0, 0, 0, 0);
      const dayDiff = (currentDate - loginDate) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // Verificar si perdió la racha
  const didStreakBreak = (lastLoginDate) => {
    if (!lastLoginDate) return false;
    
    const lastLogin = new Date(lastLoginDate);
    const today = new Date();
    
    const dayDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));
    return dayDiff > 1;
  };

  // Realizar login y otorgar recompensa
  const processLogin = useCallback((onReward) => {
    const data = loadCalendarData();
    const today = getTodayDateString();
    const currentMonthYear = getMonthYearKey();

    // Si cambió de mes, resetear
    if (data.monthYear !== currentMonthYear) {
      data.loginDays = [];
      data.currentStreak = 0;
      data.monthYear = currentMonthYear;
    }

    // Verificar si ya hizo login hoy
    if (data.loginDays.includes(today)) {
      setClaimedToday(true);
      setCalendarData(data);
      setCurrentStreakDay(data.currentStreak || 1);
      return null;
    }

    // Verificar si perdió la racha
    if (didStreakBreak(data.lastLoginDate)) {
      data.currentStreak = 1;
    } else {
      data.currentStreak = (data.currentStreak || 0) + 1;
    }

    // Asegurar que la racha no exceda 30
    const streakDay = Math.min(data.currentStreak, 30);

    // Agregar login de hoy
    data.loginDays.push(today);
    data.lastLoginDate = today;

    // Obtener recompensa
    const reward = DAILY_REWARDS[streakDay];
    
    // Agregar badge si aplica
    if (reward.badge) {
      const badgeKey = `${reward.badge.id}_${currentMonthYear}`;
      if (!data.badgesEarned.includes(badgeKey)) {
        data.badgesEarned.push(badgeKey);
      }
    }

    // Guardar en localStorage
    localStorage.setItem(LOGIN_CALENDAR_KEY, JSON.stringify(data));

    setCalendarData(data);
    setCurrentStreakDay(streakDay);
    setClaimedToday(true);
    
    // Award GestCoins for daily login
    const savedCoins = localStorage.getItem('gestCoins');
    const currentCoins = savedCoins ? parseInt(savedCoins, 10) : 0;
    localStorage.setItem('gestCoins', (currentCoins + 50).toString());
    console.log('💰 +50 GestCoins por racha diaria');
    
    // Retornar notificación de recompensa
    return {
      day: streakDay,
      reward,
      message: data.currentStreak === 1 && didStreakBreak(data.lastLoginDate) ? 
        'Tu racha se reinició, ¡comienza de nuevo!' : 
        `¡Recompensa del Día ${streakDay} reclamada!`
    };
  }, []);

  // Inicializar en mount
  useEffect(() => {
    const data = loadCalendarData();
    setCalendarData(data);
    setCurrentStreakDay(data.currentStreak || 0);
    
    const today = getTodayDateString();
    setClaimedToday(data.loginDays.includes(today));
  }, []);

  // Obtener días del mes actual
  const getDaysInCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  // Obtener próximas 3 recompensas
  const getUpcomingRewards = () => {
    const upcoming = [];
    for (let i = currentStreakDay + 1; i <= Math.min(currentStreakDay + 3, 30); i++) {
      upcoming.push({
        day: i,
        reward: DAILY_REWARDS[i]
      });
    }
    return upcoming;
  };

  // Obtener badges ganados en este mes
  const getBadgesThisMonth = () => {
    const monthYear = getMonthYearKey();
    return calendarData?.badgesEarned
      ?.filter(b => b.endsWith(monthYear))
      ?.map(badgeKey => {
        for (const day of Object.keys(DAILY_REWARDS)) {
          const reward = DAILY_REWARDS[day];
          if (reward.badge && reward.badge.id === badgeKey.split('_')[0]) {
            return reward.badge;
          }
        }
        return null;
      })
      ?.filter(Boolean) || [];
  };

  return {
    calendarData,
    currentStreakDay,
    claimedToday,
    processLogin,
    getDaysInCurrentMonth,
    getUpcomingRewards,
    getBadgesThisMonth,
    rewardNotification,
    setRewardNotification
  };
};
