import BrainstormHost from './components/BrainstormHost';
import BrainstormJoin from './components/BrainstormJoin'; 
// 🔥 1. NUEVO IMPORT AQUÍ
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { doc, setDoc, onSnapshot, serverTimestamp, increment } from 'firebase/firestore';

// --- IMPORTS DE COMPONENTES ---
import LandingPage from './components/LandingPage'; 
import AuthScreen from './components/AuthScreen';
import WelcomeScreen from './components/WelcomeScreen';
import AvatarCustomization from './components/AvatarCustomization';
import MaleCharacterCustomization from './components/MaleCharacterCustomization';
import FemaleCharacterCustomization from './components/FemaleCharacterCustomization';
import AvatarEntrance from './components/AvatarEntrance';
import HospitalVideoIntro from './components/HospitalVideoIntro';
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
  
  const [view, setView] = useState('landing');
  
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentFloor, setCurrentFloor] = useState(-1);
  const [showElevatorDoors, setShowElevatorDoors] = useState(false);
  // ... (el resto sigue igual)
  const [rewardNotification, setRewardNotification] = useState(null);
  const [showRewardNotification, setShowRewardNotification] = useState(false);
  const [prevCompletedCount, setPrevCompletedCount] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showHospitalVideo, setShowHospitalVideo] = useState(false);

  const { processLogin } = useLoginStreak();
  const { 
    newBadge, 
    showBadgeNotification, 
    setShowBadgeNotification,
    checkLevelBadges
  } = useBadges(userData);

  // --- FUNCIÓN DE LIMPIEZA TOTAL (LOGOUT) ---
  const handleLogout = async () => {
    try {
      // 1. Cerrar sesión en Firebase
      await signOut(auth);
      
      // 2. Borrar huella local
      localStorage.removeItem('studentId');

      // 3. LIMPIAR TODOS LOS ESTADOS (La "Escoba")
      setUser(null);
      setUserData(null);
      setSelectedAvatar(null);
      setCurrentLevel(null);
      setRewardNotification(null);
      
      // 4. 🔥 AL SALIR, VOLVEMOS A LA LANDING PAGE
      setView('landing'); 
      
      console.log("🧹 Sesión cerrada y memoria limpiada. Volviendo a portada.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // 🔵 DETECTAR LOGIN Y CAMBIOS DE AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      const isGuestRoute = typeof window !== 'undefined' && window.location.pathname.includes('/battle/guest');

      console.log('Auth state changed:', u ? 'Usuario logueado' : 'Sin usuario');
      if (isGuestRoute) {
        setUser(u);
        return;
      }

      if (u && !user) {
        console.log('✓ Nuevo login detectado, ir a bienvenida');
        // 🔔 Procesar login y mostrar recompensa si hay
        const rewardData = processLogin();
        if (rewardData) {
          console.log('🎉 Recompensa de login:', rewardData);
          setRewardNotification(rewardData);
          setShowRewardNotification(true);
        }
        // Si entramos, vamos a la bienvenida
        setView('welcome');
      }
      setUser(u);

      if (!u) {
        setView('landing');
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, [user, processLogin]);

  // 🔗 DETECTAR ACCESO DIRECTO A LA SALA DE INVITADOS
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const searchParams = new URLSearchParams(window.location.search);

    const isGuestPath = pathParts[0] === 'battle' && pathParts[1] === 'guest';
    const hasGuestCodeQuery = searchParams.get('code');

    if (isGuestPath || hasGuestCodeQuery) {
      setView('brainstorm_join');
    }
  }, []);
  // 🟢 CARGAR PROGRESO DEL USUARIO
  useEffect(() => {
    if (!user) return;
    
    // Usamos el UID directo de Firebase para evitar errores de localStorage
    const studentId = user.uid; 
    const userProgressRef = doc(db, 'artifacts', appId, 'users', studentId, 'data', 'progress');

    const unsubscribe = onSnapshot(userProgressRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log('✓ Datos de progreso cargados:', docSnap.data());
        setUserData(docSnap.data());
      } else {
        console.log('📝 Creando documento de progreso nuevo');
        setDoc(userProgressRef, {
          totalScore: 0,
          completedLevels: {},
          studentId: studentId // Guardamos el ID dentro por si acaso
        }, { merge: true });
        setUserData({ totalScore: 0, completedLevels: {} });
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
    console.log(`📊 handleLevelComplete llamado - Módulo ID: ${levelId}, Puntos: ${pointsEarned}`);
    
    if (!user) {
      console.error('❌ No hay usuario');
      return;
    }
    if (userData?.completedLevels?.[levelId]) {
      console.log('⚠️ Módulo ya completado');
      // Volvemos al dashboard aunque ya esté completado
      setTimeout(() => {
        setCurrentLevel(null);
        setView('dashboard');
      }, 500);
      return;
    }
    
    // Usamos el UID del usuario actual
    const finalStudentId = user.uid;
    
    const userProgressRef = doc(db, 'artifacts', appId, 'users', finalStudentId, 'data', 'progress');
    const publicProfileRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', finalStudentId);
    
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
      
      // Ejecutar checkLevelBadges AHORA
      if (checkLevelBadges) {
        checkLevelBadges();
      }
      
      // NAVEGAR AL DASHBOARD
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

      {/* --- FLUJO DE PANTALLAS --- */}

      {/* 1. LANDING PAGE (Portada) - Solo si no hay usuario y estamos en vista 'landing' */}
      {!user && view === 'landing' && (
        <LandingPage onStart={() => setView('auth')} />
      )}

      {/* 2. AUTH SCREEN (Login/Registro) - Solo si no hay usuario y le dio a empezar */}
      {!user && view === 'auth' && (
        <AuthScreen onLogin={() => setView('welcome')} />
      )}
      
      {/* 3. BIENVENIDA (Con Logout conectado) */}
      {user && view === 'welcome' && (
        <WelcomeScreen 
          onContinue={() => setView('avatar')} 
          onLogout={handleLogout} 
        />
      )}

      {/* 4. AVATARES */}
      {user && view === 'avatar' && <AvatarCustomization onComplete={(gender) => setView(gender === 'male' ? 'male-customization' : gender === 'female' ? 'female-customization' : 'avatar')} />}
      {user && view === 'male-customization' && <MaleCharacterCustomization onComplete={(avatar) => { setSelectedAvatar(avatar); setView('avatar-entrance'); }} onBack={() => setView('avatar')} />}
      {user && view === 'female-customization' && <FemaleCharacterCustomization onComplete={(avatar) => { setSelectedAvatar(avatar); setView('avatar-entrance'); }} onBack={() => setView('avatar')} />}
      
      {/* 5. INTRO VIDEO */}
      {user && view === 'avatar-entrance' && selectedAvatar && (
        <>
          <AvatarEntrance avatar={selectedAvatar} onComplete={() => setShowHospitalVideo(true)} />
          {showHospitalVideo && <HospitalVideoIntro onComplete={() => { setShowHospitalVideo(false); setView('dashboard'); }} />}
        </>
      )}
      
      {/* 6. DASHBOARD */}
      {user && view === 'dashboard' && (
        <Dashboard user={user} userData={userData} setView={setView} setLevel={setCurrentLevel} setShowElevatorDoors={setShowElevatorDoors} />
      )}

      {/* 7. JUEGO */}
      {user && view === 'game' && currentLevel && !showElevatorDoors && (
        <GameLevel 
          topic={currentLevel} 
          user={user}
          userData={userData}
          studentId={user.uid}
          onExit={() => { setCurrentLevel(null); setView('dashboard'); }}
          onComplete={handleLevelComplete}
        />
      )}
      
      {/* 8. RANKING */}
      {user && view === 'leaderboard' && <Leaderboard onBack={() => setView('dashboard')} />}
      
      {/* PANTALLA PROFESOR */}
      {view === 'brainstorm_host' && (
        <BrainstormHost onBack={() => setView(user ? 'dashboard' : 'landing')} />
      )}

      {/* PANTALLA ALUMNO */}
      {view === 'brainstorm_join' && (
        <BrainstormJoin onBack={() => setView(user ? 'dashboard' : 'landing')} />
      )}

    </div>
  );
}
