import {getRandomArrayItem} from "../utils/common.js";
import {getRandomIntegerNumber} from "../utils/common.js";
import {createOptions} from "../utils/common.js";
import {TYPES_POINT} from "../constants.js";
import {DESTINATIONS_POINT} from "../constants.js";
import {optionsMocks} from "../mock/item-options.js";
import {descriptionMocks, imagesMocks} from "./item-description-images.js";

const getRandomDate = () => {
  const targetDate = new Date();
  const diffValue = getRandomIntegerNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};


const generateDayItem = () => {
  const typeElement = getRandomArrayItem(TYPES_POINT);

  const setTime = () => {
    const firstDateHour = getRandomIntegerNumber(0, 23);
    let getDate = (string) => new Date(2020, 0, 16, string.split(`:`)[0], string.split(`:`)[1]);
    const firstTime = getDate(`${firstDateHour}:${getRandomIntegerNumber(0, 59)}`);
    const secondTime = getDate(`${getRandomIntegerNumber(firstDateHour, 23)}:${getRandomIntegerNumber(0, 59)}`);
    let time = [firstTime, secondTime];
    return time;
  };

  const destinationPoint = getRandomArrayItem(DESTINATIONS_POINT);

  return {
    type: typeElement,
    destination: destinationPoint,
    price: Math.round(getRandomIntegerNumber(10, 50) / 10) * 10,
    options: createOptions(typeElement, optionsMocks),
    description: descriptionMocks[destinationPoint],
    images: imagesMocks[destinationPoint],
    time: setTime(),
    isFavourite: false,
    date: getRandomDate()
  };
};

const generateDays = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateDayItem);
};

export {generateDays};
