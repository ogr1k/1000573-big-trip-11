import {createElement} from "../utils.js";

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


export default class TabsTemplate {
  constructor(day) {
    this._day = day;
    this._element = null;
  }

  getTemplate() {
    return createTabsTemplate(this._day);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
