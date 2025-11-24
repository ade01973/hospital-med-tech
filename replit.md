# NURSE MANAGER - Simulador de Gestión Sanitaria

A gamified learning platform for nursing management education built with React, Firebase, and Tailwind CSS.

## Overview

This is an interactive quiz-based learning application designed for nursing management students. The app features:

- Firebase authentication (anonymous login)
- Real-time Firestore database for progress tracking and leaderboards
- Progressive unlocking system with 22 learning modules
- Exponential XP curve rank progression (2000-80000 points, 2-3 weeks to max level)
- Competitive league system (5 tiers with weekly rankings and rewards)
- Login streak calendar with daily rewards (Day 1-30 with milestone badges)
- Variable point scoring based on response speed
- Streak bonuses and life/heart system (Duolingo-style)
- Daily/Weekly missions with localStorage persistence
- Beautiful animated UI with confetti effects and smooth transitions
- Gamified "hospital tower" interface for quiz levels
- Social sharing for achievements (Twitter, LinkedIn, Facebook, WhatsApp)
- Push notifications for streaks, missions, and rank progress
- 25-badge achievement system with unlock notifications
- Sound effects using Web Audio API

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v3 (with custom animations)
- **Icons**: Lucide React
- **Backend**: Firebase (Auth + Firestore)
- **State**: localStorage for missions, leagues, login streak
- **Build Tool**: Vite
- **Animations**: CSS Keyframes + Custom Tailwind configs

## Project Structure

```
/src/
  /components/
    - Dashboard.jsx (main hub with 5 buttons: Misiones, Ligas, Calendario, Progresión, Recompensas)
    - GameLevel.jsx (quiz interface with timed questions)
    - ShareModal.jsx (NEW: Social sharing for achievements)
    - LoginCalendar.jsx (monthly calendar modal with streak tracking)
    - LoginRewardNotification.jsx (reward notifications)
    - Missions.jsx (daily/weekly mission tracker)
    - Leagues.jsx (competitive league rankings)
    - Rewards.jsx (badges and achievements display)
    - BadgeNotification.jsx (achievement unlock animation)
    - BadgesTab.jsx (badges display in Rewards modal)
    - LeaderBoard.jsx (global rankings)
    - ElevatorDoors.jsx (visual transition animation)
    - ConfettiCelebration.jsx (animated confetti component)
    - AuthScreen.jsx
    - WelcomeScreen.jsx
  /hooks/
    - useMissions.js (mission tracking logic)
    - useLeagues.js (league system with rank-based assignment)
    - useLoginStreak.js (login streak and daily rewards logic)
    - useNotifications.js (push notification management)
    - useBadges.js (badge achievement tracking)
    - useSoundEffects.js (Web Audio API sound generation)
  /services/
    - NotificationService.js (push notification management)
  /data/
    - constants.js (TOPICS, NURSING_RANKS, LEAGUE_SYSTEM, DAILY_REWARDS)
    - BADGES_CONFIG.js (25 badge definitions)
  /assets/
    - elevator-bg.png (background image)
  - App.jsx (main app component with routing)
  - firebase.js (Firebase config)
```

## Recent Changes (November 24, 2025)

### 📱 SOCIAL SHARING SYSTEM (NEW - Implemented)

#### Files Created/Modified
- **`src/components/ShareModal.jsx`** (188 líneas) - Enhanced modal with:
  - 5 sharing platforms: Twitter/X, LinkedIn, Facebook, WhatsApp, Copy Link
  - Web Share API support (native mobile sharing)
  - Dynamic messages based on achievement type
  - Preview of message before sharing
  - Beautiful gradient UI with professional styling

#### Achievement Types
1. **Module Completion** - "¡Completé el módulo..."
2. **Rank Achievement** - "¡Alcancé el rango..."
3. **Weekly Mission** - "¡Completé la misión semanal..."
4. **30-Day Streak** - "¡Llegué a 30 días de racha..."

#### Integration Points
1. **GameLevel.jsx** - ✅ Share button on "MISIÓN CUMPLIDA" screen
2. **Dashboard.jsx** - ✅ Auto-share when:
   - User achieves new rank (3s delay after rank banner)
   - User completes weekly mission
   - User reaches 30-day login streak

#### Features
✅ Web Share API for mobile native sharing  
✅ URL-based sharing for desktop platforms  
✅ Custom messages with stats and hashtags  
✅ Copy to clipboard functionality  
✅ Throttle to prevent spam  
✅ Beautiful animated modal with smooth transitions  

#### Message Format
```
¡[Achievement]! 🏥
Puntuación: [score] pts ⭐
Racha: 🔥 [streak] días
#EnfermeríaDigital #GestiónSanitaria #Gamificación
```

---

## 🔊 SISTEMA DE EFECTOS DE SONIDO (Nov 24 - Implementado)

### Características

**Archivos Creados:**
- `src/hooks/useSoundEffects.js` - Hook completo con Web Audio API

**Sonidos Procedurales (sin archivos externos):**
1. ✅ **Respuesta Correcta** - 3 notas ascendentes (Do-Mi-Sol)
2. ❌ **Respuesta Incorrecta** - Nota grave descendente
3. 🎉 **Módulo Completado** - Fanfarria épica (6 notas)
4. 📍 **Notificaciones** - Sonido corto

**Características:**
- Toggle de sonido en HUD (🔊/🔇)
- Preferencia guardada en localStorage
- Web Audio API generación procedural (sin dependencias externas)
- Volumen controlado y sutiles
- Manejo robusto de errores para compatibilidad

---

## 🎉 SISTEMA DE CONFETI ANIMADO (Nov 24 - Implementado)

### Archivos Creados
- `src/components/ConfettiCelebration.jsx` (97 líneas) - Componente reutilizable de confeti

### Características

**4 Tipos de Celebraciones:**
1. 🏆 **Victoria (Victory)** - Módulo completado exitosamente
2. 🔥 **Racha (Streak)** - 3, 6, 9 respuestas correctas
3. 🎯 **Misión (Mission)** - Misión diaria completada
4. 👑 **Rango (Rank)** - Nuevo rango alcanzado

---

## 🔔 SISTEMA DE NOTIFICACIONES PUSH (Nov 24 - Implementado)

### Archivos Creados
- `src/services/NotificationService.js` (328 líneas) - Servicio completo de notificaciones
- Hook `src/hooks/useNotifications.js` mejorado

### Características

**5 Tipos de Notificaciones:**
1. 🔥 **Racha en Riesgo** - Si no juega en 20 horas
2. 🎯 **Misión Diaria** - Cada día a las 9:00 AM
3. 📚 **Progreso de Rango** - Cada lunes
4. 🏆 **Badge Desbloqueado** - Al conseguir logro
5. 👑 **Victoria en Liga** - Al ganar liga semanal

### Características Técnicas

✅ **Web Push API** - Notificaciones del navegador  
✅ **Permisos Inteligentes** - Pide permiso automáticamente  
✅ **localStorage** - Guarda preferencias del usuario  
✅ **Throttling** - Máx 1 notificación por tipo/hora  
✅ **Timestamps** - Tracking de última notificación  

---

## 🏆 SISTEMA COMPLETO DE BADGES Y LOGROS (Nov 24 - Implementado)

### Archivos Creados

1. **`src/data/BADGES_CONFIG.js`** (218 líneas) - 25 badges en 5 categorías
2. **`src/hooks/useBadges.js`** - Hook completo con lógica de badges
3. **`src/components/BadgesTab.jsx`** - Tab dentro de Rewards modal
4. **`src/components/BadgeNotification.jsx`** - Modal de notificación

### 25 Badges Implementados

#### 1️⃣ PROGRESO (4 badges)
- 🔰 Primera Victoria
- 🎓 Aprendiz Dedicado
- 🎖️ Experto en Formación
- 🏆 Maestro

#### 2️⃣ EXCELENCIA (4 badges)
- ⭐ Perfeccionista
- 🔥 Racha Legendaria
- ⚡ Velocista
- 💡 Genio

#### 3️⃣ DEDICACIÓN (4 badges)
- 📅 Semana Perfecta
- 🌟 Mes Completo
- 🎯 Cazador de Misiones
- 💪 Inquebrantable

#### 4️⃣ COMPETICIÓN (3 badges)
- 🥇 Campeón
- 🥈 Subcampeón
- 🏅 Competidor

#### 5️⃣ ESPECIAL (3 badges)
- 👑 VIP
- 🎉 Fundador
- ✨ Coleccionista

---

## Dashboard Navigation

The dashboard now has 5 interactive buttons in top bar:

1. **🎯 MISIONES** (cyan-blue): Daily/weekly missions tracker
2. **🏆 LIGAS** (purple-pink): Competitive league rankings
3. **📅 CALENDARIO** (cyan-teal): Login streak calendar
4. **🎁 RECOMPENSAS** (yellow-orange): Badges and achievements
5. **⚡ XP Counter**: Display total experience points

Plus **Salir** (Logout) button in top-right

## User Preferences
- Fast development pace
- Exponential XP curve (not linear)
- Competitive elements important (leagues, leaderboards)
- Gamification elements (badges, streaks, ranks)
- Beautiful animations preferred
- Spanish language UI

## Known Limitations
- Anonymous Firebase login (no persistent accounts across devices)
- Mock leaderboard with demo players (for testing)
- No real-time multiplayer (demo only)
- localStorage limited to device (no cloud sync for calendar)

---

**Last Updated**: November 24, 2025  
**Status**: ✅ MVP COMPLETE - Full Gamification System + Social Sharing (Ranks, Leagues, Login Streak, Badges, Sound Effects, Confetti, Notifications, Social Sharing) 🎉🚀📱
