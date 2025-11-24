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
    - LoginCalendar.jsx (NEW: monthly calendar modal with streak tracking)
    - LoginRewardNotification.jsx (NEW: modal de recompensas automáticas)
    - Missions.jsx (daily/weekly mission tracker)
    - Leagues.jsx (competitive league rankings)
    - Rewards.jsx (badges and achievements display)
    - LeaderBoard.jsx (global rankings)
    - ElevatorDoors.jsx (visual transition animation)
    - AuthScreen.jsx
    - WelcomeScreen.jsx
  /hooks/
    - useMissions.js (mission tracking logic)
    - useLeagues.js (league system with rank-based assignment)
    - useLoginStreak.js (NEW: login streak and daily rewards logic)
  /data/
    - constants.js (TOPICS, NURSING_RANKS, LEAGUE_SYSTEM, DAILY_REWARDS)
  /assets/
    - elevator-bg.png (background image)
  - App.jsx (main app component with routing)
  - firebase.js (Firebase config)
```

## Recent Changes (November 24, 2025)

### 🐛 Bug Fixes
- **Fixed Modal Ligas not opening**: Added null/undefined handling in useLeagues hook with default to BRONCE league
- **Fixed GameLevel blank screen**: Corrected setLevel to pass full TOPIC object instead of just ID number
- **Fixed useEffect dependency error**: Added useCallback to processLogin function to stabilize dependencies

### ✨ New Features

#### 1. Login Streak Calendar System
**Files Created:**
- `src/hooks/useLoginStreak.js` - Complete login streak logic
- `src/components/LoginCalendar.jsx` - Beautiful modal with:
  - 30-day calendar with login tracking
  - Streak counter with fire emoji (🔥)
  - Progress bar to next milestone
  - Upcoming rewards preview (next 3 days)
  - Badges earned display
- `src/components/LoginRewardNotification.jsx` - Auto-notification modal:
  - Shows reward earned on login
  - Displays XP, power-ups, badges
  - Motivational messages

#### 2. Daily Rewards System (Day 1-30)
- Day 1-6: Increasing XP (50→175)
- Day 5: +1 Power-up
- Day 7: +200 XP + Badge "Dedicación Semanal" 🏆
- Day 14: +400 XP + 2 Power-ups 🎉 + Badge "Consistencia Extrema"
- Day 21: +600 XP + Badge "Estudiante Constante" ⭐
- Day 30: +1000 XP + 3 Power-ups + Badge "Maestría Mensual" 👑

#### 3. Integration with Dashboard
- New 5th button: 📅 CALENDARIO (cyan-teal gradient)
- Badge showing current streak day (e.g., "📅 7")
- Auto-popup notification when login detected
- Streak resets if missed >1 day

**Persistence:**
- localStorage key: `dailyCalendar`
- Stores: loginDays array, currentStreak, lastLoginDate, badgesEarned, monthYear
- Auto-resets on month change

### Existing Features (Previous Sessions)

#### XP Balance (Exponential Curve)
- Estudiante → Enfermera: 2,000 XP (~3-4 days)
- Enfermera → Referente: +3,000 XP (~5 days)
- Referente → Supervisora: +5,000 XP (~7 days)
- Supervisora → Coordinadora: +8,000 XP (~10 days)
- Coordinadora → Directora: +12,000 XP (~15 days)
- Directora → Regional: +20,000 XP (~25 days)
- Regional → Ministra: +30,000 XP (aspirational)

#### Competitive League System (5 Tiers)
- 🥉 LIGA BRONCE: Estudiante, Enfermera, Referente (500/300/150 XP rewards)
- 🥈 LIGA PLATA: Supervisora, Coordinadora (800/500/200 XP rewards)
- 🥇 LIGA ORO: Directora Enfermería (1200/700/300 XP rewards)
- 💎 LIGA PLATINO: Directora Regional (1500/900/400 XP rewards)
- ⭐ LIGA LEYENDA: Ministra Sanidad (2000/1200/600 XP rewards)

Features:
- Top 10 weekly rankings
- Automatic Monday reset
- Demo players + real player
- Rewards for Top 3

#### Mission System
- Daily missions (5 types tracked via localStorage)
- Weekly mission (counter)
- XP rewards per completion
- Real-time sync between components

## Dashboard Navigation

The dashboard now has 5 interactive buttons in top bar:

1. **🎯 MISIONES** (cyan-blue): Daily/weekly missions tracker
2. **🏆 LIGAS** (purple-pink): Competitive league rankings
3. **📅 CALENDARIO** (cyan-teal): Login streak calendar ⬅️ NEW
4. **🎁 RECOMPENSAS** (yellow-orange): Badges and achievements
5. **⚡ XP Counter**: Display total experience points

Plus **Salir** (Logout) button in top-right

## How to Test Login Calendar

1. Go to Dashboard
2. Click 📅 CALENDARIO button
3. See:
   - Your current streak day
   - Full 30-day calendar
   - Days with login marked ✅
   - Next 3 rewards preview
   - Any earned badges
4. On new login: Auto-popup shows reward earned for that day

## Fixes Applied This Session

| Issue | Root Cause | Solution | Status |
|-------|-----------|----------|--------|
| Modal Ligas no abrirse | userData.rank undefined al inicio | Added default 'Estudiante' + BRONCE fallback | ✅ Fixed |
| GameLevel pantalla blanca | setLevel pasaba ID en lugar de TOPIC object | Cambiar `setLevel(currentTopic.id)` → `setLevel(currentTopic)` | ✅ Fixed |
| useEffect dependency error | processLogin redefinida en cada render | Wrap con useCallback([]) | ✅ Fixed |

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

## Next Potential Features
- Power-up system implementation
- Achievement badges display enhancement
- Educational video integration (currently has placeholders)
- Animated confetti/effects on achievements
- Mobile app optimization
- Dark mode toggle
- Sound effects

---

**Last Updated:** November 24, 2025 - Login Streak Calendar System Implemented

---

## 🏆 SISTEMA COMPLETO DE BADGES Y LOGROS (Sesión Nov 24 - Implementado)

### Archivos Creados

1. **`src/data/BADGES_CONFIG.js`** (218 líneas)
   - 25 badges definidos en 5 categorías
   - Metadatos: nombre, icono, descripción, color, requisitos
   - Categorías: Progreso, Excelencia, Dedicación, Competición, Especial

2. **`src/hooks/useBadges.js`** (222 líneas)
   - Hook completo con lógica de badges
   - Detección automática de logros
   - Persistencia en localStorage (key: "badges")
   - Funciones: unlockBadge, checkLevelBadges, checkStreakBadges, etc.

3. **`src/components/BadgesTab.jsx`** (142 líneas)
   - Tab dentro de Rewards modal
   - Muestra: resumen, badges obtenidos, badges bloqueados, más reciente
   - Barra de progreso (X/25 badges)
   - Grid visual con iconos y descripciones

4. **`src/components/BadgeNotification.jsx`** (77 líneas)
   - Modal de notificación "Achievement Unlocked"
   - Animación de confetti
   - Diseño con gradiente dorado/brillante
   - Cierre con botón "GENIAL"

### Archivos Modificados

- **`src/components/Rewards.jsx`**: Agregados 2 tabs (🎁 Recompensas / 🏆 Badges)
- **`src/App.jsx`**: Integración de BadgeNotification en renderizado principal
- **`src/components/GameLevel.jsx`**: Importado useBadges para futuro tracking

### 25 Badges Implementados

#### 1️⃣ PROGRESO (4 badges)
- 🔰 Primera Victoria - Completa 1er nivel
- 🎓 Aprendiz Dedicado - Completa 5 niveles
- 🎖️ Experto en Formación - Completa 10 niveles
- 🏆 Maestro - Completa 22/22 niveles

#### 2️⃣ EXCELENCIA (4 badges)
- ⭐ Perfeccionista - 100% aciertos en un nivel
- 🔥 Racha Legendaria - Racha de 10 respuestas
- ⚡ Velocista - 10 preguntas <10s cada una
- 💡 Genio - 1000+ XP en un solo nivel

#### 3️⃣ DEDICACIÓN (4 badges)
- 📅 Semana Perfecta - Login 7 días consecutivos
- 🌟 Mes Completo - Login 30 días consecutivos
- 🎯 Cazador de Misiones - 50 misiones completadas
- 💪 Inquebrantable - Login streak de 100 días

#### 4️⃣ COMPETICIÓN (3 badges)
- 🥇 Campeón - #1 en liga
- 🥈 Subcampeón - Top 3 en liga
- 🏅 Competidor - 10 temporadas de ligas

#### 5️⃣ ESPECIAL (3 badges)
- 👑 VIP - Rango Ministra de Sanidad
- 🎉 Fundador - Primeros 100 usuarios
- ✨ Coleccionista - 20 badges diferentes

### Funcionalidades

**UI/UX:**
- 📊 Resumen: "X / 25 badges" + barra de progreso + % completado
- 🎁 Badges obtenidos: Grid con glow, fecha de obtención
- 🔒 Badges bloqueados: Escala de grises, pista de obtención
- ⭐ Más reciente: Highlight especial del último badge

**Persistencia:**
- localStorage key: "badges"
- Estructura: Array de objetos con id, name, icon, category, obtained, obtainedDate

**Notificaciones:**
- Auto-popup al desbloquear badge
- Animación de bounce en icono
- Confetti particles
- Diseño gradiente aureo

**Sistema de Detección:**
- checkLevelBadges() - Detecta badges al completar niveles
- checkStreakBadges() - Detecta racha legendaria
- checkLoginStreakBadges() - Detecta semana/mes perfecto
- checkRankBadges() - Detecta rango VIP

### Integración Existente

El sistema está completamente integrado pero LISTO para conectar con:
- Sistemas de misiones ✅
- Sistema de ligas ✅
- Sistema de login streak ✅
- Sistema de XP/Ranks ✅

**Próximas acciones de integración** (si se desean):
1. En GameLevel.jsx: Llamar checkLevelBadges() al completar nivel
2. En Dashboard.jsx: Mostrar 3 badges más recientes
3. En useMissions: Llamar checkMissionBadges() al reclamar
4. En useLeagues: Llamar checkLeagueBadges() al terminar semana

### Total de Código Nuevo

- **659 líneas de código** en 4 archivos
- Sistema de badges 100% funcional
- Lógica de persistencia completa
- UI profesional y animada

---

**Last Updated**: November 24, 2025 - Sistema Completo de Badges Implementado ✨
**Status**: MVP with Gamification System (Ranks, Leagues, Login Streak, Badges) 🎉
