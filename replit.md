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