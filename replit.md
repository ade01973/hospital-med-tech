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

## Latest Update (November 28, 2025 - Female Avatar Video Preview)

### 👩‍⚕️ Female Avatar Video Display
- **File**: `avatar-female-preview.mp4` (860 KB)
- **Location**: Avatar gender selection screen (AvatarCustomization.jsx)
- **Behavior**: 
  - Shows animated female avatar video when "Mujer" button is selected
  - Replaces AvatarPreviewDisplay component
  - Video: autoPlay, loop, muted (no sound)
  - Smooth display with border matching the design
- **Male Option**: Shows regular AvatarPreviewDisplay when "Hombre" is selected
- **Size**: 256x256px (w-64 h-64) with rounded corners and object-cover fit

### Technical Implementation
- Import: `import avatarFemalePreview from "../assets/avatar-female-preview.mp4"`
- Conditional rendering: `{gender === "female" ? <video> : <AvatarPreviewDisplay>}`

