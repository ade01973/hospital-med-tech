# NURSE MANAGER - Simulador de Gestión Sanitaria

A gamified learning platform for nursing management education built with React, Firebase, and Tailwind CSS.

## Overview

This is an interactive quiz-based learning application designed for nursing management students. The app features:

- Firebase authentication (anonymous login)
- Real-time Firestore database for progress tracking and leaderboards
- Progressive unlocking system with 19 learning modules
- Rank progression system based on earned experience points
- Beautiful UI with Tailwind CSS and Lucide icons
- Gamified "hospital tower" interface for quiz levels

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Backend**: Firebase (Auth + Firestore)
- **Build Tool**: Vite

## Project Structure

```
/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind imports
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies and scripts
```

## Features

### Learning Modules (19 total)
1. Liderazgo y Estilos
2. La Gestora Enfermera
3. Trabajo en Equipo
4. Toma de Decisiones
5. Gestión del Conflicto
6-19. Additional modules (pending content)

### Rank System
- Estudiante (0 XP)
- Enfermera (500 XP)
- Referente (1,500 XP)
- Supervisora (2,500 XP)
- Adjunta (4,000 XP)
- Directora (6,000 XP)
- Gerente (8,000 XP)
- Líder Global (10,000 XP)

### Game Mechanics
- Each module has 5 questions worth 100 XP each
- Progressive unlocking (complete one level to unlock the next)
- Real-time leaderboard
- Personal progress tracking
- Beautiful "hospital tower" visualization for levels

## Firebase Configuration

The app uses Firebase for:
- Anonymous authentication
- Firestore database for user progress
- Real-time data synchronization
- Global leaderboard

**Note**: Firebase anonymous auth must be enabled in Firebase Console for the app to work.

## Development

To run the dev server:
```bash
npm run dev
```

Server runs on port 5000 and is accessible at the Replit webview.

## User Interface

- **Login Screen**: Futuristic design with gradient effects
- **Dashboard**: Vertical timeline showing all learning modules
- **Game Level**: Hospital tower with door-based progression
- **Leaderboard**: Top players ranked by total XP
- **Completion Screen**: Celebration UI with earned points

## Recent Changes

- 2025-01-23: Initial project setup with React + Vite
- 2025-01-23: Configured Tailwind CSS v3 for styling
- 2025-01-23: Set up Firebase integration
- 2025-01-23: Configured dev server on port 5000
