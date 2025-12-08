export const getCharacterImage = (gender = 'female', preset = 1) => {
  const safeGender = gender === 'male' ? 'male' : 'female';
  const safePreset = preset || 1;

  return new URL(
    `../assets/${safeGender}-characters/${safeGender}-character-${safePreset}.png`,
    import.meta.url,
  ).href;
};
