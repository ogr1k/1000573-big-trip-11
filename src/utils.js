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

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};


export {getRandomArrayItem};
export {getRandomIntegerNumber};
export {findLastElement};
export {isEscEvent};
export {setPretext};
export {createElement};
export {RenderPosition};
export {render};
