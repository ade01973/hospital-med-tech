# NURSE MANAGER - Simulador de Gestión Sanitaria

## Overview
NURSE MANAGER is a gamified learning platform providing an interactive, quiz-based educational experience for nursing management students. The project aims for high engagement and market potential through robust gamification and social features. Key capabilities include interactive quizzes with progressive module unlocking, an advanced gamification system (XP, ranks, leagues, achievements, real-time progress tracking, leaderboards, daily rewards), social sharing, and a visually animated user interface. It also features a comprehensive 8-tier professional nursing career progression system and team-based quests with real quiz mechanics.

## User Preferences
- Fast development pace
- Exponential XP curve (not linear)
- Competitive elements important (leagues, leaderboards)
- Gamification elements (badges, streaks, ranks)
- Beautiful animations preferred
- Spanish language UI

## System Architecture
The application employs a modern web stack to deliver an interactive and gamified user experience.

### UI/UX Decisions
- A gamified "hospital tower" interface serves as the central hub.
- Extensive animations include confetti, smooth transitions, elevator door effects, and responsive elements.
- Custom avatar creation with gender selection, silhouettes, and skin tones.
- Procedurally generated sound effects via Web Audio API.
- Gradient designs for modals and consistent use of Cyan-Blue gradient for professional elements.

### Technical Implementations
- **Frontend**: React 19 with Vite.
- **Styling**: Tailwind CSS v3 with custom animations.
- **State Management**: `localStorage` for transient data (missions, leagues, login streaks) and Firestore for core game data.
- **Authentication**: Firebase anonymous login.
- **Database**: Real-time Firestore for user progress, leaderboards, and game data.
- **Gamification Core**:
    - **Progressive Unlocking**: 22 sequential learning modules.
    - **XP and Rank System**: Exponential XP curve (0-100,000 points across 8 tiers).
    - **League System**: 5 competitive tiers with weekly rankings.
    - **Login Streaks**: Daily rewards calendar with milestone badges and freeze mechanics.
    - **Variable Scoring**: Points based on response speed, streak bonuses, and a life/heart system.
    - **Missions**: Daily/Weekly missions.
    - **Achievements**: 25-badge system across 5 categories.
    - **Dynamic Difficulty**: Team quests feature adjustable difficulty (Fácil, Normal, Difícil) impacting questions, timer, damage, and rewards.
- **Notifications**: Web Push API for streaks, missions, rank progress, and badge achievements.
- **Sound System**: Web Audio API for procedural sound effects and background music with toggle.
- **Social Sharing**: Integration for various platforms, supporting Web Share API.
- **Leaderboards**: Global, Friend, and Weekly leaderboards with local persistence and animations.
- **Team Challenges**: Supports team formation (2-4 players), cooperative quests with real quiz mechanics, health-based gameplay, and boss battles (e.g., Zombi Hospitalario) with shared health pools and scaling rewards.
- **Career Progression**: An 8-tier professional nursing career roadmap (Estudiante to Gerenta) with visual timeline, real-time progress tracking, and "Casi Perfecto" requirements for top tiers.
- **Visual Celebrations**: Toast notifications and confetti animations upon completing challenges.
- **Streak Loss Penalty**: Visual feedback and modal for losing a daily streak.

### System Design Choices
- **Gamified Progression**: Emphasis on exponential XP, competitive leagues, and diverse gamification elements.
- **Responsive and Animated UI**: Focus on smooth transitions, custom animations, and a dynamic interface.
- **Modular Component Design**: Utilizes reusable React components and custom hooks.
- **Hybrid Persistence**: Combines `localStorage` for temporary data with Firestore for permanent game data.

## External Dependencies
- **Firebase**: Authentication (anonymous login) and Firestore (real-time database).
- **React 19**: Frontend library.
- **Vite**: Build tool.
- **Tailwind CSS v3**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **Web Audio API**: For procedural sound generation.
- **Web Share API**: For native mobile social sharing.
- **Web Push API**: For browser push notifications.