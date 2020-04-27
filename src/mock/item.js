import {getRandomArrayItem} from "../utils/common.js";
import {getRandomIntegerNumber} from "../utils/common.js";
import {createOptions} from "../utils/common.js";
import {TYPES_POINT} from "../constants.js";
import {DESTINATIONS_POINT} from "../constants.js";
import {optionsMocks} from "../mock/item-options.js";
import {descriptionMocks, imagesMocks} from "./item-description-images.js";
import moment from "moment";

const getDate = () => {
  return moment(new Date(2020, 3, 27, getRandomIntegerNumber(0, 23), getRandomIntegerNumber(0, 59)));
};


const generateDayItem = () => {
  const typeElement = getRandomArrayItem(TYPES_POINT);


  const destinationPoint = getRandomArrayItem(DESTINATIONS_POINT);

  return {
    type: typeElement,
    destination: destinationPoint,
    price: Math.round(getRandomIntegerNumber(10, 50) / 10) * 10,
    options: createOptions(typeElement, optionsMocks),
    description: descriptionMocks[destinationPoint],
    images: imagesMocks[destinationPoint],
    isFavourite: false,
    date: getDate()
  };
};

const generateDays = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateDayItem);
};

export {generateDays};
