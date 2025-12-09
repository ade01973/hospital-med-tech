import React, { useState } from 'react';
import { signInAnonymously, signInWithCustomToken, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, query, where, serverTimestamp, writeBatch } from 'firebase/firestore';
import { ChevronRight, HeartPulse, RefreshCw } from 'lucide-react';
import hospitalBg from '../assets/hospital-background.png';
import { auth, db, appId } from '../firebase.js';

const AuthScreen = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setStatusMsg('Conectando con el servidor...');

    try {
      await setPersistence(auth, browserLocalPersistence);
      
      // 1. Autenticación (Genera un UID, nuevo o existente)
      let userCredential;
      try {
        userCredential = await signInAnonymously(auth);
      } catch (anonError) {
        if (typeof window !== 'undefined' && window.__initial_auth_token) {
           userCredential = await signInWithCustomToken(auth, window.__initial_auth_token);
        } else {
           throw anonError;
        }
      }

      if (auth.currentUser) {
        const currentUid = auth.currentUser.uid;
        const profilesRef = collection(db, 'artifacts', appId, 'public', 'data', 'profiles');
        const userDocRef = doc(profilesRef, currentUid);

        // 2. Buscar si ya existe este UID (por si es una reconexión sin haber cerrado sesión del todo)
        const currentDocSnap = await getDoc(userDocRef);

        if (currentDocSnap.exists()) {
           // El usuario ya existe en este UID, solo actualizamos última conexión
           setStatusMsg('Perfil encontrado. Accediendo...');
           await setDoc(userDocRef, { lastActive: serverTimestamp() }, { merge: true });
        } else {
          // 3. CASO CRÍTICO: UID nuevo (Logout previo). Buscamos por NOMBRE (ID de Agente) para recuperar datos
          setStatusMsg('Buscando historial de agente...');
          
          // Buscamos cualquier perfil que tenga el mismo nombre que se acaba de introducir
          const q = query(profilesRef, where("displayName", "==", name.trim()));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // ¡ENCONTRADO! Recuperamos los datos antiguos
            setStatusMsg('¡Agente reconocido! Recuperando datos...');
            const oldDoc = querySnapshot.docs[0]; // Tomamos el primero que coincida
            const oldData = oldDoc.data();

            // 4. MIGRACIÓN: Copiamos los datos antiguos al NUEVO UID
            // Importante: NO ponemos totalScore: 0 aquí para no borrar el progreso
            await setDoc(userDocRef, {
              ...oldData, // Copiamos todo (niveles, dinero, experiencia...)
              uid: currentUid, // Actualizamos al nuevo UID técnico
              lastActive: serverTimestamp(),
              isRecovered: true // Marca para saber que fue recuperado
            });

            // Opcional: Borrar el doc antiguo para no dejar basura, 
            // pero mejor dejarlo por seguridad o marcarlo como 'migrated'
            // await deleteDoc(oldDoc.ref); 

          } else {
            // 5. USUARIO TOTALMENTE NUEVO
            setStatusMsg('Creando nuevo perfil de agente...');
            await setDoc(userDocRef, {
              displayName: name.trim(),
              uid: currentUid,
              lastActive: serverTimestamp(),
              totalScore: 0, // Solo aquí ponemos 0
              money: 0,
              completedLevels: {} 
            });
          }
        }
        
        localStorage.setItem('studentId', currentUid);
      }
      
      setStatusMsg('¡Acceso concedido!');
      setTimeout(() => onLogin(), 500); // Pequeña pausa para leer el mensaje

    } catch (error) {
      console.error("Error auth completo:", error);
      handleErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const handleErrors = (error) => {
    if (error.code === 'auth/operation-not-allowed') {
      alert("⚠️ ERROR: Habilita 'Anonymous Auth' en Firebase Console.");
    } else {
      alert("Error de conexión: " + error.message);
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
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10 animate-fade-in">
        
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 transform hover:rotate-12 transition-all duration-500">
          <HeartPulse className="w-10 h-10 text-white animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter drop-shadow-lg">
          NURSE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">MANAGER</span>
        </h1>
        <p className="text-slate-400 mb-8 text-xs uppercase tracking-[0.2em] font-bold">Simulador de Gestión Sanitaria</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="INTRODUCE TU ID DE AGENTE"
              className="relative w-full px-5 py-4 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-center font-bold tracking-widest uppercase transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white hover:bg-cyan-50 text-slate-900 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                {statusMsg || 'Conectando...'}
              </>
            ) : (
              <>
                Entrar al Sistema <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Nota informativa */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-slate-500 text-xs">
            ⚠️ <span className="font-bold text-slate-400">IMPORTANTE:</span> Usa siempre el mismo <span className="text-cyan-400">ID DE AGENTE</span> para recuperar tu progreso si cierras sesión.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthScreen;
