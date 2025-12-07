import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import avatarCreationBg from "../assets/avatar-creation-bg.png";
import useBackgroundMusic from "../hooks/useBackgroundMusic";
import { getCharacterImage } from "../lib/avatarAssets";

const FEMALE_CHARACTERS = [
  { id: 1, name: "Gestora Joven Rubia", type: "cabello", variant: "blonde-short" },
  { id: 2, name: "Gestora Morena", type: "cabello", variant: "brown-curly" },
  { id: 3, name: "Gestora Afrodescendiente", type: "cabello", variant: "black-afro" },
  { id: 4, name: "Gestora Pelirroja", type: "cabello", variant: "red-wavy" },
  { id: 5, name: "Gestora Senior Rubia", type: "cabello", variant: "gray-short" },
  { id: 6, name: "Gestora con Trenzas", type: "cabello", variant: "black-braids" },
  { id: 7, name: "Gestora Profesional", type: "cabello", variant: "red-medium" },
  { id: 8, name: "Gestora Ejecutiva Rubia", type: "cabello", variant: "blonde-ponytail" },
  { id: 9, name: "Gestora Clínica Rizada", type: "cabello", variant: "brown-curly-short" },
  { id: 10, name: "Gestora Senior Afrodescendiente", type: "cabello", variant: "gray-short-alt" },
  { id: 11, name: "Gestora Negra Cabello Corto", type: "cabello", variant: "black-short" },
  { id: 12, name: "Gestora Cabello Azul Rizado", type: "cabello", variant: "blue-curly" },
  { id: 13, name: "Gestora Cabello Morado", type: "cabello", variant: "purple-curly" },
  { id: 14, name: "Gestora Trenzas Doradas", type: "cabello", variant: "blonde-braids" },
  { id: 15, name: "Gestora Cabello Verde", type: "cabello", variant: "green-wavy" },
  { id: 16, name: "Gestora Pelirroja Larga", type: "cabello", variant: "red-long" },
  { id: 17, name: "Gestora Negra Moño", type: "cabello", variant: "black-bun" },
  { id: 18, name: "Gestora Cabello Arcoíris", type: "cabello", variant: "rainbow-wavy" },
  { id: 19, name: "Gestora Rubio Corto", type: "cabello", variant: "blonde-very-short" },
  { id: 20, name: "Gestora Trenzas Grises", type: "cabello", variant: "gray-braids" },
  { id: 21, name: "Gestora Negra Senior", type: "cabello", variant: "black-senior" },
  { id: 22, name: "Gestora Pelirroja Trenzas", type: "cabello", variant: "red-braids" },
  { id: 23, name: "Gestora Rizada Dorada", type: "cabello", variant: "blonde-curly" },
  { id: 24, name: "Gestora Azul Turquesa", type: "cabello", variant: "teal-short" },
  { id: 25, name: "Gestora Blanca Larga", type: "cabello", variant: "white-long" },
  { id: 26, name: "Gestora Morena Rizada", type: "cabello", variant: "brown-curly-long" },
  { id: 27, name: "Gestora Gris Trenzas", type: "cabello", variant: "gray-braids-long" },
  { id: 28, name: "Gestora Naranja Larga", type: "cabello", variant: "orange-wavy" },
  { id: 29, name: "Gestora Morada Rizada", type: "cabello", variant: "purple-curly-short" },
  { id: 30, name: "Gestora Gris Cabello Corto", type: "cabello", variant: "gray-very-short" },
  { id: 31, name: "Gestora Pelirroja Larga Ondulada", type: "cabello", variant: "red-long-wavy" },
  { id: 32, name: "Gestora Negra Senior Blanca", type: "cabello", variant: "black-white-senior" },
  { id: 33, name: "Gestora Negra Corte Pixie", type: "cabello", variant: "black-pixie" },
  { id: 34, name: "Gestora Negra Trenzas Recogidas", type: "cabello", variant: "black-braids-updo" },
  { id: 35, name: "Gestora Platino Pixie Corto", type: "cabello", variant: "platinum-pixie" },
  { id: 36, name: "Gestora Rubia Miel Larga", type: "cabello", variant: "honey-blonde-long" },
  { id: 37, name: "Gestora Negra Rizado Largo", type: "cabello", variant: "black-curly-long" },
  { id: 38, name: "Gestora Pelirroja Liso Largo", type: "cabello", variant: "red-straight-long" },
  { id: 39, name: "Gestora Negra Afro Volumen", type: "cabello", variant: "black-afro-volume" },
  { id: 40, name: "Gestora Pelirroja Corte Pixie", type: "cabello", variant: "red-pixie-wavy" },
  { id: 41, name: "Gestora Rubia Ondulada Flequillo", type: "cabello", variant: "blonde-wavy-bangs" },
  { id: 42, name: "Gestora Morena Trenzas", type: "cabello", variant: "brown-braids" },
  { id: 43, name: "Gestora Negra Cabello Ultrashort", type: "cabello", variant: "black-ultrashort" },
  { id: 44, name: "Gestora Negra Natural", type: "cabello", variant: "black-natural" },
  { id: 45, name: "Gestora Morena Rizada Volumen", type: "cabello", variant: "brown-curly-volume" },
  { id: 46, name: "Gestora Negra Dreadlocks Morado", type: "cabello", variant: "black-dreadlocks-purple" },
  { id: 47, name: "Gestora Pelirroja Liso Suelto", type: "cabello", variant: "red-straight-loose" },
  { id: 48, name: "Gestora Pelirroja Corte Boyish", type: "cabello", variant: "red-boyish-cut" },
  { id: 49, name: "Gestora Negra Afro Natural", type: "cabello", variant: "black-afro-natural" },
  { id: 50, name: "Gestora Negra Rizado Afro", type: "cabello", variant: "black-afro-curly" },
  { id: 51, name: "Gestora Rubia Bob", type: "cabello", variant: "blonde-bob" },
  { id: 52, name: "Gestora Morena Corte Corto", type: "cabello", variant: "brown-short-cut" },
  { id: 53, name: "Gestora Pelirroja Ondulada", type: "cabello", variant: "orange-wavy-long" },
  { id: 54, name: "Gestora Morena Ondulada", type: "cabello", variant: "brown-wavy-long" },
  { id: 55, name: "Gestora Platino Gris Coleta", type: "cabello", variant: "platinum-gray-ponytail" },
  { id: 56, name: "Gestora Pelirroja Rizada", type: "cabello", variant: "red-curly-full" },
  { id: 57, name: "Gestora Negra Dreadlocks", type: "cabello", variant: "black-dreadlocks" },
  { id: 58, name: "Gestora Plata Senior", type: "cabello", variant: "silver-senior" },
];

const CHARACTER_CATEGORIES = {
  "Todas las Gestoras": FEMALE_CHARACTERS,
};

export default function FemaleCharacterCustomization({ onComplete, onBack }) {
  const [selectedCharacter, setSelectedCharacter] = useState(1);
  const playerAvatar = JSON.parse(localStorage.getItem('playerAvatar') || '{}');

  // Música de fondo ambiental en avatar
  useBackgroundMusic(true);

  const handleSelectCharacter = (id) => {
    setSelectedCharacter(id);
  };

  const handleConfirm = () => {
    if (!playerAvatar.name || !playerAvatar.name.trim()) {
      alert("Por favor ingresa un nombre para tu gestora enfermera");
      return;
    }

    const selectedChar = FEMALE_CHARACTERS.find(c => c.id === selectedCharacter);
    const updatedAvatar = {
      ...playerAvatar,
      gender: 'female',
      characterPreset: selectedCharacter,
      characterType: selectedChar.type,
      characterVariant: selectedChar.variant,
    };
    localStorage.setItem('playerAvatar', JSON.stringify(updatedAvatar));
    onComplete(updatedAvatar);
  };

  const selectedChar = FEMALE_CHARACTERS.find(c => c.id === selectedCharacter);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${avatarCreationBg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Personaliza tu Gestora Enfermera</h1>
          <p className="text-center text-cyan-400 font-semibold">
            Elige tu tipo de cabello y accesorios
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Preview */}
          <div className="flex flex-col items-center justify-center lg:col-span-1">
            <div className="border-4 border-cyan-500/50 rounded-3xl p-6 bg-slate-800/50 w-full max-w-xs">
              <img
                src={getCharacterImage("female", selectedCharacter)}
                alt={selectedChar?.name}
                className="w-full h-auto rounded-2xl transition-all duration-300"
              />
            </div>
            <p className="text-white font-black text-lg mt-4">{selectedChar?.name}</p>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2 space-y-6 max-h-96 overflow-y-auto">
            {Object.entries(CHARACTER_CATEGORIES).map(([category, characters]) => (
              <div key={category}>
                <h3 className="text-cyan-400 font-black text-sm uppercase tracking-wider mb-3 px-2">
                  {category}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {characters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => handleSelectCharacter(char.id)}
                      className={`p-2 rounded-xl transition-all duration-300 border-2 flex flex-col items-center gap-1 ${
                        selectedCharacter === char.id
                          ? "border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,200,255,0.4)]"
                          : "border-slate-700 bg-slate-800/40 hover:border-cyan-300"
                      }`}
                    >
                      <img
                        src={getCharacterImage("female", char.id)}
                        alt={char.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="text-xs text-white font-bold text-center line-clamp-1">
                        {char.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-black py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <ChevronLeft className="w-5 h-5" /> Volver
          </button>
          <button
            onClick={handleConfirm}
            disabled={!playerAvatar.name || !playerAvatar.name.trim()}
            className={`flex-1 font-black py-4 rounded-xl transition-all transform flex items-center justify-center gap-2 uppercase tracking-widest ${
              !playerAvatar.name || !playerAvatar.name.trim()
                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-cyan-50 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1"
            }`}
          >
            Al Dashboard <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
