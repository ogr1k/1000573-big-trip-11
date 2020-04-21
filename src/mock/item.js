import {getRandomArrayItem} from "../utils/common.js";
import {getRandomIntegerNumber} from "../utils/common.js";
import {TYPES_POINT} from "../constants.js";
import {DESTINATIONS_POINT} from "../constants.js";
import {optionsMocks} from "../mock/item-options.js";


const MIN_OPTIONS_COUNT = 0;
const MIN_SENTENCES_IMAGES_COUNT = 1;
const MAX_SENTENCES_IMAGES_COUNT = 5;

const mockDescriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`.`);

const generateDayItem = () => {
  const typeElement = getRandomArrayItem(TYPES_POINT);

  const createOptions = () => {
    const elements = [];
    for (let i = 0; i < getRandomIntegerNumber(MIN_OPTIONS_COUNT, MAX_SENTENCES_IMAGES_COUNT); i++) {
      const optionElement = getRandomArrayItem(optionsMocks);
      elements.push(optionElement);
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

  const setTime = () => {
    const firstDateHour = getRandomIntegerNumber(0, 23);
    let getDate = (string) => new Date(2020, 0, 16, string.split(`:`)[0], string.split(`:`)[1]);
    const firstTime = getDate(`${firstDateHour}:${getRandomIntegerNumber(0, 59)}`);
    const secondTime = getDate(`${getRandomIntegerNumber(firstDateHour, 23)}:${getRandomIntegerNumber(0, 59)}`);
    let time = [firstTime, secondTime];
    return time;
  };

  return {
    type: typeElement,
    destination: getRandomArrayItem(DESTINATIONS_POINT),
    price: Math.round(getRandomIntegerNumber(10, 50) / 10) * 10,
    options: createOptions(),
    description: mockDescriptionText.slice(0, getRandomIntegerNumber(MIN_SENTENCES_IMAGES_COUNT, MAX_SENTENCES_IMAGES_COUNT)).join(`.`),
    images: createImages(),
    time: setTime()
  };
};

const generateDays = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateDayItem);
};

export {generateDays};
