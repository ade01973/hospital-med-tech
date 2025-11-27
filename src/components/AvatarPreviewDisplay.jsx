import React from "react";
import femaleBase from "../assets/avatar/base/female.png";
import maleBase from "../assets/avatar/base/male.png";

export default function AvatarPreviewDisplay({ avatar, size = "large" }) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  // Get the base image based on gender
  const getBaseImage = () => {
    return avatar.base === "male" ? maleBase : femaleBase;
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto relative rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/20 overflow-hidden`}>
      {/* Base Layer */}
      <img 
        src={getBaseImage()} 
        alt="Avatar base" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
