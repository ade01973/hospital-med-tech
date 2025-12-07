const femaleCharacters = import.meta.glob('../assets/female-characters/*.png', {
  eager: true,
  import: 'default'
});

const maleCharacters = import.meta.glob('../assets/male-characters/*.png', {
  eager: true,
  import: 'default'
});

const AVATAR_BODIES = {
  female: new URL('../assets/avatar/female_avatar_full_body.png', import.meta.url).href,
  male: new URL('../assets/avatar/male_avatar_full_body.png', import.meta.url).href
};

const DEFAULT_FEMALE_AVATAR = femaleCharacters['../assets/female-characters/female-character-1.png'];

export function getCharacterImage(gender = 'female', preset = '1') {
  const normalizedGender = gender === 'male' ? 'male' : 'female';
  const map = normalizedGender === 'male' ? maleCharacters : femaleCharacters;
  const key = `../assets/${normalizedGender}-characters/${normalizedGender}-character-${preset}.png`;
  return map[key] || DEFAULT_FEMALE_AVATAR;
}

export function getAvatarBody(gender = 'female') {
  return AVATAR_BODIES[gender] || AVATAR_BODIES.female;
}

export const avatarBodies = AVATAR_BODIES;
export const defaultFemaleAvatar = DEFAULT_FEMALE_AVATAR;
