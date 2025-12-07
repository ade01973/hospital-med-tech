const femaleImages = import.meta.glob('../assets/female-characters/*.png', {
  eager: true,
  import: 'default',
});

const maleImages = import.meta.glob('../assets/male-characters/*.png', {
  eager: true,
  import: 'default',
});

const getImageByPath = (collection, path) => collection[path] || null;

export const getFemaleCharacterImage = (id) =>
  getImageByPath(femaleImages, `../assets/female-characters/female-character-${id}.png`) ||
  getImageByPath(femaleImages, '../assets/female-characters/female-character-1.png');

export const getMaleCharacterImage = (id) =>
  getImageByPath(maleImages, `../assets/male-characters/male-character-${id}.png`) ||
  getImageByPath(maleImages, '../assets/male-characters/male-character-1.png');
