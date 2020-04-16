import {createElement} from "../utils.js";

const createFilterElement = (name, isChecked) => {
  return (`
    <div class="trip-filters__filter">
            <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio"
                name="trip-filter" value="everything" ${isChecked ? `checked` : ``}>
            <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>
    `);
};


const createFiltersTemplate = (data) => {
  const filters = data.map((it, index) => createFilterElement(it, index === 0)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
     ${filters}
    </form>`
  );
};

export default class FilterTemplate {
  constructor(day) {
    this._day = day;
    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._day);
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
