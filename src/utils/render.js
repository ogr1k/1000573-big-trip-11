const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  BEFOREBEGIN: `beforebegin`
};


const render = (container, component, place, referenceElement) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.BEFOREBEGIN:
      container.insertBefore(component.getElement(), referenceElement);
      break;
  }
};

const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

const getPointsStructure = (points) => {
  const daysCopy = [...points];

  daysCopy.sort((a, b) => a.date[0] - b.date[0]);

  const dayStructure = new Map();
  dayStructure.set(daysCopy[0].date[0].format(`MMMM D`), [daysCopy[0]]);

  const slicedDayStructure = daysCopy.slice(1);
  slicedDayStructure.map((item) => {
    const keysArray = Array.from(dayStructure.keys());
    const currentLastKey = keysArray[keysArray.length - 1];
    const currentItemDate = item.date[0].format(`MMMM D`);
    if (currentLastKey === currentItemDate) {
      dayStructure.get(keysArray[keysArray.length - 1]).push(item);
    } else {
      dayStructure.set(item.date[0].format(`MMMM D`), [item]);
    }
  });
  return dayStructure;
};


export {createElement};
export {RenderPosition};
export {render};
export {replace};
export {remove};
export {getPointsStructure};
