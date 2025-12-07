import femaleFullBody from "../assets/avatar/female_avatar_full_body.png";
import maleFullBody from "../assets/avatar/male_avatar_full_body.png";

const femaleCharacterImages = import.meta.glob("../assets/female-characters/*.png", {
  eager: true,
  import: "default",
});

const maleCharacterImages = import.meta.glob("../assets/male-characters/*.png", {
  eager: true,
  import: "default",
});

const fallbackImage = (images) => {
  const values = Object.values(images);
  return values.length > 0 ? values[0] : null;
};

export const getCharacterImage = (gender = "female", preset) => {
  const normalizedGender = gender === "male" ? "male" : "female";
  const images = normalizedGender === "male" ? maleCharacterImages : femaleCharacterImages;
  if (preset) {
    const imageKey = `../assets/${normalizedGender}-characters/${normalizedGender}-character-${preset}.png`;
    if (images[imageKey]) {
      return images[imageKey];
    }
  }
  return fallbackImage(images);
};

export const avatarPlaceholders = {
  female: femaleFullBody,
  male: maleFullBody,
};
