import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/NotificationService';

/**
 * Hook mejorado para gestionar notificaciones push
 */
const useNotifications = () => {
  const [enabled, setEnabled] = useState(() => notificationService.notificationsEnabled);
  const [permission, setPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'default'
  );

  const requestPermission = useCallback(async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setPermission('granted');
      setEnabled(true);
    }
    return granted;
  }, []);

  const toggleNotifications = useCallback((enable) => {
    notificationService.toggleNotifications(enable);
    setEnabled(enable);
  }, []);

  const checkStreakAtRisk = useCallback(() => {
    const lastVisit = localStorage.getItem('lastVisitTimestamp');
    const currentStreak = parseInt(localStorage.getItem('userStreak') || '0');
    if (lastVisit && currentStreak > 0) {
      notificationService.checkStreakAtRisk(parseInt(lastVisit), currentStreak);
    }
  }, []);

  const checkNearRankUp = useCallback((currentScore, nextRankScore) => {
    notificationService.checkNearRankUp(currentScore, nextRankScore);
  }, []);

  const notifyBadgeUnlocked = useCallback((badgeName, badgeIcon) => {
    notificationService.notifyBadgeUnlocked(badgeName, badgeIcon);
  }, []);

  const notifyLeagueVictory = useCallback((league) => {
    notificationService.notifyLeagueVictory(league);
  }, []);

  useEffect(() => {
    localStorage.setItem('lastVisitTimestamp', Date.now().toString());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      checkStreakAtRisk();
      if (notificationService.checkDailyMissionTime()) {
        notificationService.notifyDailyMissionAvailable();
      }
      if (notificationService.checkWeeklyProgressTime()) {
        notificationService.notifyRankProgress('Estudiante', 'Enfermera', 5);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [enabled, checkStreakAtRisk]);

  return {
    enabled,
    permission,
    requestPermission,
    toggleNotifications,
    checkStreakAtRisk,
    checkNearRankUp,
    notifyBadgeUnlocked,
    notifyLeagueVictory,
  };
};

export default useNotifications;
