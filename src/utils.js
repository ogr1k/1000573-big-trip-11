const ESC_KEY = `Escape`;

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const findLastElement = (selector, nodeElement = document) => {
  const elements = nodeElement.querySelectorAll(selector);
  return elements[elements.length - 1];
};

const isEscEvent = (evt, action) => {
  if (evt.key === ESC_KEY) {
    action();
  }
};

const setPretext = (element) => {
  if (element === `Check-in` || element === `Restaurant` || element === `Sightseeing`) {
    return ` in `;
  } else {
    return ` to `;
  }
};

export {getRandomArrayItem};
export {getRandomIntegerNumber};
export {findLastElement};
export {isEscEvent};
export {setPretext};
