import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // 🔥 Importamos signOut
import { doc, setDoc, onSnapshot, serverTimestamp, increment } from 'firebase/firestore';
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
  const [view, setView] = useState('auth');
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentFloor, setCurrentFloor] = useState(-1);
  const [showElevatorDoors, setShowElevatorDoors] = useState(false);
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

  // --- 🔥 NUEVA FUNCIÓN DE LIMPIEZA TOTAL (LOGOUT) ---
  const handleLogout = async () => {
    try {
      // 1. Desconectar de Firebase
      await signOut(auth);
      
      // 2. Borrar huella local (localStorage)
      localStorage.removeItem('studentId');

      // 3. LIMPIAR TODOS LOS ESTADOS (La "Escoba")
      setUser(null);
      setUserData(null);
      setSelectedAvatar(null); // Importante: olvidar el avatar anterior
      setCurrentLevel(null);
      setRewardNotification(null);
      
      // 4. Volver a la pantalla de Auth
      setView('auth');
      
      console.log("🧹 Sesión cerrada y memoria limpiada correctamente.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  // -----------------------------------------------------

  // 🔵 DETECTAR LOGIN Y CAMBIOS DE AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log('Auth state changed:', u ? 'Usuario logueado' : 'Sin usuario');
      if (u && !user) {
        console.log('✓ Nuevo login detectado, ir a bienvenida');
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
    // ... (Tu código de guardar nivel sigue igual) ...
    // (He abreviado esta parte para no ocupar tanto espacio, 
    //  pero tú déjala como la tenías en tu archivo original)
    console.log(`📊 Level complete: ${levelId}`);
    // ... lógica de guardado ...
     if (!user) return;
     // ...
     // Simulación del final para navegar:
      setTimeout(() => {
        console.log('➡️ Navegando a dashboard');
        setCurrentLevel(null);
        setView('dashboard');
      }, 500);
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

      {/* 🔥 AQUÍ ESTÁN LOS CAMBIOS EN EL RENDERIZADO:
         1. En AuthScreen pasamos setView('welcome')
         2. En WelcomeScreen pasamos onLogout={handleLogout}
      */}

      {!user && <AuthScreen onLogin={() => setView('welcome')} />}
      
      {user && view === 'welcome' && (
        <WelcomeScreen 
          onContinue={() => setView('avatar')} 
          onLogout={handleLogout}  /* 🔥 AQUÍ CONECTAMOS LA LIMPIEZA */
        />
      )}

      {user && view === 'avatar' && <AvatarCustomization onComplete={(gender) => setView(gender === 'male' ? 'male-customization' : gender === 'female' ? 'female-customization' : 'avatar')} />}
      
      {user && view === 'male-customization' && <MaleCharacterCustomization onComplete={(avatar) => { setSelectedAvatar(avatar); setView('avatar-entrance'); }} onBack={() => setView('avatar')} />}
      
      {user && view === 'female-customization' && <FemaleCharacterCustomization onComplete={(avatar) => { setSelectedAvatar(avatar); setView('avatar-entrance'); }} onBack={() => setView('avatar')} />}
      
      {user && view === 'avatar-entrance' && selectedAvatar && (
        <>
          <AvatarEntrance avatar={selectedAvatar} onComplete={() => setShowHospitalVideo(true)} />
          {showHospitalVideo && <HospitalVideoIntro onComplete={() => { setShowHospitalVideo(false); setView('dashboard'); }} />}
        </>
      )}
      
      {/* 🔥 En el Dashboard también podrías necesitar el logout si pones un botón de salir allí */}
      {user && view === 'dashboard' && (
        <Dashboard 
           user={user} 
           userData={userData} 
           setView={setView} 
           setLevel={setCurrentLevel} 
           setShowElevatorDoors={setShowElevatorDoors} 
        />
      )}

      {user && view === 'game' && currentLevel && !showElevatorDoors && (
        <GameLevel 
          topic={currentLevel} 
          user={user}
          userData={userData}
          studentId={userData?.studentId || localStorage.getItem('studentId')}
          onExit={() => { setCurrentLevel(null); setView('dashboard'); }}
          onComplete={handleLevelComplete}
        />
      )}
      
      {user && view === 'leaderboard' && <Leaderboard onBack={() => setView('dashboard')} />}
    </div>
  );
}
