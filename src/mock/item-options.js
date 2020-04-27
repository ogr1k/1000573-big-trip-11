import {TYPES_POINT, OPTIONS} from "../constants.js";
import {getRandomIntegerNumber, getRandomArrayItem} from "../utils/common.js";


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
