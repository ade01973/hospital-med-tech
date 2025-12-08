const femaleCharacters = import.meta.glob('../assets/female-characters/*.png', {
  eager: true,
  import: 'default'
});

const maleCharacters = import.meta.glob('../assets/male-characters/*.png', {
  eager: true,
  import: 'default'
});

const collections = {
  female: femaleCharacters,
  male: maleCharacters,
};

export const getCharacterImage = (gender = 'female', preset = 1) => {
  const safeGender = gender === 'male' ? 'male' : 'female';
  const safePreset = preset || 1;
  const filename = `${safeGender}-character-${safePreset}.png`;

  const collection = collections[safeGender] || femaleCharacters;
  const match = Object.entries(collection).find(([path]) => path.endsWith(filename));

  if (match) {
    return match[1];
  }

  const fallback = Object.values(collection)[0];
  return typeof fallback === 'string' ? fallback : '';
};
