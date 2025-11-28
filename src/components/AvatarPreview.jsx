import React from "react";

const layerStyle = "absolute inset-0 w-full h-full object-contain";

export default function AvatarPreview({ avatar }) {
  return (
    <div className="relative w-40 h-40 md:w-56 md:h-56 mx-auto">
      <img src={avatar.base} className={layerStyle} alt="" />
      <img src={avatar.skin} className={layerStyle} alt="" />
      <img src={avatar.hair} className={layerStyle} alt="" />
      <img src={avatar.eyes} className={layerStyle} alt="" />
      <img src={avatar.mouth} className={layerStyle} alt="" />
      <img src={avatar.uniform} className={layerStyle} alt="" />
      <img src={avatar.accessory} className={layerStyle} alt="" />
    </div>
  );
}
