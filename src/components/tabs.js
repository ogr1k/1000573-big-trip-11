import AbstractComponent from "./abstract-component.js";

const createTabElement = (name, isActive) => {
  return (`<a class="trip-tabs__btn  ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`);
};

const createTabsTemplate = (data) => {
  const tabs = data.map((it, index) => createTabElement(it, index === 0)).join(`\n`);
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
     ${tabs}
      </nav>`
  );
};


export default class TabsTemplate extends AbstractComponent {
  constructor(day) {
    super();

    this._day = day;
  }

  getTemplate() {
    return createTabsTemplate(this._day);
  }
}
