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
- **Infographics Gallery**: Gamified visual guide system showcasing 21 thematic infographics with advanced features: progress tracking (X/15 viewed with animated bar), Framer Motion stagger animations, confetti celebration on completion, favorites system with star toggle, search and category filters (Gestión, Liderazgo, Innovación, Comunicación, Equipo), 3D module number badges, skeleton shimmer loaders, and hover image previews. All progress persisted via localStorage.

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
- **Infographics System**: Gallery modal displaying 21 themed infographics (one per module) with interactive fullscreen viewer. Click any available infographic to view it at full screen within the app. Includes module icons, titles, subtitles, and status badges. All 21 infographics complete. Additional infographics can be easily added by placing images in `/src/assets/infographics/` and mapping them in the component.
- **AI Training Hub**: Comprehensive AI-powered training center styled as a separate dashboard with nurse manager office background. Features 5 specialized modules powered by Gemini AI:
    - **Gestión de Casos**: Analyze clinical and management cases with AI feedback (9 complete cases: Liderazgo, Toma de Decisiones, Gestión del Conflicto, Comunicación, Trabajo en Equipo, Ética, Gestión del Cambio, Marketing Sanitario, Innovación)
    - **Toma de Decisiones**: Practice decision-making with scenarios (quick, complex, ethical, crisis)
    - **Liderazgo**: Develop leadership competencies with coaching and tests
    - **Comunicación**: Improve communication skills with role-play and techniques
    - **Trabajo en Equipo**: Build teamwork abilities with simulations and assessments
  UI features: 3-column layout matching Dashboard style, office background image (`ai-training-bg.png`), animated particles, welcome card with user name, how-it-works guide, module grid with themed colors and icons. Each module has customized AI prompts with mandatory "gestor/gestora enfermero/a" terminology, conversation history, and 60s request timeout.
  **2025 Ultra-Visual UI Enhancements**:
    - **FloatingOrbs**: 5 animated gradient orbs (cyan, purple, emerald, amber, indigo) with smooth floating animation
    - **GlowingStars**: 25 twinkling star particles with random colors and positions
    - **FloatingParticles**: 30 rising particles with rotation effect
    - **Glassmorphism**: Enhanced backdrop-blur-xl, translucent cards with rounded-3xl borders
    - **Glow Effects**: Pulsing glow animations on buttons and badges
    - **Micro-animations**: Hover scale (1.02-1.1), translateY(-8px), icon rotation, smooth cubic-bezier transitions
    - **Gradient Text**: Shimmer effect on main titles, gradient-to-r text colors
    - **Card Hover Effects**: Dynamic shadows matching module theme colors
    - **Interactive Elements**: Emoji grid with hover animations, step badges with scale effects
    - **Typography**: Larger titles (text-2xl to text-3xl), improved line-height, font-black weights
- **Case Management Module (2025 Ultra-Visual UI)**: Highly gamified, visually stunning interface following Duolingo/Kahoot best practices:
    - **Visual Effects**: FloatingOrbs component with 5 animated gradient orbs (cyan, purple, blue, pink, amber), GlowingStars with 30 twinkling star particles
    - **Statistics Dashboard**: 4 animated StatCards showing Completed Cases, Total XP, Progress %, and Available XP with AnimatedCounter component
    - **Featured Case Section**: Highlighted "RECOMENDADO" card for the next uncompleted case with crown icon and pulsing badge
    - **Progress Tracking**: Animated progress bar with shimmer effect, percentage counter, and completion statistics
    - **Case Cards**: Compact modern design with gradient backgrounds based on completion status (emerald for completed, amber for recommended, slate for pending)
    - **Gamification Elements**: Streak indicator with flame icon, XP rewards display (+150 XP per case), numbered badges, difficulty indicators
    - **User Profile**: Avatar with online status indicator, profile integration in header
    - **Micro-animations**: Hover scale (1.01-1.1), rotate effects (2-6deg), staggered fadeInUp animations with delays, gradient text transitions
    - **Information Panels**: "How it Works" guide with emoji steps, Statistics panel with accuracy, best streak, level, and average time
    - **Responsive Design**: Optimized layout for mobile (p-4) and desktop (p-8), grid adjustments for different screen sizes
    - **Color Scheme**: Deep indigo-purple-slate gradient background, cyan/purple accent highlights, emerald completion badges

### System Design Choices
- **Gamified Progression**: Emphasis on exponential XP, competitive leagues, and diverse gamification elements.
- **Responsive and Animated UI**: Focus on smooth transitions, custom animations, and a dynamic interface.
- **Modular Component Design**: Utilizes reusable React components and custom hooks.
- **Hybrid Persistence**: Combines `localStorage` for temporary data with Firestore for permanent game data.

## External Dependencies
- **Firebase**: Authentication (anonymous login) and Firestore (real-time database).
- **React 19**: Frontend library.
- **Vite**: Build tool with proxy configuration for API calls.
- **Tailwind CSS v3**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **Web Audio API**: For procedural sound generation.
- **Web Share API**: For native mobile social sharing.
- **Web Push API**: For browser push notifications.
- **Google Gemini AI**: AI-powered training modules via `@google/genai` library. API runs on Express server (port 3001) with Vite proxy.

## Server Architecture
- **Frontend**: Vite dev server on port 5000
- **Gemini API Server**: Express.js server on port 3001 (`server/gemini-api.js`)
  - POST `/api/chat` - General chat with custom system prompts
  - POST `/api/generate-quiz` - Generate quiz questions from topics
  - POST `/api/generate-scenario` - Generate decision-making scenarios with AI
  - POST `/api/generate-decision-tree` - Generate interactive decision trees with AI
  - POST `/api/generate-priority-exercise` - Generate task prioritization exercises with AI
  - Vite proxies `/api/*` requests to the Gemini server

## Decision Making Module Enhancements (Dec 2025)
- **Player Avatar Integration**: Custom PlayerAvatarIcon component with hook usePlayerAvatar
  - Multiple sizes (xs, sm, md, lg, xl)
  - Robust fallback to User icon for missing/failed images
  - Uses `new URL()` for Vite-compatible asset resolution
  - Integrated in ScenarioChat, DecisionTreeGame, PriorityGame
- **Visual Effects**: FloatingParticles (20 animated particles), GlowingOrb (blur effect orbs)
- **AI Content Generation**: Three endpoints for dynamic content with:
  - Server-side ID generation (no ID in AI prompts)
  - JSON validation with try/catch
  - Required field validation
  - 503 overload error handling with retry support
- **Generate with AI Buttons**: Purple/pink button in ScenarioSelector, TreeSelector, PrioritySelector
- **Badge Indicator**: "IA" badge on dynamically generated items