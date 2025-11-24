# NURSE MANAGER - Simulador de Gestión Sanitaria

A gamified learning platform for nursing management education built with React, Firebase, and Tailwind CSS.

## Overview

This is an interactive quiz-based learning application designed for nursing management students. The app features:

- Firebase authentication (anonymous login)
- Real-time Firestore database for progress tracking and leaderboards
- Progressive unlocking system with 22 learning modules
- Rank progression system with XP (23,000 max points)
- Variable point scoring based on response speed
- Streak bonuses and life/heart system (Duolingo-style)
- Beautiful animated UI with confetti effects and smooth transitions
- Gamified "hospital tower" interface for quiz levels

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v3 (with custom animations)
- **Icons**: Lucide React
- **Backend**: Firebase (Auth + Firestore)
- **Build Tool**: Vite
- **Animations**: CSS Keyframes + Custom Tailwind configs

## Project Structure

```
/src/
├── App.jsx                    # Main application component
├── index.css                  # Tailwind imports
├── firebase.js                # Firebase configuration
├── components/
│   ├── GameLevel.jsx          # Quiz game interface with lives system
│   ├── LivesGameOver.jsx      # Modal for when lives run out
│   ├── Dashboard.jsx          # Module selection and progress
│   ├── Rewards.jsx            # Milestone rewards system
│   ├── ElevatorDoors.jsx      # Door animation component
│   └── Confetti.jsx           # Confetti particles effect
├── data/
│   └── constants.js           # Quiz questions and module data
└── assets/
    └── game-level-bg.png      # Game background image
```

## Features

### 22 Learning Modules with Dynamic Content
- Each module has 10 questions (Module 22 has 20)
- Sequential unlocking system
- Progress persisted in Firestore
- Video resources for Planta 1 & 2

### Gamification System
- **Variable Points**: <10s=150pts | 10-20s=100pts | >20s=50pts
- **Streak System**: Resets on incorrect, shows at >=3, bonus at >=5
- **XP Ranks**: 8 levels up to 23,000 max points
- **Milestone Rewards**: 12 reward tiers (every 2000 points)
- **Leaderboard**: Global top performers ranking
- **Lives System**: 5 corazones per level (Duolingo-style)

### Timer System
- 30-second countdown per question
- Auto-fails at 0 seconds (costs 1 life)
- Pauses when answer submitted
- Visual progress bar with dynamic colors

### Lives/Hearts System (NEW - Duolingo-style)
- **Start**: 5 corazones per level (❤️❤️❤️❤️❤️)
- **On Incorrect Answer**: Lose 1 corazón (💔)
- **Game Over**: When lives reach 0, show modal with options
- **Recovery Options**:
  1. **Esperar 30 minutos**: Auto-recover 5 corazones after timer
  2. **Ver Video de Repaso**: Watch educational video → recover 2 corazones
  3. **Usar Power-Up**: Use power-up item → recover 5 corazones instantly
- **Persistence**: Lives saved in localStorage per module
- **Visual Indicator**: Header shows ❤️❤️💔💔💔 (2/5 example)

### Enhanced Animations
- **Confetti Effect**: Particles falling on correct answers
- **Points Animation**: Zoom + bounce + glow (0.8s duration)
- **Shake Animation**: 0.3s shake on incorrect answers
- **Stagger Effect**: Options slide-in with 50ms delays
- **Glow Effects**: Color-coded pulsing (green/red/cyan)
- **Heart Loss Animation**: Shake animation when losing a heart
- **Hover States**: Scale 1.02 with elevated shadow (200ms)
- **Smooth Transitions**: Fade in/out between questions (300ms)

## Recent Changes

### Latest Session (Nov 24, 2025) - Lives/Hearts System
- ✅ Implemented 5-hearts system per level
- ✅ Added 1-heart loss per incorrect answer
- ✅ Created LivesGameOver modal component
- ✅ Implemented 30-minute timer for recovery (localStorage)
- ✅ Added video recovery option (+2 hearts)
- ✅ Added power-up recovery system (5 hearts)
- ✅ Integrated heart indicator in header
- ✅ Added shake animation for heart loss
- ✅ Implemented localStorage persistence per module
- ✅ Compatible with streak system (racha NO affected by lives)
- ✅ Modal shows all 3 recovery options elegantly

### Previous Session (Nov 24, 2025) - Animations & Timer
- ✅ Implemented 30-second timer with auto-fail at 0s
- ✅ Added variable point system (150/100/50 based on speed)
- ✅ Integrated timer pause when user responds
- ✅ Added visual progress bar (green/yellow/red colors)
- ✅ Implemented confetti particle system
- ✅ Added zoom + bounce animation for points display
- ✅ Implemented shake animation for incorrect answers
- ✅ Added stagger effect (0-150ms delays) for options
- ✅ Enhanced glow effects with custom keyframes
- ✅ Improved hover states with smooth transitions
- ✅ Added drop-shadow effects to feedback text
- ✅ Created Confetti.jsx component for particle effects
- ✅ Extended tailwind.config.js with custom animations

## Files Added/Modified

### New Files (Latest)
- `src/components/LivesGameOver.jsx` - Modal for lives game over

### Previously New Files
- `src/components/Confetti.jsx` - Confetti particle system

### Modified Files
- `src/components/GameLevel.jsx` - Full integration of lives system + timer + animations
- `tailwind.config.js` - Custom keyframes and animations
- `replit.md` - Updated documentation

### Custom Animations (Tailwind)
- `shake` - Horizontal tremor (0.3s)
- `glow-pulse` - Cyan glow effect
- `glow-pulse-green` - Green glow effect
- `glow-pulse-red` - Red glow effect
- `points-bounce` - Zoom + bounce (0.8s)
- `slide-in-left` - Options entrance (0.3s)
- `confetti-fall` - Particle gravity (3s)

## Game Mechanics - Complete Flow

### Question Flow with Lives
1. Start level with 5 corazones
2. Timer starts: 30s countdown
3. User selects answer
4. If correct:
   - Points calculated: base (speed) + bonus (streak if >=5)
   - Confetti effect, animations
   - Advance to next question
5. If incorrect:
   - Lose 1 corazón (heart loss animation)
   - If lives > 0: advance to next question
   - If lives == 0: show LivesGameOver modal with 3 options
6. If timeout (0 seconds):
   - Counted as incorrect
   - Lose 1 corazón
   - Same flow as incorrect

### Point Calculation
```
IF time < 10s: +150 base points (¡RÁPIDO!)
IF time 10-20s: +100 base points
IF time > 20s: +50 base points (¡MÁS RÁPIDO!)
IF streak >= 5: +20 bonus points
Total = base + bonus
```

### Streak System
- Increments on correct answer
- Resets to 0 on incorrect answer or timeout
- Displays when >=3 (🔥 RACHA x[N])
- Bonus (+20) when >=5 (⭐ +20 BONUS RACHA!)
- Persists via localStorage key: `userStreak`
- **Important**: Racha NOT affected by running out of lives

### Lives System Details
- **Storage Key**: `gameLives_${topicId}` in localStorage
- **Recovery Timer Key**: `livesRecoveryTime_${topicId}` in localStorage
- **Max Lives**: 5 per level
- **Recovery Timer**: 30 minutes (1,800,000 ms)
- **Heart Loss**: 1 heart per incorrect answer or timeout
- **Video Recovery**: +2 hearts (one-time, per level)
- **Power-Up**: +5 hearts (if available)

## Firebase Configuration

The app uses Firebase for:
- Anonymous authentication
- Firestore database for user progress
- Real-time leaderboard
- Persistent progress tracking

**Note**: Firebase anonymous auth must be enabled in Firebase Console.

## Development

To run the dev server:
```bash
npm run dev
```

Server runs on port 5000 with hot module replacement enabled.

## Performance Optimizations

- CSS animations use GPU acceleration (transform-gpu)
- Confetti particles limited to 30 per trigger
- Animations use ease-out/ease-in-out for smoothness
- No animation blocking - all transitions are non-blocking
- Heart animation uses efficient CSS shake effect

## User Interface Highlights

- **Login Screen**: Gradient effects, anonymous login
- **Dashboard**: Module grid with lock icons, progress bars
- **Game Level**: Hospital tower with animated doors
- **Question Modal**: Timer bar, options with stagger, feedback panel
- **Hearts Indicator**: ❤️❤️❤️❤️❤️ / 💔 in header
- **Lives Game Over**: Beautiful modal with 3 recovery options
- **Completion**: Celebration animation with score display
- **Leaderboard**: Real-time player rankings

## Design Principles

- **Gamification**: Points, streaks, ranks, rewards, lives
- **Feedback**: Immediate visual response to all actions
- **Progression**: Clear unlocking and achievement system
- **Aesthetics**: Futuristic hospital theme with smooth animations
- **Performance**: Optimized animations for smooth gameplay
- **Accessibility**: Clear heart indicator, readable text, good contrast

## 🎯 MISSIONS SYSTEM (NEW - Daily & Weekly)

### Daily Missions (Reset Every 24h)
1. **"Responde 10 preguntas"** 📝
   - Progress: 0-10 questions
   - Reward: +300 XP
   - Auto-tracked each answer

2. **"Mantén tu racha activa"** 🔥
   - Progress: streak >= 1
   - Reward: +200 XP
   - Auto-completed if streak exists

3. **"Consigue 5 respuestas rápidas"** ⚡
   - Progress: 0-5 answers <10s
   - Reward: 1 Power-up
   - Auto-tracked on fast answers

### Weekly Mission (Reset Every Monday)
- **"Completa 3 niveles con 3 estrellas"** 🏆
- Progress: 0-3 perfect levels (100% correctas)
- Reward: +1500 XP + "Estudiante Dedicado" badge
- Auto-tracked on level completion

### Missions UI
- **Button**: 🎯 in Dashboard header (next to Rewards)
- **Badge**: Shows number of completed/unclaimed missions
- **Modal**: Beautiful UI with progress bars
- **Claims**: One-click claim rewards after completion

### Missions Persistence
- Storage keys: `dailyMissions`, `weeklyMission`, `lastMissionReset`, `lastWeeklyReset`
- Auto-reset: Checks date on app load
- Claim tracking: Prevents reclaiming same mission

## Next Steps / TODO

- [ ] Add sound effects for correct/incorrect/heart-loss
- [ ] Add notification toasts when missions complete
- [ ] Implement actual power-up inventory system
- [ ] Create administrator dashboard for question management
- [ ] Add more learning modules (full content for all 22)
- [ ] Implement certificates for completion
- [ ] Add multiplayer/competitive mode
- [ ] Add seasonal leaderboards
- [ ] Integrate missions XP rewards with user total score

## Summary

NURSE MANAGER is a comprehensive, gamified learning platform featuring:
- 30-second timer with variable points (150/100/50 based on speed)
- Streak system with +20 bonus when >=5
- Duolingo-style 5-hearts/lives system per level
- **Daily & Weekly Missions system** with auto-tracking
- Beautiful animations (confetti, shake, glow, bounce)
- Three ways to recover lives (wait 30min, video, power-up)
- Full persistence via localStorage + Firestore
- Professional UI with smooth transitions

---

**Last Updated**: Nov 24, 2025
**Status**: MVP with missions system + lives + enhanced animations ✨
**Version**: 3.0 (Daily & Weekly Missions Implementation)
