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
---

## Update #6: TIER 2 - NARRATIVA & CONTEXTO SANITARIO (November 29, 2025)

### 🏥 HOSPITAL CASES SYSTEM
✅ **8 Healthcare Management Story Arc Cases**:
- Crisis de Camas UCI: Gestión de ocupación
- Conflicto de Personal: Bienestar del equipo
- Auditoría CCAFR: Control de calidad
- Presupuesto Limitado: Asignación de recursos
- Infecciones Nosocomiales: Prevención
- Staff Burnout: Bienestar
- Paciente Insatisfecho: Resolución
- Crisis de Emergencia: Coordinación

Cada caso: descripción, 3-4 opciones de decisión, recompensas XP (0-100), impacto narrativo

✅ **New Components**:
- `src/components/HospitalCases.jsx`: Modal con 8 casos seleccionables
- `src/components/BadgesDisplay.jsx`: Grid 3x5 de badges (desbloqueados en color, grises si inactivos)
- `src/components/BadgeNotification.jsx`: Actualizado con animación badge-pop (0.6s)

### 🏆 ACHIEVEMENT BADGES SYSTEM
✅ **15 Achievement Badges** en `src/data/BADGES.js`:
1. Especialista 🏥 - Completar 3 módulos
2. Gestor de Equipos 👥 - 3 team quests
3. Hospitalero ❤️ - 5 patient cases
4. Líder Estratégico 📊 - Tier 5 (Jefa de Área)
5. Combatiente ⚔️ - 5 boss defeats
6. Racha Master 🔥 - 7 días streak
7. Auditor Experto 🚨 - 3 auditorías
8. Salva Vidas 🚑 - 3 emergencias
9. Gestor de Crisis 💫 - 5 conflictos resueltos
10. Innovador 💡 - 10 decisiones únicas
11. Maestro Sanitario 👑 - Tier 8 (Gerenta) - LEGENDARY
12. Colaborador 🤝 - 20 team quests
13. Analista 📈 - >75% progreso personal
14. Mentor 👨‍🏫 - Ayudar 5 equipos
15. Campeón 🏆 - Top 10 leaderboard - LEGENDARY

Rareza: Common (50 XP), Rare (75 XP), Epic (100 XP), Legendary (150 XP)

✅ **Persistent Storage**: localStorage para:
- completedCases: casos finalizados
- unlockedBadges: badges desbloqueados

### 🎨 CSS ANIMATIONS
✅ **@keyframes badge-pop**:
- Escala 0.5 → 1.1 → 1 (scale effect)
- Rotación -20deg → 5deg → 0deg
- 0.6 segundos con cubic-bezier bounce
- Integrado en BadgeNotification.jsx

### 📦 INTEGRATIONS
✅ **Dashboard.jsx Changes**:
- Botón "Hospital Cases" 🏥 (red-orange gradient)
- BadgesDisplay compacta (top 3 badges)
- onCaseComplete handler con Toast
- Imports: HospitalCases, BadgesDisplay, Toast, checkBadgeUnlocks

✅ **Toast Notifications**:
- "¡Decisión Correcta!" ✅
- "Decisión No Óptima" ❌
- Integrado en Dashboard para feedback de casos

### 📊 DATA STRUCTURES
✅ **cases.js exports**:
- HOSPITAL_CASES: 8 casos con emoji, descripción, 3-4 opciones, impacto
- getCompletedCases(), markCaseAsCompleted(), getCaseProgress()

✅ **BADGES.js exports**:
- BADGES: 15 badges con id, name, emoji, description, color, rarity, xpReward, condition
- getUnlockedBadges(), unlockBadge(), isBadgeUnlocked()
- getBadgeById(), checkBadgeUnlocks() para validación automática

### ✅ Status
✅ Todos los 8 Hospital Cases creados
✅ 15 Achievement Badges configurados
✅ HospitalCases.jsx fully functional
✅ BadgesDisplay.jsx con grid responsive
✅ BadgeNotification.jsx con animaciones
✅ Dashboard integrado con Hospital Cases + Badges
✅ Toast notifications para feedback
✅ localStorage persistence
✅ Cyan-blue consistent aesthetic
✅ Responsive mobile design
✅ Sin errores de compilación
✅ Servidor running

---

---

## Update #7: AVATAR ENTRANCE ANIMATION (November 29, 2025)

### 🎬 AVATAR ENTRANCE ANIMATION
✅ **AvatarEntrance.jsx Component**:
- New full-screen animation that plays after avatar selection
- Avatar enters from bottom with bounce effect (2.5s)
- Hospital building background with animated windows
- Particle effects (8 floating elements)
- Welcome text with staggered fadeInUp animations
- Door frame visual with hospital aesthetic
- Progress indicator at bottom
- Automatic transition to Dashboard after 3.5s

✅ **CSS Keyframes**:
- `@keyframes avatar-entrance`: Scale 0.5→1.05→1, translateY bounce
- `@keyframes float-particle`: Floating particle effect with opacity fade
- Applied to `.animate-avatar-entrance` and `.animate-float-particle`

✅ **Integration with App Flow**:
- Added AvatarEntrance import to App.jsx
- New state: selectedAvatar to store avatar data
- New view: 'avatar-entrance' between character customization and dashboard
- MaleCharacterCustomization passes avatar object with gender: 'male'
- FemaleCharacterCustomization passes avatar object with gender: 'female'
- Animation triggers automatically, flows to Dashboard on completion

✅ **Visual Features**:
- Cyan-blue gradient aesthetic consistent with app
- Hospital background with animated windows
- Aura glow effect around avatar
- Floor shine and shadow effects
- Red medical cross symbol on door frame
- Professional healthcare aesthetic

### ✅ Status
✅ AvatarEntrance component fully functional
✅ App flow integrated seamlessly
✅ Animations smooth and polished
✅ Avatar data passed through flow correctly
✅ Hospital theming applied
✅ Responsive design confirmed
✅ All CSS animations added
✅ No compilation errors
✅ Ready for production

---

---

## Update #8: HOSPITAL BACKGROUND IMAGES (November 29, 2025)

### 🏥 PROFESSIONAL HOSPITAL BACKGROUNDS
✅ **Modern Healthcare Facility Background**:
- High-res image of futuristic hospital building
- "HOSPITAL UNIVERSITARIO DE LA GESTION ENFERMERA" aesthetic
- Applied to WelcomeScreen.jsx (first page after login)
- Applied to AvatarEntrance.jsx (avatar entrance animation)

✅ **Image Asset**:
- File: `src/assets/hospital-entrance.png` (6.2 MB)
- Copied from user-provided hospital building image
- Professional modern architecture with glass facade
- Cyan/blue lighting accents matching app theme

✅ **Integration**:
- WelcomeScreen: backgroundImage = hospital-entrance.png
- AvatarEntrance: backgroundImage = hospital-entrance.png
- Both with 50% black overlay for readability
- backgroundAttachment: fixed for parallax effect

### ✅ Status
✅ Hospital background image imported
✅ Applied to WelcomeScreen and AvatarEntrance
✅ Proper overlay for text readability
✅ Consistent cyan-blue aesthetic
✅ Professional healthcare appearance
✅ All hot reload working
✅ No compilation errors

---

---

## Update #9: CUSTOM AVATAR DISPLAY IN ENTRANCE ANIMATION (November 29, 2025)

### 👤 AVATAR CUSTOMIZATION INTEGRATION
✅ **AvatarEntrance.jsx Updated**:
- Ahora muestra el avatar customizado que el usuario seleccionó
- Soporta tanto avatares masculinos como femeninos
- Carga la imagen desde: `/src/assets/{gender}-characters/{gender}-character-{characterPreset}.png`

✅ **Changes Made**:
- Removida función getSvgPath() (que mostraba emojis genéricos)
- Agregada renderización de imagen real del avatar: `<img src={`/src/assets/${avatar.gender}-characters/...`} />`
- Avatar container tamaño: w-80 h-80 para mejor visualización
- Sombra dinámica más grande: w-56 para coincidir con tamaño

✅ **Features**:
- Avatar completo con todas sus características (hairstyle, barba, accesorios, etc.)
- Animación de entrada (animate-avatar-entrance) aplicada al avatar real
- Drop shadow y aura effect mantenidos
- Responsive en todos los tamaños de pantalla

### ✅ Status
✅ Avatar customizado mostrado en AvatarEntrance
✅ Tanto chicos como chicas se muestran correctamente
✅ Todas las características del avatar preservadas
✅ Sin errores de compilación
✅ Hot reload trabajando perfectamente
✅ Ready para producción

---

---

## Update #10: DASHBOARD LAYOUT - STREAK TRACKER & HOSPITAL CASES RENAME (November 29, 2025)

### 📍 DASHBOARD RESTRUCTURE
✅ **Streak Tracker Repositioned**:
- Movido de lado izquierdo a lado derecho del Dashboard
- Ahora está debajo de "Casos del Hospital Gest-Tech"
- Agrupa Progresión Profesional → Hospital Cases → Streak Tracker → Badges

✅ **Hospital Cases Renamed**:
- Cambió de "Hospital Cases" a "Casos del Hospital Gest-Tech"
- Mantiene mismo estilo rojo-naranja (🏥 emoji)
- Aumenta branding local/profesional

✅ **New Right Column Layout**:
- AdvancedMilestoneTimeline (Progresión Profesional)
- Casos del Hospital Gest-Tech (Hospital Cases Button)
- Streak Tracker (Racha Actual)
- BadgesDisplay (Badges)

### ✅ Status
✅ Streak Tracker removido del lado izquierdo
✅ Streak Tracker agregado debajo de Hospital Cases
✅ Hospital Cases renombrado a "Casos del Hospital Gest-Tech"
✅ Layout vertical organizado perfectamente
✅ Sin errores de compilación
✅ Servidor corriendo sin problemas

---
