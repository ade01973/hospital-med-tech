import React, { useState } from 'react';
import { signInAnonymously, signInWithCustomToken, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ChevronRight, HeartPulse, Save, Trash2, ArrowRight, AlertTriangle } from 'lucide-react';
import hospitalBg from '../assets/hospital-background.png';
import { auth, db, appId } from '../firebase.js';

const AuthScreen = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentUid, setCurrentUid] = useState(null);

  const performLogin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);

      try {
        await signInAnonymously(auth);
      } catch (anonError) {
        console.warn("Fallo en login anónimo, intentando custom token si existe...", anonError);
        if (typeof window !== 'undefined' && window.__initial_auth_token) {
           await signInWithCustomToken(auth, window.__initial_auth_token);
        } else {
           throw anonError;
        }
      }

      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        setCurrentUid(uid);
        localStorage.setItem('studentId', uid);

        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists() && docSnap.data().totalScore > 0) {
          setUserData(docSnap.data());
          setShowDecision(true);
          setLoading(false);
          return;
        }

        await setDoc(userRef, {
          displayName: name,
          uid,
          lastActive: serverTimestamp(),
          totalScore: 0
        }, { merge: true });
      }

      onLogin();
    } catch (error) {
      console.error("Error auth completo:", error);
      handleErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', currentUid);
      await setDoc(userRef, {
        displayName: name,
        lastActive: serverTimestamp()
      }, { merge: true });

      onLogin();
    } catch (error) {
      console.error("Error al continuar:", error);
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("⚠️ ¿ESTÁS SEGURO?\n\nSe borrará todo tu progreso (dinero, niveles, empleados). Esta acción es irreversible.")) {
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', currentUid);
      await setDoc(userRef, {
        displayName: name,
        uid: currentUid,
        lastActive: serverTimestamp(),
        totalScore: 0,
        completedLevels: {},
        money: 0
      });

      onLogin();
    } catch (error) {
      console.error("Error al resetear:", error);
      setLoading(false);
    }
  };

  const handleErrors = (error) => {
    if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/configuration-not-found') {
      alert("⚠️ ERROR DE CONFIGURACIÓN FIREBASE:\n\nEl acceso 'Anónimo' no está habilitado.");
    } else if (error.code === 'auth/api-key-not-valid') {
      alert("⚠️ ERROR DE CLAVE API:\n\nLa API Key no es válida.");
    } else {
      alert("Error al conectar: " + error.message);
    }
  };

  if (showDecision) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans"
        style={{
          backgroundImage: `url(${hospitalBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-0"></div>

        <div className="relative z-10 w-full max-w-4xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              CONFLICTO DE DATOS DETECTADO
            </h1>
            <p className="text-slate-300 mt-2 text-lg">Se ha encontrado un perfil de gestión activo para este dispositivo.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div
              onClick={!loading ? handleContinue : null}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/50 hover:border-cyan-400 rounded-3xl p-8 cursor-pointer transform hover:scale-[1.02] transition-all shadow-2xl hover:shadow-cyan-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <HeartPulse className="w-32 h-32 text-cyan-400" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="bg-cyan-500/20 p-3 rounded-xl">
                  <Save className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">CONTINUAR</h2>
              </div>

              <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/5 space-y-2">
                <p className="text-slate-400 text-sm">Nombre: <span className="text-white font-bold">{userData?.displayName}</span></p>
                <p className="text-slate-400 text-sm">Puntuación: <span className="text-green-400 font-bold">{userData?.totalScore} XP</span></p>
              </div>

              <button disabled={loading} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors uppercase tracking-widest shadow-lg">
                {loading ? 'Cargando...' : <>Recuperar Gestión <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>

            <div
              onClick={!loading ? handleReset : null}
              className="group bg-gradient-to-br from-red-900/40 to-slate-900 border-2 border-red-500/30 hover:border-red-500 rounded-3xl p-8 cursor-pointer transform hover:scale-[1.02] transition-all shadow-2xl hover:shadow-red-500/20 relative overflow-hidden grayscale hover:grayscale-0"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertTriangle className="w-32 h-32 text-red-500" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-500/20 p-3 rounded-xl">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-white group-hover:text-red-400 transition-colors">NUEVA PARTIDA</h2>
              </div>

              <div className="bg-red-500/10 rounded-xl p-4 mb-6 border border-red-500/20">
                <p className="text-red-200 text-sm font-medium leading-relaxed">
                  ⚠️ Acción Destructiva. Se borrará permanentemente todo el progreso actual y empezarás desde cero.
                </p>
              </div>

              <button disabled={loading} className="w-full py-4 bg-transparent border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest">
                {loading ? 'Reiniciando...' : 'Borrar y Empezar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${hospitalBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 transform rotate-6 hover:rotate-12 transition-all duration-500">
          <HeartPulse className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">NURSE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">MANAGER</span></h1>
        <p className="text-slate-400 mb-8 text-sm uppercase tracking-widest font-bold">Simulador de Gestión Sanitaria</p>

        <form onSubmit={performLogin} className="space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Introduce tu ID de Agente..."
              className="relative w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-center font-bold tracking-wide"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
          >
            {loading ? 'Iniciando Sistema...' : <>Entrar al Sistema <ChevronRight className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
