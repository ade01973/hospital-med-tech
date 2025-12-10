import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ChevronRight, HeartPulse, UserPlus, LogIn } from 'lucide-react';
import hospitalBg from '../assets/hospital-background.png';
import { auth, db, appId } from '../firebase.js';

const AuthScreen = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      
      let user;

      if (isRegistering) {
        // --- MODO REGISTRO (NUEVO USUARIO) ---
        if (!name.trim()) throw new Error("Por favor, introduce tu Nombre de Agente.");
        
        // Crea el usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;

        // Crea su ficha en la base de datos (Firestore)
        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', user.uid);
        await setDoc(userRef, {
          displayName: name,
          uid: user.uid,
          email: email,
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
          totalScore: 0,
          money: 0,
          completedLevels: {}
        });

      } else {
        // --- MODO LOGIN (USUARIO EXISTENTE) ---
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        
        // Actualizamos su última conexión
        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', user.uid);
        await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true });
      }

      // Guardamos el ID en el navegador y entramos
      localStorage.setItem('studentId', user.uid);
      onLogin();

    } catch (err) {
      console.error(err);
      // Traducimos los errores de Firebase a español
      if (err.code === 'auth/email-already-in-use') setError('Este correo ya está registrado.');
      else if (err.code === 'auth/wrong-password') setError('Contraseña incorrecta.');
      else if (err.code === 'auth/user-not-found') setError('No existe cuenta con este correo.');
      else if (err.code === 'auth/weak-password') setError('La contraseña debe tener al menos 6 caracteres.');
      else if (err.code === 'auth/invalid-email') setError('El correo no es válido.');
      else setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative font-sans"
      style={{ backgroundImage: `url(${hospitalBg})`, backgroundSize: 'cover' }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="bg-slate-900/95 p-8 rounded-3xl max-w-md w-full text-center relative z-10 border border-slate-700 shadow-2xl animate-fade-in">
        <HeartPulse className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-black text-white mb-2">NURSE MANAGER</h1>
        <p className="text-slate-400 text-sm mb-6 font-bold uppercase tracking-widest">
          {isRegistering ? 'CREAR NUEVA CUENTA' : 'ACCESO DE PERSONAL'}
        </p>
        
        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm font-bold border border-red-500/50">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Campo de nombre (solo visible si te registras) */}
          {isRegistering && (
            <input
              type="text"
              placeholder="Tu Nombre de Agente"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 bg-black/40 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 outline-none transition-colors"
              required
            />
          )}

          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-black/40 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 outline-none transition-colors"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-black/40 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 outline-none transition-colors"
            required
          />

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold p-4 rounded-xl flex justify-center items-center gap-2 transition-all transform hover:-translate-y-1"
          >
            {loading ? 'Conectando...' : (isRegistering ? 'REGISTRARME Y ENTRAR' : 'INICIAR SESIÓN')}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center justify-center gap-2 w-full transition-colors"
          >
            {isRegistering ? (
              <>¿Ya tienes cuenta? Inicia Sesión <LogIn className="w-4 h-4" /></>
            ) : (
              <>¿Eres nuevo? Crea tu cuenta aquí <UserPlus className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
