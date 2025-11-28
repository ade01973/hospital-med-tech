import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import avatarCreationBg from "../assets/avatar-creation-bg.png";

const MALE_CHARACTERS = [
  { id: 1, name: "Gestor Joven", type: "hair", variant: "brown-short" },
  { id: 2, name: "Gestor Rubio", type: "hair", variant: "blonde-short" },
  { id: 3, name: "Gestor Mayor", type: "hair", variant: "gray-short" },
  { id: 4, name: "Gestor Profesional", type: "hair", variant: "blonde-medium" },
  { id: 5, name: "Gestor Pelirrojo", type: "hair", variant: "red-medium" },
  { id: 6, name: "Gestor Calvo", type: "hair", variant: "bald" },
  { id: 7, name: "Gestor con Barba", type: "beard", variant: "goatee" },
  { id: 8, name: "Gestor Administrativo", type: "hair", variant: "black-long" },
  { id: 9, name: "Gestor Joven Moreno", type: "hair", variant: "black-medium" },
  { id: 10, name: "Gestor Moderno", type: "hair", variant: "brown-medium" },
  { id: 11, name: "Gestor Documentalista", type: "accessory", variant: "clipboard-green" },
  { id: 12, name: "Gestor Registrador", type: "accessory", variant: "clipboard-yellow" },
  { id: 13, name: "Gestor Investigador", type: "accessory", variant: "clipboard-purple" },
  { id: 14, name: "Gestor Especialista", type: "accessory", variant: "clipboard-orange" },
  { id: 15, name: "Gestor Ejecutivo", type: "accessory", variant: "clipboard-wood" },
  { id: 16, name: "Gestor de Emergencias", type: "accessory", variant: "clipboard-red" },
  { id: 17, name: "Gestor Afrodescendiente", type: "hair", variant: "dreadlocks" },
  { id: 18, name: "Gestor Joven Especialista", type: "hair", variant: "red-short" },
  { id: 19, name: "Gestor Coordinador", type: "accessory", variant: "clipboard-gray" },
  { id: 20, name: "Gestor con Barba Completa", type: "beard", variant: "full-goatee" },
  { id: 21, name: "Gestor Administrativo Senior", type: "accessory", variant: "clipboard-red-alt" },
  { id: 22, name: "Gestor Afrodescendiente Senior", type: "accessory", variant: "clipboard-yellow-alt" },
  { id: 23, name: "Gestor Cabello Largo", type: "hair", variant: "brown-long" },
  { id: 24, name: "Gestor Senior", type: "beard", variant: "full-beard-gray" },
];

const CHARACTER_CATEGORIES = {
  "Tipo de Cabello": MALE_CHARACTERS.filter(c => c.type === "hair"),
  "Barba": MALE_CHARACTERS.filter(c => c.type === "beard"),
  "Accesorios": MALE_CHARACTERS.filter(c => c.type === "accessory"),
};

export default function MaleCharacterCustomization({ onComplete, onBack }) {
  const [selectedCharacter, setSelectedCharacter] = useState(1);
  const playerAvatar = JSON.parse(localStorage.getItem('playerAvatar') || '{}');

  const handleSelectCharacter = (id) => {
    setSelectedCharacter(id);
  };

  const handleConfirm = () => {
    const selectedChar = MALE_CHARACTERS.find(c => c.id === selectedCharacter);
    const updatedAvatar = {
      ...playerAvatar,
      characterPreset: selectedCharacter,
      characterType: selectedChar.type,
      characterVariant: selectedChar.variant,
    };
    localStorage.setItem('playerAvatar', JSON.stringify(updatedAvatar));
    onComplete();
  };

  const selectedChar = MALE_CHARACTERS.find(c => c.id === selectedCharacter);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${avatarCreationBg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Personaliza tu Gestor Enfermero</h1>
          <p className="text-center text-cyan-400 font-semibold">
            Elige tu tipo de cabello, barba y accesorios
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Preview */}
          <div className="flex flex-col items-center justify-center lg:col-span-1">
            <div className="border-4 border-cyan-500/50 rounded-3xl p-6 bg-slate-800/50 w-full max-w-xs">
              <img
                src={`/src/assets/male-characters/male-character-${selectedCharacter}.png`}
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
                        src={`/src/assets/male-characters/male-character-${char.id}.png`}
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
            className="flex-1 bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            Al Dashboard <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
