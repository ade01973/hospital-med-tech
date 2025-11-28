// src/data/avatarOptions.js

export const GENDERS = ["female", "male"];

export const skinTones = [
  { id: "light", label: "Clara", color: "#f8d7b5" },
  { id: "medium", label: "Media", color: "#d1a074" },
  { id: "dark", label: "Oscura", color: "#8b5a2b" },
];

export const hairStyles = {
  female: [
    { id: "f_long", label: "Largo recogido", asset: "/assets/avatar/female_hair_long.png" },
    { id: "f_short", label: "Corto profesional", asset: "/assets/avatar/female_hair_short.png" },
  ],
  male: [
    { id: "m_short", label: "Corto clásico", asset: "/assets/avatar/male_hair_short.png" },
    { id: "m_fade", label: "Fade moderno", asset: "/assets/avatar/male_hair_fade.png" },
  ],
};

export const uniforms = {
  female: [
    { id: "f_scrubs_blue", label: "Pijama azul gestora", asset: "/assets/avatar/female_scrubs_blue.png" },
    { id: "f_coordinator", label: "Bata + tablet", asset: "/assets/avatar/female_coordinator.png" },
  ],
  male: [
    { id: "m_scrubs_blue", label: "Pijama azul gestor", asset: "/assets/avatar/male_scrubs_blue.png" },
    { id: "m_coordinator", label: "Bata + carpeta", asset: "/assets/avatar/male_coordinator.png" },
  ],
};

export const accessories = [
  { id: "stethoscope", label: "Fonendo", asset: "/assets/avatar/accessory_stethoscope.png" },
  { id: "id_card", label: "Tarjeta identificativa", asset: "/assets/avatar/accessory_idcard.png" },
  { id: "tablet", label: "Tablet gestora", asset: "/assets/avatar/accessory_tablet.png" },
];

export const defaultAvatarState = {
  gender: "female",
  skinTone: "medium",
  hairStyleId: "f_long",
  uniformId: "f_scrubs_blue",
  accessoryIds: ["id_card"],
};
