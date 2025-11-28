import React from "react";
import femaleBase from "../assets/avatar/base/female_base.png";
import maleBase from "../assets/avatar/base/male_base.png";

/**
 * BaseLayer Component
 * Renderiza la capa base del avatar (cuerpo sin piel, ojos, cabello)
 *
 * Props:
 * - gender: 'male' | 'female'
 */

export default function BaseLayer({ gender = "female" }) {
  const baseImg = gender === "male" ? maleBase : femaleBase;

  return (
    <img
      src={baseImg}
      alt="Base Avatar Layer"
      className="w-full h-full object-contain pointer-events-none select-none"
      draggable="false"
    />
  );
}
