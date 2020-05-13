import {getRandomArrayItem, getRandomIntegerNumber, createOptions} from "../utils/common.js";
import {TYPES_POINT, DESTINATIONS_POINT} from "../constants.js";
import {optionsMocks, findOptions} from "../mock/item-options.js";
import {descriptionMocks, imagesMocks} from "./item-description-images.js";
import moment from "moment";

const MAX_MINUTES_DIFFERENCE = 500;
const MIN_MINUTES_DIFFERENCE = 1;

const getDate = () => {
  const today = (new Date()).getDate();
  const dateRange = getRandomIntegerNumber(today, today + 3);

  const startTime = moment(new Date(2020, 4, dateRange, getRandomIntegerNumber(0, 23), getRandomIntegerNumber(0, 59)));
  const endTime = moment(startTime).add(getRandomIntegerNumber(MIN_MINUTES_DIFFERENCE, MAX_MINUTES_DIFFERENCE), `minutes`);
  const diffTime = endTime - startTime;

  return [startTime, endTime, diffTime];
};

const getDifference = (date) => {
  return date[1] - date[0];
};


const generateDayItem = () => {
  const typeElement = getRandomArrayItem(TYPES_POINT);

  const dates = getDate();

  const difference = getDifference(dates);

  const destinationPoint = getRandomArrayItem(DESTINATIONS_POINT);

  const opt = findOptions(typeElement);

  return {
    id: String(new Date() + Math.random()),
    type: typeElement,
    destination: destinationPoint,
    price: Math.round(getRandomIntegerNumber(10, 50) / 10) * 10,
    offers: opt.slice(0, 1),
    description: descriptionMocks[destinationPoint],
    images: imagesMocks[destinationPoint],
    isFavourite: false,
    parentIndex: getRandomIntegerNumber(0, 3),
    date: dates,
    dateDiff: difference
  };
};

const generateDays = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateDayItem);
};

export {generateDays};
