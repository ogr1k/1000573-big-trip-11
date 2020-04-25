import {getRandomIntegerNumber} from "../utils/common.js";
import {DESTINATIONS_POINT} from "../constants.js";

const MIN_SENTENCES_IMAGES_COUNT = 1;
const MAX_SENTENCES_IMAGES_COUNT = 5;

const mockDescriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`.`);

let descriptionMocks = {};

const generateDescription = () => {
  for (const point of DESTINATIONS_POINT) {
    descriptionMocks[point] = mockDescriptionText.slice(0, getRandomIntegerNumber(MIN_SENTENCES_IMAGES_COUNT, MAX_SENTENCES_IMAGES_COUNT)).join(`.`);
  }
};

generateDescription();

const createImages = () => {
  const elements = [];
  for (let i = 0; i < getRandomIntegerNumber(MIN_SENTENCES_IMAGES_COUNT, MAX_SENTENCES_IMAGES_COUNT); i++) {
    elements.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return elements;
};

let imagesMocks = {};

const generateImages = () => {
  for (const point of DESTINATIONS_POINT) {
    imagesMocks[point] = createImages();
  }
};

generateImages();

export {descriptionMocks};
export {imagesMocks};
