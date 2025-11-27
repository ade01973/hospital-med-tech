// Import base images
import femaleBase from '../assets/avatar/base/female.png';
import maleBase from '../assets/avatar/base/male.png';

// Import skin images
import lightSkin from '../assets/avatar/skin/light.png';
import mediumSkin from '../assets/avatar/skin/medium.png';
import darkSkin from '../assets/avatar/skin/dark.png';

// Import hair images
import shortHair from '../assets/avatar/hair/short.png';
import longHair from '../assets/avatar/hair/long.png';
import curlyHair from '../assets/avatar/hair/curly.png';
import maleShortHair from '../assets/avatar/hair/male_short.png';
import maleFadeHair from '../assets/avatar/hair/male_fade.png';
import curlyMaleHair from '../assets/avatar/hair/curly_male.png';
import baldHair from '../assets/avatar/hair/bald.png';

// Import eyes images
import brownEyes from '../assets/avatar/eyes/brown.png';
import blueEyes from '../assets/avatar/eyes/blue.png';
import greenEyes from '../assets/avatar/eyes/green.png';

// Import mouth images
import smileMouth from '../assets/avatar/mouth/smile.png';
import seriousMouth from '../assets/avatar/mouth/serious.png';
import laughMouth from '../assets/avatar/mouth/laugh.png';

// Import uniform images
import nurseBlueUniform from '../assets/avatar/uniform/nurse_blue.png';
import nurseWhiteUniform from '../assets/avatar/uniform/nurse_white.png';
import managerUniform from '../assets/avatar/uniform/manager.png';

// Import accessory images
import glassesAccessory from '../assets/avatar/accessory/glasses.png';
import stethoscopeAccessory from '../assets/avatar/accessory/stethoscope.png';
import badgeManagerAccessory from '../assets/avatar/accessory/badge_manager.png';
import noneAccessory from '../assets/avatar/accessory/none.png';

export const avatarOptions = {
  base: [
    { label: 'Female', value: 'female', img: femaleBase },
    { label: 'Male', value: 'male', img: maleBase },
  ],
  skin: [
    { label: 'Light', value: 'light', img: lightSkin },
    { label: 'Medium', value: 'medium', img: mediumSkin },
    { label: 'Dark', value: 'dark', img: darkSkin },
  ],
  hair: [
    { label: 'Short', value: 'short', img: shortHair },
    { label: 'Long', value: 'long', img: longHair },
    { label: 'Curly', value: 'curly', img: curlyHair },
    { label: 'Male Short', value: 'male_short', img: maleShortHair },
    { label: 'Male Fade', value: 'male_fade', img: maleFadeHair },
    { label: 'Male Curly', value: 'curly_male', img: curlyMaleHair },
    { label: 'Bald', value: 'bald', img: baldHair },
  ],
  eyes: [
    { label: 'Brown', value: 'brown', img: brownEyes },
    { label: 'Blue', value: 'blue', img: blueEyes },
    { label: 'Green', value: 'green', img: greenEyes },
  ],
  mouth: [
    { label: 'Smile', value: 'smile', img: smileMouth },
    { label: 'Serious', value: 'serious', img: seriousMouth },
    { label: 'Laugh', value: 'laugh', img: laughMouth },
  ],
  uniform: [
    { label: 'Nurse Blue', value: 'nurse_blue', img: nurseBlueUniform },
    { label: 'Nurse White', value: 'nurse_white', img: nurseWhiteUniform },
    { label: 'Manager', value: 'manager', img: managerUniform },
  ],
  accessory: [
    { label: 'Glasses', value: 'glasses', img: glassesAccessory },
    { label: 'Stethoscope', value: 'stethoscope', img: stethoscopeAccessory },
    { label: 'Badge Manager', value: 'badge_manager', img: badgeManagerAccessory },
    { label: 'None', value: 'none', img: noneAccessory },
  ],
};
