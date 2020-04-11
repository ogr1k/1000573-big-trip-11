import {TYPES_POINT} from "../constants.js";
import {OPTIONS} from "../constants.js";
import {getRandomIntegerNumber} from "../utils.js";
import {getRandomArrayItem} from "../utils.js";


let optionsMocks = [];
const generateOptions = () => {
  for (const item of OPTIONS) {
    optionsMocks.push({
      type: getRandomArrayItem(TYPES_POINT),
      name: item,
      price: Math.round(getRandomIntegerNumber(10, 150) / 10) * 10
    });
  }
  return optionsMocks;
};

generateOptions();

export {optionsMocks};
