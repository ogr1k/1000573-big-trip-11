import {TYPES_POINT, OPTIONS, Events} from "../constants.js";
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


const getOpt = () => {
  let tost = [];
  for (let i = 0; i < getRandomIntegerNumber(0, 5); i++) {
    tost.push({
      title: getRandomArrayItem(OPTIONS),
      price: Math.round(getRandomIntegerNumber(10, 150) / 10) * 10
    });
  }
  return tost;
};

let tester1 = [];
const tester = () => {
  for (const item of Object.values(Events)) {
    tester1.push({
      type: item,
      offers: getOpt()
    });
  }
  return tester1;
};

tester();

const findOptions = (element) => {
  for (let i = 0; i < tester1.length; i++) {
    if (tester1[i].type === element) {
      return tester1[i].offers;
    }
  }
};

export {findOptions};
