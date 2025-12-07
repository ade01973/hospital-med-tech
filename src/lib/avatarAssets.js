const spriteSheets = import.meta.glob('../assets/*-characters/*.png', {
  eager: true,
  import: 'default'
});

import femaleFullBody from '../assets/avatar/female_avatar_full_body.png';
import maleFullBody from '../assets/avatar/male_avatar_full_body.png';

const fullBodyByGender = {
  female: femaleFullBody,
  male: maleFullBody
};

export function getAvatarSprite(gender = 'female', preset = '1') {
  const sanitizedGender = gender === 'male' ? 'male' : 'female';
  const sanitizedPreset = String(preset || '1');
  const key = `../assets/${sanitizedGender}-characters/${sanitizedGender}-character-${sanitizedPreset}.png`;
  return spriteSheets[key];
}

export function getFullBodyAvatar(gender = 'female') {
  return fullBodyByGender[gender] || fullBodyByGender.female;
}
