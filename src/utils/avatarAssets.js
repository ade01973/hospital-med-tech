const femaleCharacterImages = import.meta.glob('../assets/female-characters/*.png', {
  eager: true,
});

const maleCharacterImages = import.meta.glob('../assets/male-characters/*.png', {
  eager: true,
});

const normalizeKey = (gender, preset) => `../assets/${gender}-characters/${gender}-character-${preset}.png`;

export const getCharacterImage = (gender = 'female', preset) => {
  if (!preset) return null;
  const normalizedGender = gender === 'male' ? 'male' : 'female';
  const images = normalizedGender === 'male' ? maleCharacterImages : femaleCharacterImages;
  const key = normalizeKey(normalizedGender, preset);
  const module = images[key];
  return module?.default || null;
};

import femaleAvatarFull from '../assets/avatar/female_avatar_full_body.png';
import maleAvatarFull from '../assets/avatar/male_avatar_full_body.png';

export const getPlaceholderAvatar = (gender = 'female') =>
  gender === 'male' ? maleAvatarFull : femaleAvatarFull;
