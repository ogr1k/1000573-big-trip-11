import {getRandomArrayItem, getRandomIntegerNumber, createOptions} from "../utils/common.js";
import {TYPES_POINT, DESTINATIONS_POINT} from "../constants.js";
import {optionsMocks} from "../mock/item-options.js";
import {descriptionMocks, imagesMocks} from "./item-description-images.js";
import moment from "moment";

const MAX_MINUTES_DIFFERENCE = 500;
const MIN_MINUTES_DIFFERENCE = 1;

const getDate = () => {
  const today = (new Date()).getDate();
  const startTime = moment(new Date(2020, 3, today, getRandomIntegerNumber(0, 23), getRandomIntegerNumber(0, 59)));
  const endTime = moment(startTime).add(getRandomIntegerNumber(MIN_MINUTES_DIFFERENCE, MAX_MINUTES_DIFFERENCE), `minutes`);

  return [startTime, endTime];
};


const generateDayItem = () => {
  const typeElement = getRandomArrayItem(TYPES_POINT);


  const destinationPoint = getRandomArrayItem(DESTINATIONS_POINT);

  return {
    id: String(new Date() + Math.random()),
    type: typeElement,
    destination: destinationPoint,
    price: Math.round(getRandomIntegerNumber(10, 50) / 10) * 10,
    options: createOptions(typeElement, optionsMocks),
    description: descriptionMocks[destinationPoint],
    images: imagesMocks[destinationPoint],
    isFavourite: false,
    parentIndex: getRandomIntegerNumber(0, 3),
    date: getDate()
  };
};

const generateDays = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateDayItem);
};

export {generateDays};
