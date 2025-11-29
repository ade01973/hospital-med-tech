# NURSE MANAGER - Simulador de Gestión Sanitaria

### Overview
NURSE MANAGER is a gamified learning platform designed to provide an interactive, quiz-based educational experience for nursing management students. The project aims to create a highly engaging application with significant market potential by integrating robust gamification and social features to enhance learning outcomes and user retention. Key capabilities include interactive quizzes with progressive module unlocking, an advanced gamification system encompassing XP, ranks, leagues, achievements, real-time progress tracking, leaderboards, daily rewards, social sharing, and a visually animated user interface.

### User Preferences
- Fast development pace
- Exponential XP curve (not linear)
- Competitive elements important (leagues, leaderboards)
- Gamification elements (badges, streaks, ranks)
- Beautiful animations preferred
- Spanish language UI

### System Architecture
The application employs a modern web stack to deliver an interactive and gamified user experience.

#### UI/UX Decisions
- A gamified "hospital tower" interface serves as the central hub for quiz levels and navigation.
- The UI features extensive animations, including confetti effects, smooth transitions, elevator door animations, and responsive elements.
- A custom avatar creation system allows for gender selection, various silhouettes, skin tones, and planned incremental customization options.
- Sound effects are procedurally generated via the Web Audio API for an immersive experience.
- Gradient designs are utilized for modals, such as the ShareModal.

#### Technical Implementations
- **Frontend**: React 19 with Vite for development.
- **Styling**: Tailwind CSS v3 with custom animations.
- **State Management**: `localStorage` for persisting missions, leagues, and login streaks.
- **Authentication**: Firebase anonymous login.
- **Database**: Real-time Firestore for user progress, leaderboards, and game data.
- **Gamification Core**:
    - **Progressive Unlocking**: 22 sequential learning modules.
    - **XP and Rank System**: Exponential XP curve with 2000-80000 points.
    - **League System**: 5 competitive tiers with weekly rankings and rewards.
    - **Login Streaks**: Daily rewards calendar with milestone badges.
    - **Variable Scoring**: Points based on response speed, streak bonuses, and a life/heart system.
    - **Missions**: Daily/Weekly missions with local persistence.
    - **Achievements**: 25-badge system across 5 categories with unlock notifications.
- **Notifications**: Web Push API for streaks, missions, rank progress, and badge achievements.
- **Sound System**: Web Audio API for procedural sound effects, with toggle and preference saving. Background music plays during avatar creation and on the Dashboard.
- **Social Sharing**: Integration for platforms like Twitter/X, LinkedIn, Facebook, WhatsApp, and copy link, supporting Web Share API.
- **Daily Streak System**: Tracks consecutive playing days with localStorage persistence, auto-reset, freeze mechanics, and milestone badges (7, 30, 100 days). Includes a warning system for low time remaining.
- **Leaderboards**: Implements Global (top 50 with 5 tiers), Friend (1v1 comparison), and Weekly (resets Monday) leaderboards, all with local persistence and animations.
- **Team Challenges**: Supports team formation (2-4 players), cooperative quests with varying difficulties, and boss battles (e.g., Zombi Hospitalario, Demonio de Datos, Dragón Administrativo) featuring shared health pools and scaling rewards.

#### System Design Choices
- **Gamified Progression**: Focus on an exponential XP curve, competitive leagues, and diverse gamification elements.
- **Responsive and Animated UI**: Emphasizes smooth transitions, custom animations, and a dynamic user interface.
- **Modular Component Design**: Utilizes reusable React components and custom hooks for managing logic and UI elements.
- **Local and Cloud Persistence**: Combines `localStorage` for transient data (streaks, missions) with Firestore for core game data and user progress.

### External Dependencies
- **Firebase**: Authentication (anonymous login) and Firestore (real-time database).
- **React 19**: Frontend library.
- **Vite**: Build tool.
- **Tailwind CSS v3**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **Web Audio API**: For procedural sound generation.
- **Web Share API**: For native mobile social sharing.
- **Web Push API**: For browser push notifications.
---

## Update #3: CAREER PROGRESSION MODAL - COMPLETED (November 29, 2025)

### 📈 Professional Career Roadmap Visualization

#### New Component: CareerProgressionModal.jsx
- **Visual Timeline**: Shows all 8 nursing tiers from Estudiante to Gerenta
- **Current Position**: Highlights user's current rank with progress bar
- **Progress Tracking**: XP required to reach next tier + percentage progress
- **"Casi Perfecto" Indicator**: Shows warning for top 3 tiers
- **Career Path**: All 8 tiers displayed with status (AQUÍ • COMPLETADO • Bloqueado)

#### Dashboard Integration:
- **New Button**: Cyan-Blue gradient icon (📈 TrendingUp) positioned in top toolbar
- Location: Between "Desafíos en Equipo" (👥) and "Ligas" (👑) buttons
- **Title**: "Carrera Profesional"
- Smooth animations and hover effects

#### Features:
✅ Visual ranking of all 8 nursing positions
✅ Real-time progress calculation
✅ XP deficit display for next tier
✅ "Casi perfecto" requirement warning for tiers 6, 7, 8
✅ Status indicators (Aquí • Completado • Bloqueado)
✅ Professional medical career aesthetic
✅ Mobile responsive design

#### Top 3 Tiers Requirements:
- **Subdirectora de Enfermeria** (35,000 XP) - "Casi perfecto" required
- **Directora de Enfermeria** (65,000 XP) - "Casi perfecto" required
- **Gerenta** (100,000 XP) - "Casi perfecto" required ⚡

#### Data Flow:
- Receives `currentScore` and `playerName` as props from Dashboard
- Calculates current tier based on NURSING_RANKS minScore thresholds
- Computes XP needed for progression
- Displays visual progress bars with smooth animations

#### CSS Classes Used:
- `animate-pulse`: For "AQUÍ" status indicator
- Gradient backgrounds matching tier colors
- Ring effect for current position highlighting

#### Status:
✅ Component fully functional
✅ Integrated into Dashboard
✅ Button visible in top toolbar
✅ No console errors
✅ Server running without issues
✅ Animations working smoothly

---

## FINAL SUMMARY: COMPLETE NURSING CAREER SYSTEM

### 🎯 What Was Delivered:

**1. 8 Professional Nursing Tiers** (NURSING_RANKS)
- Estudiante → Enfermera → Enfermera Referente → Jefa de Unidad → Jefa de Área → Subdirectora → Directora → Gerenta
- Cyan-Blue gradient colors for all tiers
- Exponential XP curve (0 → 100,000 XP)

**2. Career Progression Dashboard** (CareerProgressionModal)
- Visual timeline of all 8 positions
- Current position highlighting with progress bar
- XP requirements and "casi perfecto" warnings
- Professional medical career aesthetics

**3. Dashboard Enhancement**
- New button in top toolbar for Career Progression
- Cyan-blue gradient icon matching professional theme
- Integrated with existing gamification systems

**4. Gamification Integration**
- League System updated with new tier names
- Leaderboards compatible with 8-tier system
- Team Challenges ready for new tiers
- All systems synchronized

### 📊 Implementation Metrics:
- **Files Created**: 1 new component (CareerProgressionModal.jsx)
- **Files Modified**: 3 (Dashboard.jsx, constants.js, replit.md)
- **Buttons Added**: 1 (Career Progression button in toolbar)
- **Tiers Total**: 8 professional nursing positions
- **XP Threshold**: 0 → 100,000 exponential curve
- **Animations**: Pulse effects, progress bars, smooth transitions

### ✅ All Requirements Met:
✅ 8 nursing tiers visible in dashboard progression section
✅ Career ladder shows current position clearly
✅ Visual indication of what's needed to reach top
✅ Top 3 escalones require "casi perfecto" (high difficulty)
✅ Button icon added to top toolbar (cyan-blue gradient)
✅ Modal opens with complete career roadmap
✅ No console errors
✅ Server running smoothly
✅ All systems integrated and tested

### 🚀 Ready For:
- Publishing/Deployment
- Extended gameplay testing
- User feedback collection
- Future feature expansion

---

## Update #4: TEAM QUEST MINI-QUIZZES - COMPLETED (November 29, 2025)

### 🎯 Real Quiz Implementation in Team Quests

#### New Features: TeamQuest.jsx
✅ **Real Quiz Mechanics**:
- Uses actual questions from TOPICS[selectedTopic].questions
- Random question selection per difficulty
- 2-option rapid mode (5-second timer per question)
- Health-based gameplay system

✅ **Question Mechanics**:
- **Correct Answer**: +10 team health (max 100)
- **Incorrect/Timeout**: -5 team health
- **Win Condition**: Complete all questions without health reaching 0
- **Loss Condition**: Team health drops to 0 at any point

✅ **Difficulty Settings**:
- **Fácil**: 8 questions, 1x XP, 1x coins
- **Normal**: 10 questions, 1x XP, 1.5x coins
- **Difícil**: 12 questions, 1x XP, 2x coins

✅ **Visual Elements**:
- 5-second countdown timer (turns red at ≤2 seconds)
- Color-coded health bar:
  - 🟢 Green (50-100 HP)
  - 🟡 Yellow (20-50 HP)
  - 🔴 Red (0-20 HP)
- Question counter (e.g., "3/10")
- Team members display
- Animated transitions between questions

✅ **Game States**:
- **Menu**: Select difficulty (Fácil/Normal/Difícil)
- **Playing**: Answering questions with timer
- **Completed**: Victory screen with XP + coin rewards
- **Failed**: Defeat screen with stats

#### Integration: TeamChallenges.jsx
- Added topic selector dropdown (all 22 TOPICS available)
- Passes selectedTopic to TeamQuest component
- Seamless topic switching before quest start
- Professional styled select element

#### Rewards System
- **Base Reward**: 200 XP per completed quest
- **Coin Multiplier**:
  - Fácil: 100 coins
  - Normal: 150 coins
  - Difícil: 200 coins

#### User Experience
- ⏱️ Real-time 5-second timer with visual feedback
- 🎨 Color transitions for health status
- 🏆 Victory/defeat modals with detailed stats
- 📊 Clear progress tracking (questions answered/total)
- 🔄 Ability to retry failed quests or try different difficulties

#### Technical Implementation
- State Management: currentQuestion, teamHealth, timeLeft, questQuestions
- Logic: Random question selection, damage calculation, win/lose conditions
- Rendering: Real-time timer, health bar, question display, option buttons
- Callbacks: onQuestStart, onQuestComplete for integration with Dashboard

#### Status:
✅ All 3 difficulties fully functional
✅ Real quiz questions from TOPICS
✅ Timer system working (5-second countdown)
✅ Health system with visual feedback
✅ Victory/defeat modals implemented
✅ Team selection integrated
✅ Topic selection added to TeamChallenges
✅ No console errors
✅ Server running smoothly
✅ Ready for gameplay testing

---


---

## HOTFIX: TeamFormation Selection Button - COMPLETED (November 29, 2025)

### 🐛 Bug Encontrado y Arreglado

**Problema:**
- Los equipos existentes en "Mis Equipos" solo mostraban botón de eliminar
- No había opción para **seleccionar/unirse** al equipo
- Los tabs de Quests/Boss no se habilitaban al seleccionar

**Solución Implementada:**

✅ **Botón de Selección Agregado**
- Nuevo botón: "✓ Seleccionar Equipo" en cada card
- Ejecuta: `onTeamCreated(team)` para pasar al componente padre
- Habilita automáticamente los tabs de Quests/Boss

✅ **Botón de Eliminar Restringido**
- Solo aparece si `team.leader === playerUID`
- Los miembros no pueden eliminar equipos
- Solo el líder tiene esta opción

✅ **Flujo de Equipo Completado**
1. Crear Equipo → Nuevo equipo aparece en "Mis Equipos"
2. Seleccionar Equipo → Habilita Quests/Boss
3. Hacer Quests → Gana XP/coins

### 📝 Cambios en TeamFormation.jsx
- Líneas 133-156: Agregado botón de selección
- Líneas 143-151: Botón eliminar condicionado a líder
- Styling: Cyan-Blue gradient para botón seleccionar

### Status:
✅ Bug arreglado
✅ Botones funcionales  
✅ Flujo de equipo completo
✅ Servidor compilando sin errores
✅ Listo para gameplay

