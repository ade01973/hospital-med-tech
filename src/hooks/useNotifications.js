
import { useState, useEffect, useCallback } from 'react';

const useNotifications = () => {
  const [permission, setPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'default'
  );
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved ? JSON.parse(saved) : false;
  });

  // Solicitar permisos
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones');
      return false;
    }

    if (Notification.permission === 'granted') {
      setPermission('granted');
      return true;
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }

    return false;
  }, []);

  // Toggle de notificaciones
  const toggleNotifications = useCallback(async () => {
    if (!enabled) {
      const granted = await requestPermission();
      if (granted) {
        setEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        console.log('✅ Notificaciones activadas');
      }
    } else {
      setEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
      console.log('❌ Notificaciones desactivadas');
    }
  }, [enabled, requestPermission]);

  // Enviar notificación
  const sendNotification = useCallback((title, options = {}) => {
    if (!enabled || permission !== 'granted') {
      console.log('🔕 Notificaciones desactivadas o sin permiso');
      return;
    }

    const notification = new Notification(title, {
      icon: '/generated-icon.png',
      badge: '/generated-icon.png',
      ...options,
    });

    // Al hacer clic, enfocar/abrir la app
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) {
        options.onClick();
      }
    };

    return notification;
  }, [enabled, permission]);

  // Verificar racha en riesgo (20h desde última visita)
  const checkStreakAtRisk = useCallback(() => {
    const lastVisit = localStorage.getItem('lastVisitTimestamp');
    if (!lastVisit) return;

    const now = Date.now();
    const hoursSinceVisit = (now - parseInt(lastVisit, 10)) / (1000 * 60 * 60);

    if (hoursSinceVisit >= 20 && hoursSinceVisit < 24) {
      sendNotification('¡Tu racha está en riesgo! 🔥', {
        body: 'Han pasado 20 horas. ¡No pierdas tu progreso diario!',
        tag: 'streak-risk',
        requireInteraction: true,
      });
    }
  }, [sendNotification]);

  // Verificar si está cerca del siguiente rango
  const checkNearRankUp = useCallback((currentScore, nextRankScore) => {
    if (!currentScore || !nextRankScore) return;

    const remaining = nextRankScore - currentScore;
    const percentToNext = ((currentScore / nextRankScore) * 100);

    // Si está al 85% o más del siguiente rango
    if (percentToNext >= 85 && remaining > 0) {
      sendNotification('¡Casi subes de rango! 📚', {
        body: `Solo te faltan ${remaining} puntos para alcanzar el siguiente nivel.`,
        tag: 'rank-up',
      });
    }
  }, [sendNotification]);

  // Notificación de nueva misión diaria
  const notifyDailyMission = useCallback(() => {
    sendNotification('¡Nueva misión diaria disponible! 🎯', {
      body: 'Completa las misiones de hoy para ganar recompensas exclusivas.',
      tag: 'daily-mission',
    });
  }, [sendNotification]);

  // Actualizar timestamp de última visita
  useEffect(() => {
    localStorage.setItem('lastVisitTimestamp', Date.now().toString());
  }, []);

  // Verificar notificaciones periódicamente
  useEffect(() => {
    if (!enabled) return;

    // Verificar racha en riesgo cada 30 minutos
    const streakInterval = setInterval(() => {
      checkStreakAtRisk();
    }, 30 * 60 * 1000);

    // Verificar si es hora de misión diaria (9:00 AM)
    const checkDailyMission = () => {
      const now = new Date();
      const lastDailyNotif = localStorage.getItem('lastDailyMissionNotif');
      const today = now.toDateString();

      if (now.getHours() === 9 && now.getMinutes() === 0) {
        if (lastDailyNotif !== today) {
          notifyDailyMission();
          localStorage.setItem('lastDailyMissionNotif', today);
        }
      }
    };

    const dailyInterval = setInterval(checkDailyMission, 60 * 1000); // Cada minuto

    return () => {
      clearInterval(streakInterval);
      clearInterval(dailyInterval);
    };
  }, [enabled, checkStreakAtRisk, notifyDailyMission]);

  return {
    permission,
    enabled,
    toggleNotifications,
    sendNotification,
    checkStreakAtRisk,
    checkNearRankUp,
    notifyDailyMission,
  };
};

export default useNotifications;
