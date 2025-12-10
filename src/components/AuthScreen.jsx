import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail, 
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ChevronRight, HeartPulse, UserPlus, LogIn, KeyRound } from 'lucide-react';
import hospitalBg from '../assets/hospital-background.png';
import { auth, db, appId } from '../firebase.js';

const AuthScreen = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      
      let user;

      if (isRegistering) {
        // --- REGISTRO (Solo Email + Pass) ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;

        // Crear ficha vacía (El nombre/avatar se pondrá después)
        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: email,
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
          totalScore: 0,
          money: 0,
          completedLevels: {}
        });

      } else {
        // --- LOGIN ---
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        
        // Actualizar fecha
        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', user.uid);
        await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true });
      }

      localStorage.setItem('studentId', user.uid);
      onLogin();

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') setError('Este correo ya tiene cuenta.');
      else if (err.code === 'auth/wrong-password') setError('Contraseña incorrecta.');
      else if (err.code === 'auth/user-not-found') setError('No existe cuenta con este correo.');
      else if (err.code === 'auth/weak-password') setError('La contraseña es muy corta (mínimo 6).');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Escribe tu correo arriba para enviarte el enlace.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setInfoMsg(`✅ Enlace enviado a ${email}. Revisa tu correo.`);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative font-sans"
      style={{ backgroundImage: `url(${hospitalBg})`, backgroundSize: 'cover' }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      <div className="bg-slate-900/90 p-8 rounded-3xl max-w-md w-full text-center relative z-10 border border-slate-700 shadow-2xl animate-fade-in">
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-cyan-500/10 rounded-full ring-2 ring-cyan-500/50">
            <HeartPulse className="w-12 h-12 text-cyan-400" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">NURSE MANAGER</h1>
        
        {/* PESTAÑAS SUPERIORES PARA CAMBIAR MODO */}
        <div className="flex p-1 bg-black/40 rounded-xl mb-6">
          <button
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isRegistering ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            INICIAR SESIÓN
          </button>
          <button
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isRegistering ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            CREAR CUENTA
          </button>
        </div>
        
        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm font-bold border border-red-500/50">⚠️ {error}</div>}
        {infoMsg && <div className="bg-green-500/20 text-green-200 p-3 rounded-lg mb-4 text-sm font-bold border border-green-500/50">{infoMsg}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-slate-400 ml-1">CORREO ELECTRÓNICO</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-black/40 border border-slate-600 rounded-xl text-white placeholder-slate-600 focus:border-cyan-500 outline-none transition-colors"
              placeholder="nombre@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-slate-400 ml-1">CONTRASEÑA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-black/40 border border-slate-600 rounded-xl text-white placeholder-slate-600 focus:border-cyan-500 outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black p-4 rounded-xl flex justify-center items-center gap-2 transition-all transform hover:scale-[1.02] mt-4 shadow-lg shadow-cyan-500/20"
          >
            {loading ? 'PROCESANDO...' : (isRegistering ? '¡REGISTRARME GRATIS!' : 'ENTRAR AL HOSPITAL')}
          </button>
        </form>

        {!isRegistering && (
          <button
            type="button"
            onClick={handleResetPassword}
            className="mt-6 text-slate-400 hover:text-white text-xs flex items-center justify-center gap-1 w-full transition-colors"
          >
            <KeyRound className="w-3 h-3" /> He olvidado mi contraseña
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
