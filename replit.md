# NURSE MANAGER - Simulador de Gestión Sanitaria

## Overview
NURSE MANAGER is a gamified learning platform providing an interactive, quiz-based educational experience for nursing management students. It aims for high engagement with robust gamification, social features, and a visually animated user interface. Key capabilities include interactive quizzes with progressive module unlocking, an advanced gamification system (XP, ranks, leagues, achievements, real-time progress, leaderboards, daily rewards), social sharing, and an 8-tier professional nursing career progression system requiring near-perfect performance for top tiers. The platform features a healthcare management story arc with dynamic hospital cases, achievement badges, and professional hospital backgrounds.

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
- Extensive animations include confetti, smooth transitions, elevator door effects, particle effects, and responsive elements.
- Custom avatar creation with gender selection, silhouettes, and skin tones.
- Procedurally generated sound effects and background music.
- Gradient designs for modals and a consistent Cyan-Blue gradient for professional elements.
- Professional hospital backgrounds with parallax effects.
- Cinematic welcome flow: 5-second avatar entrance, fullscreen video intro, smooth transition to dashboard.
- **Infographics Gallery**: Visual guide system showcasing 21 thematic infographics (one per module) with grid layout, module badges, and download functionality. Styled with purple-pink gradient buttons and cyan-blue accent borders consistent with dashboard aesthetic.

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
    - **Achievements**: 15-badge system across various categories, with rarity and XP rewards.
    - **Dynamic Difficulty**: Team quests feature adjustable difficulty impacting questions, timer, damage, and rewards.
    - **Dynamic Hospital Cases**: 8 randomized healthcare management story arc cases per session, with two difficulty levels (basic and "almost impossible") offering escalating rewards and requiring all correct answers for progression. Dynamic feedback (10 positive, 10 negative variants) is provided.
- **Notifications**: Web Push API for streaks, missions, rank progress, and badge achievements.
- **Sound System**: Web Audio API for procedural sound effects and background music.
- **Social Sharing**: Integration for various platforms, supporting Web Share API.
- **Leaderboards**: Global, Friend, and Weekly leaderboards with local persistence and animations.
- **Team Challenges**: Supports team formation (2-4 players), cooperative quests with real quiz mechanics, health-based gameplay, and boss battles (e.g., Zombi Hospitalario) with shared health pools and scaling rewards.
- **Career Progression**: An 8-tier professional nursing career roadmap with visual timeline, real-time progress tracking, and "Casi Perfecto" requirements for top tiers.
- **Visual Celebrations**: Toast notifications and confetti animations upon completing challenges.
- **Streak Loss Penalty**: Visual feedback and modal for losing a daily streak.
- **Infographics System**: Gallery modal displaying 21 themed infographics (one per module) with placeholder UI for future infographic content. Includes module icons, titles, subtitles, and download buttons. Ready to accept custom infographic designs from user.

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