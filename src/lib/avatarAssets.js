export const avatarPlaceholders = {
  female: new URL('../assets/avatar/female_avatar_full_body.png', import.meta.url).href,
  male: new URL('../assets/avatar/male_avatar_full_body.png', import.meta.url).href,
};

export const getAvatarPlaceholder = (gender = 'female') => {
  const normalizedGender = gender === 'male' ? 'male' : 'female';
  return avatarPlaceholders[normalizedGender];
};

export const getCharacterImage = (gender = 'female', preset = 1) => {
  const normalizedGender = gender === 'male' ? 'male' : 'female';
  const presetId = preset || 1;

  try {
    return new URL(
      `../assets/${normalizedGender}-characters/${normalizedGender}-character-${presetId}.png`,
      import.meta.url,
    ).href;
  } catch (error) {
    console.error('Error al cargar la imagen del avatar', { gender: normalizedGender, preset: presetId, error });
    return null;
  }
};
