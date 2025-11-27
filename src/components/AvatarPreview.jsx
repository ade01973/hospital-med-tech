import React from "react";

export default function AvatarPreview({ avatar }) {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto bg-slate-800 rounded-lg border-2 border-cyan-500 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {avatar.base && <img src={avatar.base} alt="base" className="absolute w-full h-full object-contain" />}
        {avatar.skin && <img src={avatar.skin} alt="skin" className="absolute w-full h-full object-contain" />}
        {avatar.hair && <img src={avatar.hair} alt="hair" className="absolute w-full h-full object-contain" />}
        {avatar.eyes && <img src={avatar.eyes} alt="eyes" className="absolute w-full h-full object-contain" />}
        {avatar.mouth && <img src={avatar.mouth} alt="mouth" className="absolute w-full h-full object-contain" />}
        {avatar.uniform && <img src={avatar.uniform} alt="uniform" className="absolute w-full h-full object-contain" />}
        {avatar.accessory && avatar.accessory !== "/assets/avatar/accessory/none.png" && <img src={avatar.accessory} alt="accessory" className="absolute w-full h-full object-contain" />}
      </div>
    </div>
  );
}
