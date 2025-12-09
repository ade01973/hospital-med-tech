import React, { useEffect, useState } from 'react';
import hospitalEntranceBg from '../assets/hospital-entrance.png'; 

const AvatarEntrance = ({ avatar, onComplete }) => {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    setDebugInfo({
      receivedAvatar: avatar,
      rawGender: avatar?.gender,
      rawPreset: avatar?.characterPreset,
    });
  }, [avatar]);

  // TEST DIRECTO: Esto salta toda la lógica y apunta directo al archivo
  // Si esto no se ve, el problema es la carpeta, no el código.
  const testImageMale = "/avatar/male-character-1.png";
  const testImageFemale = "/avatar/female-character-1.png";

  return (
    <div 
      className="fixed inset-0 z-[999] bg-slate-800 flex flex-col items-center justify-center text-white overflow-auto p-10"
      style={{ backgroundImage: `url(${hospitalEntranceBg})`, backgroundSize: 'cover' }}
    >
      <div className="bg-black/80 p-6 rounded-xl border-2 border-red-500 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-red-400 mb-4">🔧 MODO DIAGNÓSTICO</h2>
        
        {/* 1. VER LOS DATOS */}
        <div className="mb-6">
          <h3 className="font-bold text-yellow-300">1. Datos Recibidos (prop 'avatar'):</h3>
          <pre className="bg-gray-900 p-2 rounded text-xs overflow-x-auto border border-gray-700">
            {avatar ? JSON.stringify(avatar, null, 2) : "❌ AVATAR ES NULL / UNDEFINED"}
          </pre>
        </div>

        {/* 2. PRUEBA DE IMAGEN DIRECTA */}
        <div className="mb-6">
          <h3 className="font-bold text-yellow-300 mb-2">2. Prueba de archivos (Rutas directas):</h3>
          <p className="text-sm mb-2">Si no ves las imágenes de abajo, la carpeta <code>public/avatar</code> está mal ubicada o nombrada.</p>
          
          <div className="flex gap-4 justify-center bg-white/10 p-4 rounded">
            <div className="text-center">
              <p className="text-xs mb-1">male-character-1.png</p>
              <img 
                src={testImageMale} 
                alt="Test Male" 
                className="w-20 h-20 object-contain bg-white rounded"
                onError={(e) => e.target.style.border = "4px solid red"} 
              />
            </div>
            <div className="text-center">
              <p className="text-xs mb-1">female-character-1.png</p>
              <img 
                src={testImageFemale} 
                alt="Test Female" 
                className="w-20 h-20 object-contain bg-white rounded"
                onError={(e) => e.target.style.border = "4px solid red"}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={onComplete}
          className="mt-4 bg-blue-600 px-6 py-2 rounded hover:bg-blue-500 w-full"
        >
          Cerrar Diagnóstico
        </button>
      </div>
    </div>
  );
};

export default AvatarEntrance;
