# NURSE MANAGER - Simulador de Gestión Sanitaria

A gamified learning platform for nursing management education built with React, Firebase, and Tailwind CSS.

## Overview

This is an interactive quiz-based learning application designed for nursing management students. The app features:

- Firebase authentication (anonymous login)
- Real-time Firestore database for progress tracking and leaderboards
- Progressive unlocking system with 22 learning modules
- Rank progression system with XP (23,000 max points)
- Variable point scoring based on response speed
- Streak bonuses (+20pts when streak >=5)
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
├── App.jsx                # Main application component
├── index.css              # Tailwind imports
├── firebase.js            # Firebase configuration
├── components/
│   ├── GameLevel.jsx      # Quiz game interface with animations
│   ├── Dashboard.jsx      # Module selection and progress
│   ├── Rewards.jsx        # Milestone rewards system
│   ├── ElevatorDoors.jsx  # Door animation component
│   └── Confetti.jsx       # Confetti particles effect
├── data/
│   └── constants.js       # Quiz questions and module data
└── assets/
    └── game-level-bg.png  # Game background image
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

### Timer System
- 30-second countdown per question
- Auto-fails at 0 seconds
- Pauses when answer submitted
- Visual progress bar with dynamic colors

### Enhanced Animations (NEW - Nov 24)
- **Confetti Effect**: Particles falling on correct answers
- **Points Animation**: Zoom + bounce + glow (0.8s duration)
- **Shake Animation**: 0.3s shake on incorrect answers
- **Stagger Effect**: Options slide-in with 50ms delays
- **Glow Effects**: Color-coded pulsing (green/red/cyan)
- **Hover States**: Scale 1.02 with elevated shadow (200ms)
- **Smooth Transitions**: Fade in/out between questions (300ms)

## Recent Changes

### Latest Session (Nov 24, 2025)
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

### New Files
- `src/components/Confetti.jsx` - Confetti particle system

### Modified Files
- `src/components/GameLevel.jsx` - Timer, animations, confetti integration
- `tailwind.config.js` - Custom keyframes and animations

### Custom Animations (Tailwind)
- `shake` - Horizontal tremor (0.3s)
- `glow-pulse` - Cyan glow effect
- `glow-pulse-green` - Green glow effect
- `glow-pulse-red` - Red glow effect
- `points-bounce` - Zoom + bounce (0.8s)
- `slide-in-left` - Options entrance (0.3s)
- `confetti-fall` - Particle gravity (3s)

## Game Mechanics

### Question Flow
1. Timer starts: 30s countdown
2. User selects answer
3. Points calculated: base (speed) + bonus (streak if >=5)
4. Feedback shown: 1.5s delay before next question
5. Auto-advance to next question or completion

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

## User Interface Highlights

- **Login Screen**: Gradient effects, anonymous login
- **Dashboard**: Module grid with lock icons, progress bars
- **Game Level**: Hospital tower with animated doors
- **Question Modal**: Timer bar, options with stagger, feedback panel
- **Completion**: Celebration animation with score display
- **Leaderboard**: Real-time player rankings

## Design Principles

- Gamification: Points, streaks, ranks, rewards
- Feedback: Immediate visual response to all actions
- Progression: Clear unlocking and achievement system
- Aesthetics: Futuristic hospital theme with smooth animations
- Performance: Optimized animations for smooth gameplay

## Next Steps / TODO

- [ ] Add sound effects for correct/incorrect answers
- [ ] Implement difficulty levels
- [ ] Add multiplayer/competitive mode
- [ ] Create administrator dashboard for question management
- [ ] Add more learning modules (full content for all 22)
- [ ] Implement certificates for completion

---

**Last Updated**: Nov 24, 2025
**Status**: MVP with enhanced animations ✨
