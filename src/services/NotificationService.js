/**
 * Servicio de Notificaciones Push para Hospital Gest-Tech
 * Gestiona permisos, envío de notificaciones y preferencias del usuario
 */

class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.notificationsEnabled = this.loadPreference();
    this.lastNotificationTime = this.getLastNotificationTime();
  }

  /**
   * Cargar preferencia de notificaciones desde localStorage
   */
  loadPreference() {
    if (!this.isSupported) return false;
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? saved === 'true' : true; // Default: true
  }

  /**
   * Guardar preferencia de notificaciones
   */
  savePreference(enabled) {
    localStorage.setItem('notificationsEnabled', enabled ? 'true' : 'false');
    this.notificationsEnabled = enabled;
  }

  /**
   * Solicitar permiso para notificaciones
   */
  async requestPermission() {
    if (!this.isSupported) {
      console.warn('⚠️ Notificaciones no soportadas en este navegador');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.savePreference(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';
        if (granted) {
          this.savePreference(true);
        }
        return granted;
      } catch (error) {
        console.error('❌ Error solicitando permiso:', error);
        return false;
      }
    }

    return false;
  }

  /**
   * Enviar notificación simple
   */
  notify(title, options = {}) {
    if (!this.isSupported || !this.notificationsEnabled) return;
    if (Notification.permission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        badge: '🏥',
        icon: '/icon-192x192.png', // Puedes agregar tu icono
        ...options,
        tag: options.tag || 'hospital-gest-tech',
      });

      // Click en notificación abre la app
      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.action) {
          options.action();
        }
      };

      // Guardar tiempo de notificación
      this.saveLastNotificationTime(options.type);

      return notification;
    } catch (error) {
      console.error('❌ Error enviando notificación:', error);
    }
  }

  /**
   * 🔥 Notificación de racha en riesgo
   * Se envía si no ha jugado en 20 horas
   */
  notifyStreakAtRisk(streakDays) {
    if (this.shouldThrottle('streak')) return;

    this.notify(`¡Tu racha está en riesgo! 🔥`, {
      body: `No pierdas tu racha de ${streakDays} días. ¡Juega ahora!`,
      tag: 'streak-warning',
      type: 'streak',
      action: () => window.location.hash = '/dashboard',
    });

    console.log(`📢 Notificación racha: ${streakDays} días en riesgo`);
  }

  /**
   * 🎯 Notificación de nueva misión diaria
   * Se envía a las 9:00 AM
   */
  notifyDailyMissionAvailable() {
    if (this.shouldThrottle('mission')) return;

    this.notify(`¡Nueva misión diaria disponible! 🎯`, {
      body: 'Completa tu misión para ganar puntos y mejorar tu rango.',
      tag: 'daily-mission',
      type: 'mission',
      action: () => window.location.hash = '/dashboard',
    });

    console.log('📢 Notificación misión diaria');
  }

  /**
   * 📚 Notificación de progreso de rango
   * Se envía semanalmente
   */
  notifyRankProgress(currentRank, nextRank, modulesRemaining) {
    if (this.shouldThrottle('rank')) return;

    this.notify(`¡Casi lo logras! 📚`, {
      body: `Te quedan ${modulesRemaining} módulos para alcanzar ${nextRank}. ¡Sigue así!`,
      tag: 'rank-progress',
      type: 'rank',
      action: () => window.location.hash = '/dashboard',
    });

    console.log(`📢 Notificación rango: ${modulesRemaining} módulos faltantes`);
  }

  /**
   * ✨ Notificación de logro desbloqueado
   */
  notifyBadgeUnlocked(badgeName, badgeIcon) {
    if (this.shouldThrottle('badge')) return;

    this.notify(`¡Logro desbloqueado! ${badgeIcon}`, {
      body: `Acabas de conseguir: ${badgeName}`,
      tag: 'badge-unlocked',
      type: 'badge',
      action: () => window.location.hash = '/dashboard',
    });

    console.log(`📢 Notificación badge: ${badgeName}`);
  }

  /**
   * 🏆 Notificación de victoria en liga
   */
  notifyLeagueVictory(league) {
    if (this.shouldThrottle('league')) return;

    this.notify(`¡Eres #1 en ${league}! 🏆`, {
      body: 'Ganaste las recompensas semanales. ¡Felicidades!',
      tag: 'league-victory',
      type: 'league',
      action: () => window.location.hash = '/dashboard',
    });

    console.log(`📢 Notificación liga: #1 en ${league}`);
  }

  /**
   * Controlar throttling de notificaciones
   * No enviar más de 1 por tipo en 1 hora
   */
  shouldThrottle(type) {
    const lastTime = parseInt(localStorage.getItem(`lastNotif_${type}`) || '0');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (now - lastTime < oneHour) {
      return true;
    }

    localStorage.setItem(`lastNotif_${type}`, now.toString());
    return false;
  }

  /**
   * Guardar tiempo de última notificación
   */
  saveLastNotificationTime(type = 'general') {
    const key = `lastNotif_${type}`;
    localStorage.setItem(key, Date.now().toString());
  }

  /**
   * Obtener tiempo de última notificación
   */
  getLastNotificationTime(type = 'general') {
    const key = `lastNotif_${type}`;
    return parseInt(localStorage.getItem(key) || '0');
  }

  /**
   * Verificar si se debe notificar por racha en riesgo
   * Compara última sesión con tiempo actual
   */
  checkStreakAtRisk(lastLoginTime, currentStreakDays) {
    if (currentStreakDays === 0) return false;

    const now = Date.now();
    const lastLogin = lastLoginTime || 0;
    const twentyHours = 20 * 60 * 60 * 1000;

    // Si pasaron más de 20 horas desde último login
    if (now - lastLogin > twentyHours) {
      return true;
    }

    return false;
  }

  /**
   * Verificar si es hora de notificar misión diaria (9:00 AM)
   */
  checkDailyMissionTime() {
    const now = new Date();
    const currentHour = now.getHours();
    const lastNotif = this.getLastNotificationTime('mission');
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Si es entre las 9 y 10 AM y no se notificó hoy
    if (currentHour === 9 && lastNotif < today) {
      return true;
    }

    return false;
  }

  /**
   * Verificar si es hora de notificar progreso semanal (cada lunes)
   */
  checkWeeklyProgressTime() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const lastNotif = this.getLastNotificationTime('rank');
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    // Si es lunes y no se notificó esta semana
    if (dayOfWeek === 1 && lastNotif < weekStart.getTime()) {
      return true;
    }

    return false;
  }

  /**
   * Activar/desactivar notificaciones
   */
  toggleNotifications(enable) {
    if (enable) {
      this.requestPermission();
    } else {
      this.savePreference(false);
    }
  }

  /**
   * Obtener estado actual
   */
  getStatus() {
    return {
      isSupported: this.isSupported,
      enabled: this.notificationsEnabled,
      permission: this.isSupported ? Notification.permission : 'denied',
    };
  }
}

// Crear instancia singleton
const notificationService = new NotificationService();

export default notificationService;
