import React from "react";

/**
 * BaseLayer Component
 * Renderiza la capa base del avatar (cuerpo sin piel, ojos, cabello)
 * 
 * Props:
 * - gender: 'male' o 'female'
 * 
 * TODO: Completa este componente con SVG o Canvas para dibujar la capa base
 */

export default function BaseLayer({ gender = "female" }) {
  return (
    <svg
      viewBox="0 0 200 400"
      width="200"
      height="400"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 
        Aquí iría el código SVG para la capa base del avatar.
        Dibuja el cuerpo, el uniforme médico, etc.
        
        Ejemplo placeholder:
      */}
      <rect x="0" y="0" width="200" height="400" fill="none" stroke="#ccc" />
      <text x="100" y="200" textAnchor="middle" fill="#999">
        Base Layer
      </text>
    </svg>
  );
}
