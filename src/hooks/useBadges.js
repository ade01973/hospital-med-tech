import { useState, useEffect, useCallback } from 'react';
import { BADGES_DATABASE } from '../data/BADGES_CONFIG';

const BADGES_KEY = 'badges';

export const useBadges = (userData) => {
  const [badges, setBadges] = useState(null);
  const [newBadge, setNewBadge] = useState(null);
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);

  // Cargar badges del localStorage
  const loadBadges = useCallback(() => {
    const saved = localStorage.getItem(BADGES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Inicializar con todos los badges sin obtener
    return { ...BADGES_DATABASE };
  }, []);

  // Guardar badges en localStorage
  const saveBadges = useCallback((badgesData) => {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badgesData));
    setBadges(badgesData);
  }, []);

  // Inicializar
  useEffect(() => {
    const loaded = loadBadges();
    setBadges(loaded);
  }, [loadBadges]);

  // Desbloquear badge
  const unlockBadge = useCallback((badgeId) => {
    if (!badges) return false;
    
    const badge = badges[badgeId];
    if (!badge || badge.obtained) {
      return false;
    }

    const today = new Date().toISOString().split('T')[0];
    const updatedBadges = {
      ...badges,
      [badgeId]: {
        ...badge,
        obtained: true,
        obtainedDate: today
      }
    };

    saveBadges(updatedBadges);
    setNewBadge(badges[badgeId]);
    setShowBadgeNotification(true);

    return true;
  }, [badges, saveBadges]);

  // Verificar logros después de completar un nivel
  const checkLevelBadges = useCallback((levelId, isCorrect, perfectScore) => {
    if (!badges) return;

    const completedCount = Object.values(userData?.completedLevels || {}).filter(Boolean).length;
    const updatedBadges = { ...badges };
    let badgesUnlocked = [];

    // Primera Victoria
    if (completedCount === 1 && !badges.primera_victoria.obtained) {
      updatedBadges.primera_victoria = { ...badges.primera_victoria, obtained: true, obtainedDate: new Date().toISOString().split('T')[0] };
      badgesUnlocked.push('primera_victoria');
    }

    // Aprendiz Dedicado
    if (completedCount === 5 && !badges.aprendiz_dedicado.obtained) {
      updatedBadges.aprendiz_dedicado = { ...badges.aprendiz_dedicado, obtained: true, obtainedDate: new Date().toISOString().split('T')[0] };
      badgesUnlocked.push('aprendiz_dedicado');
    }

    // Experto en Formación
    if (completedCount === 10 && !badges.experto_formacion.obtained) {
      updatedBadges.experto_formacion = { ...badges.experto_formacion, obtained: true, obtainedDate: new Date().toISOString().split('T')[0] };
      badgesUnlocked.push('experto_formacion');
    }

    // Maestro
    if (completedCount === 22 && !badges.maestro.obtained) {
      updatedBadges.maestro = { ...badges.maestro, obtained: true, obtainedDate: new Date().toISOString().split('T')[0] };
      badgesUnlocked.push('maestro');
    }

    // Perfeccionista
    if (perfectScore && !badges.perfeccionista.obtained) {
      updatedBadges.perfeccionista = { ...badges.perfeccionista, obtained: true, obtainedDate: new Date().toISOString().split('T')[0] };
      badgesUnlocked.push('perfeccionista');
    }

    if (badgesUnlocked.length > 0) {
      saveBadges(updatedBadges);
      // Retornar el primer badge desbloqueado
      return badgesUnlocked[0];
    }

    return null;
  }, [badges, userData, saveBadges]);

  // Verificar streak badges
  const checkStreakBadges = useCallback((streakValue) => {
    if (!badges) return;

    const updatedBadges = { ...badges };
    let badgeUnlocked = null;

    // Racha Legendaria
    if (streakValue >= 10 && !badges.racha_legendaria.obtained) {
      updatedBadges.racha_legendaria = { ...badges.racha_legendaria, obtained: true, obtainedDate: new Date().toISOString().split('T')[0] };
      saveBadges(updatedBadges);
      setNewBadge(updatedBadges.racha_legendaria);
      setShowBadgeNotification(true);
      badgeUnlocked = 'racha_legendaria';
    }

    return badgeUnlocked;
  }, [badges, saveBadges]);

  // Verificar login streak badges
  const checkLoginStreakBadges = useCallback((loginStreakValue) => {
    if (!badges) return;

    const updatedBadges = { ...badges };
    let badgeUnlocked = null;

    // Semana Perfecta
    if (loginStreakValue === 7 && !badges.semana_perfecta.obtained) {
      updatedBadges.semana_perfecta = { ...badges.semana_perfecta, obtained: true, obtainedDate: new Date().toISOString().split('T')[0] };
      saveBadges(updatedBadges);
      setNewBadge(updatedBadges.semana_perfecta);
      setShowBadgeNotification(true);
      badgeUnlocked = 'semana_perfecta';
    }

    // Mes Completo
    if (loginStreakValue === 30 && !badges.mes_completo.obtained) {
      updatedBadges.mes_completo = { ...badges.mes_completo, obtained: true, obtainedDate: new Date().toISOString().split('T')[0] };
      saveBadges(updatedBadges);
      setNewBadge(updatedBadges.mes_completo);
      setShowBadgeNotification(true);
      badgeUnlocked = 'mes_completo';
    }

    // Inquebrantable
    if (loginStreakValue === 100 && !badges.inquebrantable.obtained) {
      updatedBadges.inquebrantable = { ...badges.inquebrantable, obtained: true, obtainedDate: new Date().toISOString().split('T')[0] };
      saveBadges(updatedBadges);
      setNewBadge(updatedBadges.inquebrantable);
      setShowBadgeNotification(true);
      badgeUnlocked = 'inquebrantable';
    }

    return badgeUnlocked;
  }, [badges, saveBadges]);

  // Verificar rank badge (VIP)
  const checkRankBadges = useCallback((currentRank) => {
    if (!badges) return;

    const updatedBadges = { ...badges };
    let badgeUnlocked = null;

    // VIP - Ministra de Sanidad
    if (currentRank === 'Ministra de Sanidad' && !badges.vip.obtained) {
      updatedBadges.vip = { ...badges.vip, obtained: true, obtainedDate: new Date().toISOString().split('T')[0] };
      saveBadges(updatedBadges);
      setNewBadge(updatedBadges.vip);
      setShowBadgeNotification(true);
      badgeUnlocked = 'vip';
    }

    return badgeUnlocked;
  }, [badges, saveBadges]);

  // Obtener badges obtenidos
  const getObtainedBadges = useCallback(() => {
    if (!badges) return [];
    return Object.values(badges).filter(b => b.obtained).sort((a, b) => {
      if (!a.obtainedDate || !b.obtainedDate) return 0;
      return new Date(b.obtainedDate) - new Date(a.obtainedDate);
    });
  }, [badges]);

  // Obtener badges bloqueados
  const getLockedBadges = useCallback(() => {
    if (!badges) return [];
    return Object.values(badges).filter(b => !b.obtained);
  }, [badges]);

  // Contar badges obtenidos
  const getObtainedCount = useCallback(() => {
    if (!badges) return 0;
    return Object.values(badges).filter(b => b.obtained).length;
  }, [badges]);

  // Obtener últimos 3 badges
  const getRecentBadges = useCallback(() => {
    return getObtainedBadges().slice(0, 3);
  }, [getObtainedBadges]);

  return {
    badges,
    newBadge,
    showBadgeNotification,
    setShowBadgeNotification,
    unlockBadge,
    checkLevelBadges,
    checkStreakBadges,
    checkLoginStreakBadges,
    checkRankBadges,
    getObtainedBadges,
    getLockedBadges,
    getObtainedCount,
    getRecentBadges
  };
};
