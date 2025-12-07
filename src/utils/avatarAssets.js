const femaleCharacterModules = import.meta.glob('../assets/female-characters/*.png', {
  eager: true,
  import: 'default',
});

const maleCharacterModules = import.meta.glob('../assets/male-characters/*.png', {
  eager: true,
  import: 'default',
});

const buildCharacterMap = (modules, genderPrefix) => {
  return Object.entries(modules).reduce((acc, [path, src]) => {
    const match = path.match(new RegExp(`${genderPrefix}-character-(\\d+)\\.png$`));
    if (match) {
      acc[Number(match[1])] = src;
    }
    return acc;
  }, {});
};

export const femaleCharacterImages = buildCharacterMap(
  femaleCharacterModules,
  'female'
);
export const maleCharacterImages = buildCharacterMap(maleCharacterModules, 'male');

export const getCharacterImage = (gender = 'female', presetId = 1) => {
  const map = gender === 'male' ? maleCharacterImages : femaleCharacterImages;
  const fallbackMap = gender === 'male' ? maleCharacterImages : femaleCharacterImages;

  if (presetId && map[presetId]) return map[presetId];

  return map[1] || fallbackMap[1] || Object.values(fallbackMap)[0];
};

export const getDirectorImage = () => femaleCharacterImages[8] || getCharacterImage('female', 1);
