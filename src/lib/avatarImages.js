import femalePlaceholder from '../assets/avatar/female_avatar_full_body.png';
import malePlaceholder from '../assets/avatar/male_avatar_full_body.png';

const characterImages = import.meta.glob('../assets/*-characters/*.png', {
  eager: true,
  import: 'default',
});

export const placeholderAvatars = {
  female: femalePlaceholder,
  male: malePlaceholder,
};

export function getPlaceholderAvatar(gender = 'female') {
  return placeholderAvatars[gender] || placeholderAvatars.female;
}

export function getCharacterImage(gender = 'female', preset) {
  if (!preset) return null;
  const key = `../assets/${gender}-characters/${gender}-character-${preset}.png`;
  return characterImages[key] || null;
}
