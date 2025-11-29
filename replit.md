# NURSE MANAGER - Simulador de Gestión Sanitaria

## Overview
NURSE MANAGER is a gamified learning platform for nursing management education. It's an interactive quiz-based application designed for students, offering a comprehensive and engaging learning experience. The project aims to provide a platform with high market potential by incorporating robust gamification and social features to drive user engagement and educational outcomes.

Key capabilities include:
- Interactive quiz-based learning with progressive module unlocking.
- Gamified progression system including XP, ranks, leagues, and achievements.
- Real-time progress tracking, leaderboards, and daily rewards.
- Social sharing for achievements and push notifications for engagement.
- A visually appealing and animated user interface.

## User Preferences
- Fast development pace
- Exponential XP curve (not linear)
- Competitive elements important (leagues, leaderboards)
- Gamification elements (badges, streaks, ranks)
- Beautiful animations preferred
- Spanish language UI

## System Architecture

The application is built with a modern web stack, focusing on a highly interactive and gamified user experience.

### UI/UX Decisions
- **Gamified "hospital tower" interface** for quiz levels and a dashboard with clear navigation.
- **Animated UI** with confetti effects, smooth transitions, and elevator door animations.
- **Custom avatar creation system** with gender selection, 10 base silhouettes, 8 skin tones, and planned incremental customization layers (face, eyes, hair, mouth, nose, uniform, accessories).
- **Sound effects** generated procedurally via Web Audio API for an immersive experience.
- **Gradient UI** for modals like the ShareModal.

### Technical Implementations
- **Frontend**: React 19 with Vite for a fast development experience.
- **Styling**: Tailwind CSS v3 with custom animations for a highly customizable and responsive design.
- **State Management**: `localStorage` is used for persisting missions, leagues, and login streaks locally.
- **Authentication**: Firebase anonymous login for ease of access.
- **Database**: Real-time Firestore for managing user progress, leaderboards, and game data.
- **Gamification Core**:
    - **Progressive Unlocking**: 22 learning modules unlocked sequentially.
    - **XP and Rank System**: Exponential XP curve with 2000-80000 points, designed for 2-3 weeks to max level.
    - **League System**: 5 competitive tiers with weekly rankings and rewards.
    - **Login Streaks**: Daily rewards calendar with milestone badges.
    - **Variable Scoring**: Points based on response speed, streak bonuses, and a life/heart system.
    - **Missions**: Daily/Weekly missions with local persistence.
    - **Achievements**: 25-badge system across 5 categories (Progreso, Excelencia, Dedicación, Competición, Especial) with unlock notifications.
- **Notifications**: Push notifications for streaks, missions, rank progress, and badge achievements using Web Push API.
- **Sound System**: Procedural sound generation via Web Audio API for correct/incorrect answers, module completion, and notifications, with a sound toggle and preference saving.
- **Social Sharing**: Integration for sharing achievements on Twitter/X, LinkedIn, Facebook, WhatsApp, and copy link, supporting Web Share API for mobile.

### Project Structure Highlights
- `/components`: Houses reusable UI components like `Dashboard`, `GameLevel`, `ShareModal`, `AvatarCustomization`, `LoginCalendar`, `Missions`, `Leagues`, `Rewards`, and `ConfettiCelebration`.
- `/hooks`: Custom hooks like `useMissions`, `useLeagues`, `useLoginStreak`, `useNotifications`, `useBadges`, `useSoundEffects`, and `useBackgroundMusic` encapsulate complex logic.
- `/services`: Dedicated services like `NotificationService` manage external interactions.
- `/data`: Configuration for constants, badges, and character data.

## External Dependencies
- **Firebase**: Used for Authentication (anonymous login) and Firestore (real-time database).
- **React 19**: Frontend library.
- **Vite**: Build tool.
- **Tailwind CSS v3**: Utility-first CSS framework for styling.
- **Lucide React**: Icon library.
- **Web Audio API**: For procedural sound effect generation.
- **Web Share API**: For native mobile social sharing.
- **Web Push API**: For browser push notifications.
---

## Latest Update (November 28, 2025 - Audio Implementation)

### 🎵 Professional Background Music
- **File**: `avatar-background-music.mp3` (1.5 MB - Professional medical app soundtrack)
- **Volume**: 15% (Low audio level)
- **Usage**: ONLY during avatar creation screens
  - Selección de género
  - Personalización de gestoras mujeres (58 opciones)
  - Personalización de gestores hombres (60 opciones)
- **Dashboard**: SILENT - No audio
- **Hook**: `useBackgroundMusic.js` - Reproduces MP3 with loop
- **Auto-stop**: Music pauses and resets on component unmount


---

## Audio System Updated (November 28, 2025 - Dashboard Music)

### 🎵 Dashboard Background Music
- **File**: `dashboard-background-music.mp3` (3.6 MB - "Flowing Serenity" soundtrack)
- **Volume**: 15% (Low audio level)
- **Usage**: ONLY on Dashboard main screen
- **Auto-stop**: Music pauses and resets when leaving dashboard

### 🔇 Avatar Screens (NO MUSIC)
- Selección de género: SILENT
- Personalización de gestoras: SILENT
- Personalización de gestores: SILENT

### System Architecture
- **Hook**: `useDashboardBackgroundMusic.js` - Reproduces "Flowing Serenity" MP3
- **Integration**: Dashboard.jsx activates background music on component load
- **Auto-cleanup**: Music stops on component unmount

---

## Latest Update (November 29, 2025 - NIVEL 2 FASE 1: Daily Streak System)

### 🔥 Daily Streak System Implementation
**COMPLETED**: Full streak tracking with localStorage persistence, auto-reset, freeze mechanics, and milestone badges

#### Components Created:
- **StreakTracker.jsx**: Main component displaying streak counter, milestone achievements, and freeze option
  - Streak counter with 🔥 emoji animation (bounce effect)
  - Hours countdown (color changes: emerald→yellow→red)
  - Warning system when <6 hours remaining
  - Freeze button (50 GestCoins to recover racha - max 1x/month)
  - Milestone badges display for unlocked achievements

#### Features Implemented:
1. **Streak Counter**: Number of consecutive days playing
   - Visual: Large bold number with fire emoji
   - Animation: `animate-bounce-streak` (0.8s ease-in-out)
   
2. **Auto-Reset**: 24+ hours without playing → streak resets to 0
   - localStorage persistence with timestamps
   - Real-time hour countdown
   
3. **Milestone Badges** (unlocked at days 7, 30, 100):
   - 🔥 Semana Ardiente (7 days) → +100 GestCoins
   - 🌟 Maestro del Mes (30 days) → +500 GestCoins
   - 👑 Leyenda Viva (100 days) → +2000 GestCoins
   
4. **Streak Freeze Mechanic**:
   - Cost: 50 GestCoins
   - Effect: Recover 24 hours to continue playing
   - Limit: 1x per month (automatic reset on month change)
   
5. **Warning System**:
   - <6 hours remaining: Red warning badge appears
   - Animated pulse + glow effect
   - Freeze button becomes available

#### Data Persistence:
- **localStorage key**: `streakData` (JSON object)
- **Structure**:
  ```javascript
  {
    count: 7,                          // Current streak days
    lastPlayDate: "2025-11-29T...",   // ISO timestamp
    frozenUntil: "2025-12-01T...",    // Freeze expiry (null if not frozen)
    frozeThisMonth: true,              // Track freeze usage this month
    milestonesBadges: [7, 30]         // Unlocked milestone days
  }
  ```

#### Integration Points:
- **Dashboard.jsx**: StreakTracker component added below DailyChallenge widget
- **GameLevel.jsx**: Streak incremented on quiz completion (incrementStreak function)
- **constants.js**: STREAK_MILESTONES and STREAK_CONFIG exported

#### CSS Animations (index.css):
- `@keyframes bounce-streak`: 🔥 emoji bounces up/scales (0.8s)
- `@keyframes streak-particles`: Particle effect for animations (1s)
- `.animate-bounce-streak`: Applied to fire emoji
- `.animate-streak-particles`: For particle effects

#### Design:
- Cyan-blue gradient container with glow effect
- Responsive sizing: Works on mobile, tablet, desktop
- Fire emoji displays when streak > 0
- Color coding: Green (safe) → Yellow (caution) → Red (danger)
- Smooth transitions (300ms CSS transitions)

#### Testing Checklist:
✅ Streak persists across sessions (localStorage)
✅ Racha incrementa en 1 por día
✅ Auto-reset a 0 si faltan 24+ horas
✅ Milestones unlock en días 7, 30, 100
✅ Freeze mechanics work (50 coins, 1x/month)
✅ Warning appears when <6 hours
✅ Animations smooth and responsive
✅ Mobile compatible

#### Next Steps (NIVEL 2 FASE 2-3):
- Leaderboards (Global, Friends, Weekly)
- Team Challenges (2-4 players, shared health pool, boss battles)
- Team-only achievements and rewards

