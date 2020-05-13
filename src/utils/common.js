import {EVENTS_PRETEXTS} from "../constants.js";

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const formatTime = (date) => {
  return date.format(`HH:mm`);
};

const findLastElement = (selector, nodeElement = document) => {
  const elements = nodeElement.querySelectorAll(selector);
  return elements[elements.length - 1];
};


const setPretext = (element) => {
  return EVENTS_PRETEXTS[element] || `to`;
};

export {getRandomArrayItem};
export {getRandomIntegerNumber};
export {findLastElement};
export {setPretext};
export {formatTime};
