# NURSE MANAGER - Simulador de Gestión Sanitaria

## Overview
NURSE MANAGER is a gamified learning platform designed to provide an interactive, quiz-based educational experience for nursing management students. The project aims for high engagement and market potential through robust gamification, social features, and a visually animated user interface. Key capabilities include interactive quizzes with progressive module unlocking, an advanced gamification system (XP, ranks, leagues, achievements, real-time progress tracking, leaderboards, daily rewards), social sharing, an 8-tier professional nursing career progression system (Estudiante → Gerenta) requiring near-perfect performance for top 3 tiers. Features healthcare management story arc with dynamic hospital cases, achievement badges, and professional hospital backgrounds.

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
    - **Dynamic Hospital Cases**: 8 randomized healthcare management story arc cases per session, with progressive loading, decision options, XP rewards, and a bonus for perfect completion.
- **Notifications**: Web Push API for streaks, missions, rank progress, and badge achievements.
- **Sound System**: Web Audio API for procedural sound effects and background music.
- **Social Sharing**: Integration for various platforms, supporting Web Share API.
- **Leaderboards**: Global, Friend, and Weekly leaderboards with local persistence and animations.
- **Team Challenges**: Supports team formation (2-4 players), cooperative quests with real quiz mechanics, health-based gameplay, and boss battles (e.g., Zombi Hospitalario) with shared health pools and scaling rewards.
- **Career Progression**: An 8-tier professional nursing career roadmap with visual timeline, real-time progress tracking, and "Casi Perfecto" requirements for top tiers.
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

## Update #14: SISTEMA DE NIVELES EN HOSPITAL CASES (November 29, 2025)

### 🎯 NIVELES DE DIFICULTAD PROGRESIVOS
✅ **Nivel 1 - Casos Básicos**:
- 8 casos de gestión estándar con decisiones claras
- Recompensa base: **500 GestCoins** + 250 por ronda
- Ronda 1: 500 💸
- Ronda 2: 750 💸
- Ronda 3: 1000 💸

✅ **Nivel 2 - Casos CASI IMPOSIBLES**:
- 8 casos con dilemas éticos complejos y presión extrema
- Triaje de recursos limitados, falsificación de datos, conflictos ley/ética
- Recompensa escalada: **1500 GestCoins** + 250 por ronda
- Ronda 1: 1500 💸
- Ronda 2: 1750 💸
- Ronda 3: 2000 💸
- XP doble: 1000 XP por nivel 2 vs 500 XP por nivel 1

### 🎨 VISUAL DIFERENCIADO
✅ **Nivel 1 Modal**:
- Gradiente ámbar-púrpura
- Borde amarillo/dorado
- Icono: 👑
- Texto: "¡MAESTRO DE DECISIONES!"

✅ **Nivel 2 Modal**:
- Gradiente rojo oscuro-negro
- Borde rojo brillante
- Icono: 🏆
- Texto: "¡LEYENDA MÉDICA!"
- Alerta roja: "⚠️ ¡Has desbloqueado NIVEL 2 - CASOS CASI IMPOSIBLES!"

### 🔄 FLUJO DE PROGRESIÓN
✅ **Auto-generación de siguiente nivel**:
- Completa Nivel 1 perfectamente → Avanza a Nivel 2
- Completa Nivel 2 perfectamente → Regresa a Nivel 1 (ronda incrementada)
- Cada nivel mantiene contador de ronda para recompensas progresivas

✅ **Casos Nivel 2 Incluyen**:
1. Triaje de Recursos Limitados (pandemia)
2. Falsificación de Reportes (integridad)
3. Presupuesto vs Vidas (ética)
4. Crisis de Confianza (negligencia compañero)
5. Paciente vs Salud Pública (VIH+)
6. Colusión Administrativa (corrupción)
7. Mobbing y Represalia (acoso)
8. Pandemia Segunda Ola (colapso total)

✅ **Integración Completa**:
- `cases.js`: Dos pools de casos (HOSPITAL_CASES + HOSPITAL_CASES_LEVEL_2)
- Sistema de sesiones rastrean level y levelRound
- getFullReward() diferencia recompensas por nivel
- HospitalCases.jsx renderiza visual diferenciada
- Confetti de 500 piezas en ambos niveles

### ✅ Status
✅ Nivel 1: 8 casos básicos implementados
✅ Nivel 2: 8 casos casi imposibles implementados
✅ Sistema de progresión automática funcional
✅ Recompensas escalables por nivel y ronda
✅ Visual diferenciado para cada nivel
✅ Sin errores de compilación
✅ Servidor corriendo perfecto

---

---

## Update #15: VIDEO INTRO COMPLETO - FLUJO AVATAR → VIDEO → DASHBOARD (November 30, 2025)

### 🎬 FLUJO DE BIENVENIDA CINEMATOGRÁFICO
✅ **1. Pantalla de Avatar Entrance (5 segundos)**:
- Avatar del usuario frente al hospital con parallax background
- Título: "Bienvenido al Hospital Gest-Tech"
- Partículas y efectos visuales
- Transición suave

✅ **2. Pantalla de Video Fullscreen (integrado en app)**:
- Video de introducción del hospital (Gestora Enfermera Entra Al Hospital)
- Reproducción a pantalla completa
- Video integrado en assets, no reproducción externa
- Auto-play y fullscreen layout

✅ **3. Transición Suave al Dashboard**:
- Fade-out suave del video (0.8s)
- Sin jarrones ni interrupciones
- Acceso directo al Dashboard

### 🛠️ IMPLEMENTACIÓN TÉCNICA
✅ **AvatarEntrance.jsx**:
- Duración aumentada: 3.5s → 5s
- Título actualizado: "¡Bienvenido al Hospital!" → "Bienvenido al Hospital Gest-Tech"

✅ **HospitalVideoIntro.jsx (NEW)**:
- Componente fullscreen para reproducción de video
- Video source: `/src/assets/hospital-intro.mp4`
- Manejo de eventos onEnded para transición automática
- Fade-out de 0.8s antes de completar
- Indicador de carga en caso de buffering

✅ **App.jsx - Flujo Actualizado**:
- Importación de HospitalVideoIntro
- Estado `showHospitalVideo` para control
- Flujo: male/female-customization → avatar-entrance → showHospitalVideo → dashboard

### 📂 ASSETS
✅ Video copiado: `src/assets/hospital-intro.mp4` (Gestora Enfermera Entra Al Hospital)

### ✅ Status
✅ Video integrado en assets
✅ Componente HospitalVideoIntro creado y funcional
✅ AvatarEntrance actualizado (5s + título "Gest-Tech")
✅ Flujo completo implementado en App.jsx
✅ Transiciones suaves y cinematográficas
✅ Sin errores de compilación
✅ Servidor corriendo perfecto

---

---

## Update #16: CORRECCIÓN LÓGICA HOSPITAL CASES - RECOMPENSAS Y REGENERACIÓN (November 30, 2025)

### 🔧 PROBLEMA IDENTIFICADO
La lógica de Hospital Cases no estaba funcionando correctamente:
- No regeneraba 8 casos nuevos cuando se contestaba mal
- Las recompensas no se validaban correctamente

### ✅ SOLUCIÓN IMPLEMENTADA

#### 1️⃣ **completeCurrentCase() - Nueva Lógica**:
- ✅ TODAS correctas (8/8) → **Recompensa + cambio de nivel**
- ❌ Alguna incorrecta (< 8/8) → **SIN recompensa + 8 casos nuevos del MISMO nivel**

#### 2️⃣ **resetCaseSession() - Generación de Nuevos Casos**:
- Crea 8 casos nuevos (shuffled) del mismo nivel
- Mantiene level y levelRound de sesión anterior
- Reinicia counters: currentIndex=0, correctAnswers=0

#### 3️⃣ **HospitalCases.jsx - Flujo Mejorado**:
- Manejo correcto de `result.isSessionComplete`
- Si hay recompensa → mostrar modal de recompensa
- Si NO hay recompensa pero sesión completa → generar nuevos 8 casos

### 🎮 COMPORTAMIENTO FINAL

**Escenario A - TODAS CORRECTAS (8/8)**:
```
Respuesta 8/8 correcta 
→ "¡MAESTRO DE DECISIONES!" / "¡LEYENDA MÉDICA!"
→ +GestCoins + XP
→ Cambio de nivel (1→2 o 2→1)
```

**Escenario B - ALGUNA INCORRECTA**:
```
Respuesta 3/8 correcta
→ "Decisión No Óptima"
→ Continuar con casos restantes (5 más)
→ Terminar con 3/8
→ SIN recompensa
→ 8 casos nuevos del MISMO nivel
```

### ✅ Status
✅ Lógica de recompensas corregida
✅ Regeneración de 8 casos funcional
✅ Cambio de nivel solo con TODAS correctas
✅ Sin errores de compilación
✅ Servidor corriendo perfecto

---

---

## RESUMEN FINAL - SISTEMA FUNCIONAL (November 30, 2025)

### ✅ FLUJO CINEMATOGRÁFICO COMPLETADO
1. **Avatar Entrance** → 5 segundos con título "Bienvenido al Hospital Gest-Tech"
2. **Hospital Video Intro** → Pantalla completa fullscreen con fade-out suave
3. **Dashboard** → Acceso a todos los módulos incluidos "Casos del Hospital Gest-Tech"

### ✅ HOSPITAL CASES SISTEMA ARREGLADO
- **Lógica de recompensas**: Solo se dan recompensas si TODAS las 8 respuestas son correctas
- **Regeneración automática**: Siempre genera 8 casos nuevos (mismo nivel si falló, siguiente nivel si ganó)
- **Cambio de niveles**: Perfecto → Cambia a siguiente nivel; Imperfecto → Mismo nivel, nuevos 8 casos
- **Iniciación correcta**: Loading spinner mientras se inicializa la sesión

### 🔧 CORRECCIONES APLICADAS ÚLTIMAS
✅ Error de sintaxis corregido en HospitalCases.jsx
✅ Loading state agregado mientras se inicializa
✅ Logs de debug para rastrear errores
✅ Manejo correcto de sesiones vacías

### 🚀 ESTADO FINAL
✅ Compilación exitosa
✅ Video integrado en assets
✅ Flujo cinematográfico implementado
✅ Casos del Hospital funcionando perfectamente
✅ Servidor corriendo sin errores
✅ App lista para usar

