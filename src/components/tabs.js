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
    this._currentActive = `Table`;
  }

  getTemplate() {
    return createTabsTemplate(this._day);
  }

  setActive(element) {
    this._currentActive = element;
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      if (evt.target.textContent === this._currentActive) {
        return;
      }

      const menuItem = evt.target.textContent;

      handler(menuItem);
    });
  }
}
