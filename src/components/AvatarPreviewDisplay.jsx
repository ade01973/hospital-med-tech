import React from "react";
import femaleAvatarFullBody from "../assets/avatar/female_avatar_full_body.png";
import maleAvatarFullBody from "../assets/avatar/male_avatar_full_body.png";

export default function AvatarPreviewDisplay({ avatar = {}, size = "large" }) {
  const sizeClasses = {
    small: "w-14 h-20",
    medium: "w-28 h-40",
    large: "w-40 h-60",
  };

  const gender = avatar?.gender || "female";
  
  // Placeholder avatars by gender
  const avatarImages = {
    female: femaleAvatarFullBody,
    male: maleAvatarFullBody,
  };

  const avatarImage = avatarImages[gender];

  return (
    <div className={`${sizeClasses[size]} mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/20 overflow-hidden flex items-center justify-center`}>
      {avatarImage && (
        <img
          src={avatarImage}
          alt="Avatar"
          className="w-full h-full object-contain transition-all duration-500 ease-out opacity-0 animate-fadeInUp"
          key={gender}
        />
      )}
    </div>
  );
}
