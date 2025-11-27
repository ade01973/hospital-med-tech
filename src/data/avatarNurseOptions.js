// Nurse Manager Avatar Options
import femaleHead from '../assets/nurse_avatar/head/female.png';
import maleHead from '../assets/nurse_avatar/head/male.png';
import femaleSeriousHead from '../assets/nurse_avatar/head/female_serious.png';
import femaleSmileHead from '../assets/nurse_avatar/head/female_smile.png';

import longHair from '../assets/nurse_avatar/hair/long.png';
import shortHair from '../assets/nurse_avatar/hair/short.png';
import curlyHair from '../assets/nurse_avatar/hair/curly.png';

import lightSkin from '../assets/nurse_avatar/skin/light.png';
import mediumSkin from '../assets/nurse_avatar/skin/medium.png';
import darkSkin from '../assets/nurse_avatar/skin/dark.png';

import tealUniform from '../assets/nurse_avatar/uniform/teal.png';
import whiteUniform from '../assets/nurse_avatar/uniform/white.png';

import stethoscopeAcc from '../assets/nurse_avatar/accessory/stethoscope.png';
import idBadgeAcc from '../assets/nurse_avatar/accessory/id_badge.png';
import glassesAcc from '../assets/nurse_avatar/accessory/glasses.png';
import nameBadgeAcc from '../assets/nurse_avatar/accessory/name_badge.png';

export const avatarNurseOptions = {
  head: [
    { label: 'Mujer Profesional', value: 'female', img: femaleHead },
    { label: 'Mujer Sonrisa', value: 'female_smile', img: femaleSmileHead },
    { label: 'Mujer Seria', value: 'female_serious', img: femaleSeriousHead },
    { label: 'Hombre Profesional', value: 'male', img: maleHead },
  ],
  hair: [
    { label: 'Largo', value: 'long', img: longHair },
    { label: 'Corto', value: 'short', img: shortHair },
    { label: 'Rizado', value: 'curly', img: curlyHair },
  ],
  skin: [
    { label: 'Claro', value: 'light', img: lightSkin },
    { label: 'Medio', value: 'medium', img: mediumSkin },
    { label: 'Oscuro', value: 'dark', img: darkSkin },
  ],
  uniform: [
    { label: 'Uniforme Teal', value: 'teal', img: tealUniform },
    { label: 'Uniforme Blanco', value: 'white', img: whiteUniform },
  ],
  accessory: [
    { label: 'Estetoscopio', value: 'stethoscope', img: stethoscopeAcc },
    { label: 'ID Badge', value: 'id_badge', img: idBadgeAcc },
    { label: 'Gafas', value: 'glasses', img: glassesAcc },
    { label: 'Nombre Badge', value: 'name_badge', img: nameBadgeAcc },
    { label: 'Sin Accesorios', value: 'none', img: '' },
  ],
};
