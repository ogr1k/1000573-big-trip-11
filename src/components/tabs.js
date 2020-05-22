import AbstractSmartComponent from "./abstact-smart-components.js";

const DEFAULT_TAB = `Table`;

const createTabElement = (name, isActive) => {
  return (`<a class="trip-tabs__btn  ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`);
};

const createTabsTemplate = (allTabs, activeTab) => {
  const tabs = allTabs.map((tab) => createTabElement(tab, tab === activeTab)).join(`\n`);
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
     ${tabs}
      </nav>`
  );
};


export default class Tabs extends AbstractSmartComponent {
  constructor(tabs) {
    super();

    this._tabs = tabs;
    this._currentActive = DEFAULT_TAB;

    this._handler = null;
  }

  getTemplate() {
    return createTabsTemplate(this._tabs, this._currentActive);
  }

  setActive(element) {
    this._currentActive = element;
  }

  recoveryListeners() {
    this.setOnChange(this._handler);
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      if (evt.target.textContent === this._currentActive) {
        return;
      }

      this._handler = handler;

      const menuItem = evt.target.textContent;

      handler(menuItem);
      this.rerender();
    });
  }
}
