# NURSE MANAGER - Simulador de Gestión Sanitaria

## Overview
NURSE MANAGER is a gamified learning platform designed for nursing management students, offering an interactive, quiz-based educational experience. It aims for high engagement through robust gamification, social features, and a visually animated user interface. Key features include interactive quizzes with progressive module unlocking, an advanced gamification system (XP, ranks, leagues, achievements, real-time progress, leaderboards, daily rewards), social sharing, and an 8-tier professional nursing career progression. The platform integrates a healthcare management story arc with dynamic hospital cases, achievement badges, and professional hospital backgrounds.

## User Preferences
- Fast development pace
- Exponential XP curve (not linear)
- Competitive elements important (leagues, leaderboards)
- Gamification elements (badges, streaks, ranks)
- Beautiful animations preferred
- Spanish language UI

## System Architecture
The application uses a modern web stack to deliver an interactive and gamified user experience with a strong emphasis on visual engagement and a modular design.

### UI/UX Decisions
The user interface features a gamified "hospital tower" as the central hub, extensive animations (confetti, transitions, elevator effects, particle effects), custom avatar creation, procedural sound effects, and gradient designs. Professional hospital backgrounds with parallax effects are used. A cinematic welcome flow enhances the initial user experience. The Infographics Gallery offers a gamified visual guide with progress tracking, Framer Motion animations, favorites, search/filter capabilities, and skeleton loaders. Recent enhancements include Ultra-Visual UI elements like `FloatingOrbs`, `GlowingStars`, `FloatingParticles`, Glassmorphism effects, pulsing glow animations, micro-animations on hover, gradient text, and dynamic card hover effects across various modules.

### Technical Implementations
- **Frontend**: React 19 with Vite.
- **Styling**: Tailwind CSS v3 with custom animations.
- **State Management**: `localStorage` for transient data and Firestore for core game data.
- **Authentication**: Firebase anonymous login.
- **Database**: Real-time Firestore for user data.
- **Gamification Core**: Includes a progressive unlocking system for 22 modules, an exponential XP and 8-tier rank system, 5-tier competitive league system, daily login streaks, variable scoring, daily/weekly missions, a 15-badge achievement system, and dynamic difficulty for team quests. It also features 8 randomized dynamic hospital cases with two difficulty levels.
- **Notifications**: Web Push API for game events.
- **Sound System**: Web Audio API for procedural sound and music.
- **Social Sharing**: Web Share API integration.
- **Leaderboards**: Global, Friend, and Weekly leaderboards.
- **Team Challenges**: Supports 2-4 player cooperative quests with real quiz mechanics and boss battles.
- **Career Progression**: An 8-tier visual roadmap with "Casi Perfecto" requirements for top tiers.
- **AI Training Hub**: A separate dashboard with 5 specialized modules powered by Google Gemini AI (Gestión de Casos, Toma de Decisiones, Liderazgo, Comunicación, Trabajo en Equipo). These modules feature customized AI prompts, conversation history, and a 60s request timeout.
- **Specialized Module Enhancements**:
    - **Case Management**: Highly gamified interface with visual effects, statistics dashboard, featured case section, and animated progress tracking.
    - **Decision Making**: Incorporates player avatar integration, visual effects, AI content generation, and "Generate with AI" buttons.
    - **Leadership**: Features a `useLeadershipProfile` hook for persistence and includes new modes like `RolePlayMode` (AI character generation), `ChangeSimulator` (6-stage simulation with AI scenarios), `LeaderAnalytics` (dashboard), and `MentorMode` (AI expert mentor with resource panel).
    - **Communication**: Includes a `useCommunicationProfile` hook and 8 training modes: `ScenarioSelector` (AI-generated scenarios), `RolePlayMode` (emotional role-play), `CommunicationTest` (10-dimension assessment), `AssertiveMode` (DESC technique), `EmpathyMode`, `ConflictMode`, `CommunicationAnalytics`, and `MentorMode`. All communication modes feature visual effects and AI integration for scoring and feedback.

### System Design Choices
The system prioritizes gamified progression, a responsive and highly animated UI, modular component design using React, and hybrid data persistence combining `localStorage` with Firestore.

## External Dependencies
- **Firebase**: Authentication (anonymous) and Firestore (real-time database).
- **React 19**: Frontend library.
- **Vite**: Build tool and proxy for API calls.
- **Tailwind CSS v3**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **Web Audio API**: For sound effects and background music.
- **Web Share API**: For native social sharing.
- **Web Push API**: For browser notifications.
- **Google Gemini AI**: Powers AI-driven training modules via `@google/genai` library, with an Express.js server backend.