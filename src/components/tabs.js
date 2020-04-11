const createTabElement = (name, isActive) => {
  return (`<a class="trip-tabs__btn  ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`);
};

export const createTabsTemplate = (data) => {
  const tabs = data.map((it, index) => createTabElement(it, index === 0)).join(`\n`);
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
     ${tabs}
      </nav>`
  );
};
