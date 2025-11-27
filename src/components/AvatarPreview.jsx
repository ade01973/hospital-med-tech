import React from "react";

export default function AvatarPreview({ avatar }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-64 h-64 bg-slate-800 rounded-lg border-2 border-cyan-500 flex items-center justify-center overflow-hidden shadow-lg">
        {avatar.base && <img src={avatar.base} alt="base" className="absolute inset-0 w-full h-full object-cover" />}
        {avatar.skin && <img src={avatar.skin} alt="skin" className="absolute inset-0 w-full h-full object-cover" />}
        {avatar.hair && <img src={avatar.hair} alt="hair" className="absolute inset-0 w-full h-full object-cover" />}
        {avatar.eyes && <img src={avatar.eyes} alt="eyes" className="absolute inset-0 w-full h-full object-cover" />}
        {avatar.mouth && <img src={avatar.mouth} alt="mouth" className="absolute inset-0 w-full h-full object-cover" />}
        {avatar.uniform && <img src={avatar.uniform} alt="uniform" className="absolute inset-0 w-full h-full object-cover" />}
        {avatar.accessory && avatar.accessory !== "/assets/avatar/accessory/none.png" && <img src={avatar.accessory} alt="accessory" className="absolute inset-0 w-full h-full object-cover" />}
      </div>
      <p className="text-cyan-400 text-sm font-bold">Tu Avatar</p>
    </div>
  );
}
