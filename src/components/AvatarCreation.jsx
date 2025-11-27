import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const AvatarCreation = ({ onComplete, onLogout }) => {
  const [playerName, setPlayerName] = useState('');
  const [avatarData, setAvatarData] = useState({
    skin: 'light',
    hair: 'short',
    eyes: 'brown',
    mouth: 'smile',
    accessory: 'glasses',
  });

  const handleSelection = (category, value) => {
    setAvatarData(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleFinish = () => {
    if (!playerName.trim()) {
      alert('Por favor ingresa un nombre para tu avatar');
      return;
    }
    // Guardar avatar en localStorage con el nombre
    const fullAvatarData = {
      ...avatarData,
      name: playerName.trim()
    };
    localStorage.setItem('playerAvatar', JSON.stringify(fullAvatarData));
    onComplete();
  };

  const skinOptions = [
    { value: 'light', label: '👨', color: 'from-yellow-200 to-yellow-100' },
    { value: 'medium', label: '👨', color: 'from-orange-300 to-orange-200' },
    { value: 'dark', label: '👨', color: 'from-amber-700 to-amber-600' }
  ];

  const hairOptions = [
    { value: 'short', label: '短', emoji: '💇' },
    { value: 'long', label: '长', emoji: '💆' },
    { value: 'curly', label: '卷', emoji: '🤷' },
    { value: 'bald', label: '秃', emoji: '👴' }
  ];

  const eyeOptions = [
    { value: 'brown', label: 'Marrones', emoji: '👀' },
    { value: 'blue', label: 'Azules', emoji: '👀' },
    { value: 'green', label: 'Verdes', emoji: '👀' }
  ];

  const mouthOptions = [
    { value: 'smile', label: 'Sonrisa', emoji: '😊' },
    { value: 'serious', label: 'Serio', emoji: '😐' },
    { value: 'laugh', label: 'Risa', emoji: '😄' }
  ];

  const accessoryOptions = [
    { value: 'glasses', label: 'Gafas', emoji: '👓' },
    { value: 'sunglasses', label: 'Gafas Sol', emoji: '😎' },
    { value: 'none', label: 'Ninguno', emoji: '🚫' },
    { value: 'stethoscope', label: 'Estetoscopio', emoji: '🩺' }
  ];

  const getAvatarEmoji = () => {
    const mouthEmoji = {
      smile: '😊',
      serious: '😐',
      laugh: '😄'
    };
    return mouthEmoji[avatarData.mouth] || '😊';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full relative z-10">
        {/* Titulo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Crea tu Avatar</h1>
          <p className="text-cyan-400 font-bold">Personaliza tu perfil para el juego</p>
        </div>

        {/* Vista previa del avatar */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center text-8xl border-4 border-cyan-500/50 shadow-lg shadow-cyan-500/30">
            {getAvatarEmoji()}
          </div>
        </div>

        {/* Campo de nombre */}
        <div className="mb-6">
          <label className="text-white font-bold mb-2 block">📝 Tu nombre de jugador:</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ej: Dr. García, Enfermera Ana..."
            maxLength={30}
            className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-white placeholder-slate-400 rounded-lg focus:border-cyan-500 focus:outline-none font-bold text-lg transition-all"
          />
          <p className="text-slate-400 text-xs mt-1">{playerName.length}/30 caracteres</p>
        </div>

        {/* Selector de características */}
        <div className="space-y-6">
          {/* Piel */}
          <div>
            <p className="text-white font-bold mb-3">🎨 Tono de piel:</p>
            <div className="flex gap-3">
              {skinOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSelection('skin', option.value)}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all transform ${
                    avatarData.skin === option.value
                      ? `bg-gradient-to-br ${option.color} shadow-lg shadow-yellow-500/50 scale-105 border-2 border-yellow-300`
                      : 'bg-slate-700 text-slate-400 border-2 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cabello */}
          <div>
            <p className="text-white font-bold mb-3">💇 Cabello:</p>
            <div className="grid grid-cols-4 gap-3">
              {hairOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSelection('hair', option.value)}
                  className={`py-3 rounded-lg font-bold transition-all transform text-2xl ${
                    avatarData.hair === option.value
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50 scale-105 border-2 border-cyan-300'
                      : 'bg-slate-700 text-slate-400 border-2 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {option.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Ojos */}
          <div>
            <p className="text-white font-bold mb-3">👀 Ojos:</p>
            <div className="grid grid-cols-3 gap-3">
              {eyeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSelection('eyes', option.value)}
                  className={`py-3 rounded-lg font-bold transition-all transform ${
                    avatarData.eyes === option.value
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50 scale-105 border-2 border-cyan-300'
                      : 'bg-slate-700 text-slate-400 border-2 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Boca */}
          <div>
            <p className="text-white font-bold mb-3">😊 Expresión:</p>
            <div className="grid grid-cols-3 gap-3">
              {mouthOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSelection('mouth', option.value)}
                  className={`py-3 rounded-lg font-bold transition-all transform text-2xl ${
                    avatarData.mouth === option.value
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50 scale-105 border-2 border-cyan-300'
                      : 'bg-slate-700 text-slate-400 border-2 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {option.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Accesorios */}
          <div>
            <p className="text-white font-bold mb-3">✨ Accesorio:</p>
            <div className="grid grid-cols-4 gap-3">
              {accessoryOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSelection('accessory', option.value)}
                  className={`py-3 rounded-lg font-bold transition-all transform text-2xl ${
                    avatarData.accessory === option.value
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50 scale-105 border-2 border-cyan-300'
                      : 'bg-slate-700 text-slate-400 border-2 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {option.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3 mt-8">
          <button 
            onClick={handleFinish}
            className="w-full bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-base"
          >
            Confirmar Avatar <ChevronRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold py-3 rounded-xl transition-all border border-slate-700 uppercase tracking-widest text-xs"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreation;
