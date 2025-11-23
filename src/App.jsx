import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot, serverTimestamp, increment } from 'firebase/firestore';
import AuthScreen from './components/AuthScreen';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import GameLevel from './components/GameLevel';
import Leaderboard from './components/Leaderboard';
import ElevatorDoors from './components/ElevatorDoors';
import { auth, db, appId } from './firebase.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('auth');
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentFloor, setCurrentFloor] = useState(-1);
  const [showElevatorDoors, setShowElevatorDoors] = useState(false);

  // 🔵 DETECTAR LOGIN Y CAMBIOS DE AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log('Auth state changed:', u ? 'Usuario logueado' : 'Sin usuario');
      if (u && !user) {
        console.log('✓ Nuevo login detectado, ir a bienvenida');
        setView('welcome');
      }
      setUser(u);
      if (!u) {
        setView('auth');
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // 🟢 CARGAR PROGRESO DEL USUARIO
  useEffect(() => {
    if (!user) return;
    
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      console.warn('No studentId en localStorage');
      return;
    }

    const userProgressRef = doc(db, 'artifacts', appId, 'users', studentId, 'data', 'progress');

    const unsubscribe = onSnapshot(userProgressRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log('✓ Datos de progreso cargados:', docSnap.data());
        setUserData(docSnap.data());
      } else {
        console.log('📝 Creando documento de progreso nuevo');
        setDoc(userProgressRef, {
          totalScore: 0,
          completedLevels: {}
        });
      }
    }, (error) => {
      console.error('Error al cargar progreso:', error);
    });

    return () => unsubscribe();
  }, [user]);

  // 🟣 GUARDAR PUNTOS Y DESBLOQUEAR NIVEL
  const handleLevelComplete = async (levelId, pointsEarned, studentId) => {
    console.log(`📊 handleLevelComplete llamado - Módulo ID: ${levelId}, Puntos: ${pointsEarned}, StudentID: ${studentId}`);
    
    // ✅ NAVEGAR INMEDIATAMENTE AL DASHBOARD
    console.log('✅ Navegando a dashboard INMEDIATAMENTE');
    setView('dashboard');
    
    // 🔄 GUARDAR DATOS EN BACKGROUND (sin bloquear)
    if (!user) {
      console.error('❌ No hay usuario');
      return;
    }
    if (userData?.completedLevels?.[levelId]) {
      console.log('⚠️ Módulo ya completado');
      return;
    }
    
    // Si no viene studentId en parámetro, obtener de localStorage
    let finalStudentId = studentId;
    if (!finalStudentId) {
      finalStudentId = localStorage.getItem('studentId');
      console.log(`📌 StudentID obtenido de localStorage: ${finalStudentId}`);
    }
    
    if (!finalStudentId) {
      console.error('❌ No se encontró studentId ni en parámetro ni en localStorage');
      return;
    }
    const userProgressRef = doc(db, 'artifacts', appId, 'users', finalStudentId, 'data', 'progress');
    const publicProfileRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', finalStudentId);
    
    // ✅ MANTENER TODOS LOS NIVELES COMPLETADOS PREVIOS + AGREGAR EL NUEVO
    const newCompletedLevels = {
      ...(userData?.completedLevels || {}),
      [levelId]: true,
    };

    try {
      await setDoc(userProgressRef, {
        totalScore: increment(pointsEarned),
        completedLevels: newCompletedLevels,
        lastPlayed: serverTimestamp(),
      }, { merge: true });

      await setDoc(publicProfileRef, {
        totalScore: increment(pointsEarned),
        lastActive: serverTimestamp(),
      }, { merge: true });

      console.log('✅ Progreso guardado exitosamente');
    } catch (error) {
      console.error('❌ Error al guardar progreso:', error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {showElevatorDoors && (
        <ElevatorDoors 
          onComplete={() => {
            setShowElevatorDoors(false);
            setView('game');
          }}
        />
      )}
      {!user && <AuthScreen onLogin={() => setView('welcome')} />}
      {user && view === 'welcome' && <WelcomeScreen onContinue={() => setView('dashboard')} onLogout={() => auth.signOut()} />}
      {user && view === 'dashboard' && <Dashboard user={user} userData={userData} setView={setView} setLevel={setCurrentLevel} setCurrentFloor={setCurrentFloor} setShowElevatorDoors={setShowElevatorDoors} />}
      {user && view === 'game' && currentLevel && !showElevatorDoors && (
        <GameLevel 
          topic={currentLevel} 
          user={user} 
          studentId={userData?.studentId || localStorage.getItem('studentId')}
          onExit={() => setView('dashboard')}
          onComplete={handleLevelComplete}
        />
      )}
      {user && view === 'leaderboard' && <Leaderboard onBack={() => setView('dashboard')} />}
    </div>
  );
}
