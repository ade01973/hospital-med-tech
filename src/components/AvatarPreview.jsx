import React from "react";

export default function AvatarPreview({ avatar }) {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto bg-slate-800 rounded-lg border-2 border-cyan-500 flex items-center justify-center overflow-hidden">
      {/* Renderizar capas del avatar */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img src={avatar.base} alt="base" className="absolute w-full h-full object-contain" />
        <img src={avatar.skin} alt="skin" className="absolute w-full h-full object-contain" />
        <img src={avatar.hair} alt="hair" className="absolute w-full h-full object-contain" />
        <img src={avatar.eyes} alt="eyes" className="absolute w-full h-full object-contain" />
        <img src={avatar.mouth} alt="mouth" className="absolute w-full h-full object-contain" />
        <img src={avatar.uniform} alt="uniform" className="absolute w-full h-full object-contain" />
        <img src={avatar.accessory} alt="accessory" className="absolute w-full h-full object-contain" />
      </div>
    </div>
  );
}
