import React from "react";
import femaleBase from "../assets/avatar/base/female.png";
import maleBase from "../assets/avatar/base/male.png";

// Skin tones
import skin1 from "../assets/avatar/skin/skin_1.png";
import skin2 from "../assets/avatar/skin/skin_2.png";
import skin3 from "../assets/avatar/skin/skin_3.png";
import skin4 from "../assets/avatar/skin/skin_4.png";
import skin5 from "../assets/avatar/skin/skin_5.png";

// Female faces
import femaleFace1 from "../assets/avatar/faces/female/face_1.png";
import femaleFace2 from "../assets/avatar/faces/female/face_2.png";
import femaleFace3 from "../assets/avatar/faces/female/face_3.png";
import femaleFace4 from "../assets/avatar/faces/female/face_4.png";
import femaleFace5 from "../assets/avatar/faces/female/face_5.png";

// Male faces
import maleFace1 from "../assets/avatar/faces/male/face_1.png";
import maleFace2 from "../assets/avatar/faces/male/face_2.png";
import maleFace3 from "../assets/avatar/faces/male/face_3.png";
import maleFace4 from "../assets/avatar/faces/male/face_4.png";
import maleFace5 from "../assets/avatar/faces/male/face_5.png";

export default function AvatarPreviewDisplay({ avatar, size = "large" }) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  const getBaseImage = () => {
    return avatar.base === "male" ? maleBase : femaleBase;
  };

  const getSkinImage = () => {
    const skinToneMap = {
      "very-light": skin1,
      light: skin2,
      medium: skin3,
      "olive-tan": skin4,
      dark: skin5,
    };
    return skinToneMap[avatar.skin] || skin2;
  };

  const getFaceImage = () => {
    const faceNum = avatar.face || 1;
    const faces = {
      female: [femaleFace1, femaleFace2, femaleFace3, femaleFace4, femaleFace5],
      male: [maleFace1, maleFace2, maleFace3, maleFace4, maleFace5],
    };
    const baseFaces = faces[avatar.base] || faces.female;
    return baseFaces[faceNum - 1] || baseFaces[0];
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto relative rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/20 overflow-hidden`}>
      {/* Base Layer */}
      <img 
        src={getBaseImage()} 
        alt="Avatar base" 
        className="w-full h-full object-contain absolute inset-0"
      />
      {/* Skin Tone Layer */}
      <img 
        src={getSkinImage()} 
        alt="Avatar skin tone" 
        className="w-full h-full object-contain absolute inset-0"
      />
      {/* Face Layer */}
      <img 
        src={getFaceImage()} 
        alt="Avatar face" 
        className="w-full h-full object-contain absolute inset-0"
      />
    </div>
  );
}
