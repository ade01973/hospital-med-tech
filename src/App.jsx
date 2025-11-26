import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot, serverTimestamp, increment } from 'firebase/firestore';
import AuthScreen from './components/AuthScreen';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import GameLevel from './components/GameLevel';
import Leaderboard from './components/Leaderboard';
import ElevatorDoors from './components/ElevatorDoors';
import LoginRewardNotification from './components/LoginRewardNotification';
import BadgeNotification from './components/BadgeNotification';
import { auth, db, appId } from './firebase.js';
import { useLoginStreak } from './hooks/useLoginStreak';
import { useBadges } from './hooks/useBadges';
import useNotifications from './hooks/useNotifications';

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('auth');
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentFloor, setCurrentFloor] = useState(-1);
  const [showElevatorDoors, setShowElevatorDoors] = useState(false);
  const [rewardNotification, setRewardNotification] = useState(null);
  const [showRewardNotification, setShowRewardNotification] = useState(false);
  const [prevCompletedCount, setPrevCompletedCount] = useState(0);
  
  const videoLinks = {
    1: "bL0e705JuZQ",
    2: "eb1nlMUK3-c",
    3: "ThHodVUzC9c",
    4: "oB4ol3EYEIs",
    5: "yUOPtM_yEHc",
    6: "NMY7SwEgC50",
    7: "TU9VF7sWh-w",
    8: "7yo2d-MtgBw",
    9: "rTJXMJqkUSw",
    10: "pem8VkjbNA4",
    11: "iJNKzYCRoEw",
    12: "VvHqG2ec744",
    13: "scs2OI7IB2c",
    14: "HBnbjZKqyjA",
    15: "5KbUJ6fDVRA",
    16: "DVlSigTdaoQ",
    17: "e0AbDC1DlLI",
    18: "pvOTsv6alS8",
    19: "p2qaUIymS9M",
    20: "w_YbsjGtn1s",
    21: "hvI5afYV9kM",
  };
  
  const { processLogin } = useLoginStreak();
  const { 
    newBadge, 
    showBadgeNotification, 
    setShowBadgeNotification,
    checkLevelBadges
  } = useBadges(userData);

  // 🔵 DETECTAR LOGIN Y CAMBIOS DE AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log('Auth state changed:', u ? 'Usuario logueado' : 'Sin usuario');
      if (u && !user) {
        console.log('✓ Nuevo login detectado, ir a bienvenida');
        // 🔔 Procesar login y mostrar recompensa si hay
        const rewardData = processLogin();
        if (rewardData) {
          console.log('🎉 Recompensa de login:', rewardData);
          setRewardNotification(rewardData);
          setShowRewardNotification(true);
        }
        setView('welcome');
      }
      setUser(u);
      if (!u) {
        setView('auth');
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, [user, processLogin]);

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

  // 🏆 DETECTAR BADGES COMO FALLBACK
  useEffect(() => {
    if (!userData?.completedLevels || !checkLevelBadges) return;
    
    const currentCompletedCount = Object.values(userData.completedLevels || {}).filter(Boolean).length;
    if (currentCompletedCount > prevCompletedCount) {
      setPrevCompletedCount(currentCompletedCount);
      checkLevelBadges();
    }
  }, [userData?.completedLevels, checkLevelBadges, prevCompletedCount]);


  // 🟣 GUARDAR PUNTOS Y DESBLOQUEAR NIVEL
  const handleLevelComplete = async (levelId, pointsEarned, studentId) => {
    console.log(`📊 handleLevelComplete llamado - Módulo ID: ${levelId}, Puntos: ${pointsEarned}, StudentID: ${studentId}`);
    
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
      
      // 🏆 DETECTAR BADGES ANTES DE NAVEGAR
      const completedCount = Object.values(newCompletedLevels || {}).filter(Boolean).length;
      console.log(`🎯 Verificando badges - Niveles completados: ${completedCount}`);
      
      // Ejecutar checkLevelBadges AHORA (cambiará el estado del hook)
      if (checkLevelBadges) {
        const badgeUnlocked = checkLevelBadges();
        console.log(`🏆 Badge check result: ${badgeUnlocked}`);
      }
      
      // ✅ NAVEGAR AL DASHBOARD DESPUÉS DE BADGE CHECK
      // Dar tiempo para que React renderice el modal del badge
      setTimeout(() => {
        console.log('➡️ Navegando a dashboard');
        setCurrentLevel(null);
        setView('dashboard');
      }, 500);
    } catch (error) {
      console.error('❌ Error al guardar progreso:', error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {/* Login Reward Notification */}
      <LoginRewardNotification
        isOpen={showRewardNotification}
        onClose={() => setShowRewardNotification(false)}
        rewardData={rewardNotification}
      />
      
      {/* Badge Notification */}
      <BadgeNotification
        isOpen={showBadgeNotification}
        onClose={() => setShowBadgeNotification(false)}
        badge={newBadge}
      />
      
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
      {user && view === 'dashboard' && <Dashboard user={user} userData={userData} setView={setView} setLevel={setCurrentLevel} setShowElevatorDoors={setShowElevatorDoors} />}
      {user && view === 'game' && currentLevel && !showElevatorDoors && (
        <GameLevel 
          topic={currentLevel} 
          user={user}
          userData={userData}
          studentId={userData?.studentId || localStorage.getItem('studentId')}
          videoId={videoLinks[currentLevel.id]}
          onExit={() => { setCurrentLevel(null); setView('dashboard'); }}
          onComplete={handleLevelComplete}
        />
      )}
      {user && view === 'leaderboard' && <Leaderboard onBack={() => setView('dashboard')} />}
    </div>
  );
}
