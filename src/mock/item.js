import {getRandomArrayItem} from "../utils.js";
import {getRandomIntegerNumber} from "../utils.js";

const MIN_OPTIONS_COUNT = 0;
const MIN_SENTENCES_IMAGES_COUNT = 1;
const MAX_SENTENCES_IMAGES_COUNT = 5;

const mockDescriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`.`);


const typeElements = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
const destinationElements = [`Amsterdam`, `Geneva`, `Milan`, `Chamonix`];
const options = [`Order Uber`, `Add luggage`, `Rent a car`, `Add breakfast`, `Book tickets`, `Choose seats`, `Add meal`];

const generateOptions = (element) => {
  return {
    type: element,
    name: options[getRandomIntegerNumber(0, options.length - 1)],
    price: Math.round(getRandomIntegerNumber(10, 50) / 10) * 10,
    isChecked: Math.random() > 0.5
  };
};

const generateDayItem = () => {
  const typeElement = getRandomArrayItem(typeElements);

  const createOptions = () => {
    const elements = [];
    for (let i = 0; i < getRandomIntegerNumber(MIN_OPTIONS_COUNT, MAX_SENTENCES_IMAGES_COUNT); i++) {
      elements.push(generateOptions(typeElement));
    }
    return elements;
  };

  const createImages = () => {
    const elements = [];
    for (let i = 0; i < getRandomIntegerNumber(MIN_SENTENCES_IMAGES_COUNT, MAX_SENTENCES_IMAGES_COUNT); i++) {
      elements.push(`http://picsum.photos/248/152?r=${Math.random()}`);
    }
    return elements;
  };

  return {
    type: typeElement,
    destination: getRandomArrayItem(destinationElements),
    price: Math.round(getRandomIntegerNumber(10, 50) / 10) * 10,
    options: createOptions(),
    description: mockDescriptionText.slice(0, getRandomIntegerNumber(MIN_SENTENCES_IMAGES_COUNT, MAX_SENTENCES_IMAGES_COUNT)).join(`.`),
    images: createImages()
  };
};

const generateDays = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateDayItem);
};

export {generateDays};
