import { useState, useEffect } from 'react';
import { BADGES_DATABASE } from '../data/BADGES_CONFIG';

const BADGES_KEY = 'badges';

export const useBadges = (userData) => {
  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem(BADGES_KEY);
    return saved ? JSON.parse(saved) : { ...BADGES_DATABASE };
  });
  const [newBadge, setNewBadge] = useState(null);
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);

  const saveBadges = (badgesData) => {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badgesData));
    setBadges(badgesData);
  };

  const checkLevelBadges = () => {
    if (!badges || !userData) return null;

    const completedCount = Object.values(userData.completedLevels || {}).filter(Boolean).length;
    if (completedCount === 0) return null;

    const updatedBadges = { ...badges };
    let badgeUnlocked = null;

    // Check badges based on completed levels
    const checksToPerform = [
      { count: 1, key: 'primera_victoria', name: 'Primera Victoria' },
      { count: 5, key: 'aprendiz_dedicado', name: 'Aprendiz Dedicado' },
      { count: 10, key: 'experto_formacion', name: 'Experto en Formación' },
      { count: 22, key: 'maestro', name: 'Maestro' }
    ];

    for (const check of checksToPerform) {
      if (completedCount === check.count && !badges[check.key]?.obtained) {
        updatedBadges[check.key] = {
          ...badges[check.key],
          obtained: true,
          obtainedDate: new Date().toISOString().split('T')[0]
        };
        saveBadges(updatedBadges);
        
        const badgeToShow = updatedBadges[check.key];
        console.log(`🔴 setNewBadge EJECUTÁNDOSE CON:`, badgeToShow);
        setNewBadge(badgeToShow);
        
        console.log(`🔴 setShowBadgeNotification(true) EJECUTÁNDOSE AHORA`);
        setShowBadgeNotification(true);
        
        console.log(`✨ Badge desbloqueado: ${check.name}`, badgeToShow);
        
        badgeUnlocked = check.key;
        break;
      }
    }

    console.log(`🔴 checkLevelBadges DEVOLVIENDO:`, badgeUnlocked);
    return badgeUnlocked;
  };

  const getObtainedBadges = () => {
    if (!badges) return [];
    return Object.values(badges)
      .filter(b => b.obtained)
      .sort((a, b) => {
        if (!a.obtainedDate || !b.obtainedDate) return 0;
        return new Date(b.obtainedDate) - new Date(a.obtainedDate);
      });
  };

  const getLockedBadges = () => {
    if (!badges) return [];
    return Object.values(badges).filter(b => !b.obtained);
  };

  const getObtainedCount = () => {
    if (!badges) return 0;
    return Object.values(badges).filter(b => b.obtained).length;
  };

  const getRecentBadges = () => {
    return getObtainedBadges().slice(0, 3);
  };

  const unlockBadge = (badgeId) => {
    if (!badges || badges[badgeId]?.obtained) return false;

    const updatedBadges = {
      ...badges,
      [badgeId]: {
        ...badges[badgeId],
        obtained: true,
        obtainedDate: new Date().toISOString().split('T')[0]
      }
    };

    saveBadges(updatedBadges);
    setNewBadge(updatedBadges[badgeId]);
    setShowBadgeNotification(true);
    return true;
  };

  return {
    badges,
    newBadge,
    showBadgeNotification,
    setShowBadgeNotification,
    unlockBadge,
    checkLevelBadges,
    getObtainedBadges,
    getLockedBadges,
    getObtainedCount,
    getRecentBadges
  };
};
