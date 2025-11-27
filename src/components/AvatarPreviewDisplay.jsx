import React from "react";

export default function AvatarPreviewDisplay({ avatar, size = "large" }) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  // Simple avatar display - uses initials or emoji for now
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`${sizeClasses[size]} mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/30 text-white font-black text-4xl`}
    >
      <div className="text-center">
        <div className="text-6xl mb-2">👤</div>
        <div className="text-sm">{avatar.base === "female" ? "👩‍⚕️" : "👨‍⚕️"}</div>
      </div>
    </div>
  );
}
