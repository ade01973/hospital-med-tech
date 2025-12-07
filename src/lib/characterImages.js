const femaleCharacterImages = import.meta.glob('../assets/female-characters/female-character-*.png', {
  eager: true,
});

const maleCharacterImages = import.meta.glob('../assets/male-characters/male-character-*.png', {
  eager: true,
});

const defaultAvatars = {
  female: new URL('../assets/avatar/female_avatar_full_body.png', import.meta.url).href,
  male: new URL('../assets/avatar/male_avatar_full_body.png', import.meta.url).href,
};

const getCollectionForGender = (gender) => (gender === 'male' ? maleCharacterImages : femaleCharacterImages);

/**
 * Obtiene la ruta compilada de una imagen de personaje según su género y preset.
 * Si no encuentra la imagen devuelve un avatar por defecto para evitar roturas.
 */
export const getCharacterImage = (gender = 'female', presetId = 1) => {
  const safeGender = gender === 'male' ? 'male' : 'female';
  const collection = getCollectionForGender(safeGender);
  const key = `../assets/${safeGender}-characters/${safeGender}-character-${presetId}.png`;

  return collection[key]?.default || defaultAvatars[safeGender];
};

export const getDefaultAvatarImage = (gender = 'female') => {
  const safeGender = gender === 'male' ? 'male' : 'female';
  return defaultAvatars[safeGender];
};
