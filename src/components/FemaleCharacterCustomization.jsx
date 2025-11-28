import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import avatarCreationBg from "../assets/avatar-creation-bg.png";

const FEMALE_CHARACTERS = [
  { id: 1, name: "Gestora Joven", type: "hair", variant: "blonde-short" },
  { id: 2, name: "Gestora Morena", type: "hair", variant: "brown-curly" },
  { id: 3, name: "Gestora Afrodescendiente", type: "hair", variant: "black-afro" },
  { id: 4, name: "Gestora Pelirroja", type: "hair", variant: "red-wavy" },
  { id: 5, name: "Gestora Senior", type: "hair", variant: "gray-short" },
  { id: 6, name: "Gestora con Trenzas", type: "hair", variant: "black-braids" },
  { id: 7, name: "Gestora Profesional", type: "hair", variant: "red-medium" },
  { id: 8, name: "Gestora Ejecutiva", type: "hair", variant: "blonde-ponytail" },
  { id: 9, name: "Gestora Administrativo", type: "hair", variant: "brown-curly-short" },
  { id: 10, name: "Gestora Clínica", type: "hair", variant: "gray-short-alt" },
  { id: 11, name: "Gestora Sanitaria Joven", type: "accessory", variant: "clipboard-green" },
  { id: 12, name: "Gestora Registradora", type: "accessory", variant: "clipboard-yellow" },
  { id: 13, name: "Gestora Investigadora", type: "accessory", variant: "clipboard-purple" },
  { id: 14, name: "Gestora Especialista", type: "accessory", variant: "clipboard-orange" },
  { id: 15, name: "Gestora Ejecutiva Senior", type: "accessory", variant: "clipboard-wood" },
  { id: 16, name: "Gestora de Emergencias", type: "accessory", variant: "clipboard-red" },
  { id: 17, name: "Gestora Coordinadora", type: "accessory", variant: "clipboard-gray" },
  { id: 18, name: "Gestora Directiva", type: "accessory", variant: "clipboard-navy" },
  { id: 19, name: "Gestora Joven Ejecutiva", type: "accessory", variant: "clipboard-beige" },
  { id: 20, name: "Gestora Especialista Pelirroja", type: "accessory", variant: "clipboard-yellow-bright" },
  { id: 21, name: "Gestora Ejecutiva Rubia", type: "accessory", variant: "clipboard-purple-alt" },
  { id: 22, name: "Gestora Administrativo con Gafas", type: "accessory", variant: "clipboard-black" },
  { id: 23, name: "Gestora Sanitaria Joven Alt", type: "accessory", variant: "clipboard-green-alt" },
  { id: 24, name: "Gestora Ejecutiva Rubia Alt", type: "accessory", variant: "clipboard-red-bright" },
  { id: 25, name: "Gestora Senior con Gafas", type: "accessory", variant: "clipboard-navy-alt" },
  { id: 26, name: "Gestora Especialista Morena", type: "accessory", variant: "clipboard-gray-bright" },
  { id: 27, name: "Gestora Administrativo Senior", type: "accessory", variant: "clipboard-red-alt" },
  { id: 28, name: "Gestora Afrodescendiente Senior", type: "accessory", variant: "clipboard-yellow-alt" },
  { id: 29, name: "Gestora Profesional con Gafas", type: "accessory", variant: "clipboard-wood-alt" },
  { id: 30, name: "Gestora Afrodescendiente con Gafas", type: "accessory", variant: "clipboard-gray-alt" },
  { id: 31, name: "Gestora Clínica Afrodescendiente", type: "accessory", variant: "stethoscope-orange" },
  { id: 32, name: "Gestora Clínica Pelirroja", type: "accessory", variant: "stethoscope-yellow" },
  { id: 33, name: "Gestora Profesional Rubia", type: "accessory", variant: "stethoscope-purple" },
  { id: 34, name: "Gestora Senior Afrodescendiente", type: "accessory", variant: "stethoscope-gray" },
  { id: 35, name: "Gestora Sanitaria Afrodescendiente", type: "accessory", variant: "stethoscope-orange-alt" },
  { id: 36, name: "Gestora Clínica Morena", type: "accessory", variant: "stethoscope-wood" },
  { id: 37, name: "Gestora Clínica Morena Alt", type: "accessory", variant: "stethoscope-brown" },
  { id: 38, name: "Gestora Sanitaria Joven Clinical", type: "accessory", variant: "stethoscope-beige" },
  { id: 39, name: "Gestora Clínica Joven", type: "accessory", variant: "stethoscope-beige-alt" },
  { id: 40, name: "Gestora Clínica Afrodescendiente Alt", type: "accessory", variant: "stethoscope-navy" },
  { id: 41, name: "Gestora Clínica Joven con Gafas", type: "accessory", variant: "stethoscope-gray-bright" },
  { id: 42, name: "Gestora Clínica Senior", type: "accessory", variant: "stethoscope-orange-bright" },
  { id: 43, name: "Gestora Sanitaria Rubia", type: "accessory", variant: "stethoscope-purple-alt" },
  { id: 44, name: "Gestora Clínica Joven Morena", type: "accessory", variant: "stethoscope-purple-bright" },
  { id: 45, name: "Gestora Sanitaria Senior", type: "accessory", variant: "stethoscope-gray-alt" },
  { id: 46, name: "Gestora Clínica Rubia", type: "accessory", variant: "stethoscope-purple-alt-2" },
  { id: 47, name: "Gestora Clínica Especialista", type: "accessory", variant: "stethoscope-orange-alt-2" },
  { id: 48, name: "Gestora Sanitaria Afrodescendiente Alt", type: "accessory", variant: "stethoscope-teal" },
  { id: 49, name: "Gestora Clínica Senior Alt", type: "accessory", variant: "stethoscope-navy-alt" },
  { id: 50, name: "Gestora Clínica Joven Larga", type: "accessory", variant: "stethoscope-navy-alt-2" },
  { id: 51, name: "Gestora Sanitaria Joven Afro", type: "accessory", variant: "stethoscope-teal-alt" },
  { id: 52, name: "Gestora Clínica Pelirroja Alt", type: "accessory", variant: "stethoscope-orange-alt-3" },
  { id: 53, name: "Gestora Directiva Rubia", type: "accessory", variant: "clipboard-navy" },
  { id: 54, name: "Gestora Ejecutiva Joven", type: "accessory", variant: "clipboard-beige-alt" },
  { id: 55, name: "Gestora Especialista Pelirroja Alt", type: "accessory", variant: "clipboard-yellow-bright-alt" },
  { id: 56, name: "Gestora Ejecutiva Rubia Alt 2", type: "accessory", variant: "clipboard-purple-alt-2" },
  { id: 57, name: "Gestora Coordinadora Afrodescendiente", type: "accessory", variant: "clipboard-gray-alt-2" },
  { id: 58, name: "Gestora Sanitaria Coordinadora", type: "accessory", variant: "clipboard-red-alt-2" },
  { id: 59, name: "Gestora Administrativo Ejecutiva", type: "accessory", variant: "clipboard-navy-alt-2" },
  { id: 60, name: "Gestora Profesional Senior", type: "accessory", variant: "clipboard-beige-alt-2" },
];

const CHARACTER_CATEGORIES = {
  "Tipo de Cabello": FEMALE_CHARACTERS.filter(c => c.type === "hair"),
  "Accesorios": FEMALE_CHARACTERS.filter(c => c.type === "accessory"),
};

export default function FemaleCharacterCustomization({ onComplete, onBack }) {
  const [selectedCharacter, setSelectedCharacter] = useState(1);
  const playerAvatar = JSON.parse(localStorage.getItem('playerAvatar') || '{}');

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
      characterPreset: selectedCharacter,
      characterType: selectedChar.type,
      characterVariant: selectedChar.variant,
    };
    localStorage.setItem('playerAvatar', JSON.stringify(updatedAvatar));
    onComplete();
  };

  const selectedChar = FEMALE_CHARACTERS.find(c => c.id === selectedCharacter);
  
  // Map character ID to image (cycle through 1-10 if more than 10)
  const imageId = ((selectedCharacter - 1) % 10) + 1;

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
                src={`/src/assets/female-characters/female-character-${imageId}.png`}
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
                        src={`/src/assets/female-characters/female-character-${((char.id - 1) % 10) + 1}.png`}
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
