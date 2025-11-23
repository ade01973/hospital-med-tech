import React, { useState } from 'react';
import { signInAnonymously, signInWithCustomToken, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ChevronRight, HeartPulse } from 'lucide-react';
import hospitalBg from '../assets/hospital-background.png';
import { auth, db, appId } from '../firebase.js';

const AuthScreen = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
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
        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', auth.currentUser.uid);
        localStorage.setItem('studentId', auth.currentUser.uid);
        await setDoc(userRef, {
          displayName: name,
          uid: auth.currentUser.uid,
          lastActive: serverTimestamp(),
          totalScore: 0
        }, { merge: true });
      }
      
      onLogin();
    } catch (error) {
      console.error("Error auth completo:", error);
      if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/configuration-not-found') {
        alert("⚠️ ERROR DE CONFIGURACIÓN FIREBASE:\n\nEl acceso 'Anónimo' no está habilitado en tu consola de Firebase.");
      } else if (error.code === 'auth/api-key-not-valid') {
        alert("⚠️ ERROR DE CLAVE API:\n\nLa API Key no es válida.");
      } else {
        alert("Error al conectar: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
        
        <form onSubmit={handleLogin} className="space-y-4">
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
