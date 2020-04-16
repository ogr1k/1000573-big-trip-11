import {createElement} from "../utils.js";

const createSortElement = (name, isChecked) => {
  return (`<div class="trip-sort__item  trip-sort__item--${name}">
  <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${name}" ${isChecked ? `checked` : ``}>
  <label class="trip-sort__btn" for="sort-${name}">
  ${name}
      ${name !== `event` ? `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z" />
      </svg>` : ``}
  </label>
</div>`);
};


const createSortTemplate = (data) => {
  const sorts = data.map((it, index) => createSortElement(it, index === 0)).join(`\n`);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">Day</span>
        ${sorts}
        <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};


export default class SortTemplate {
  constructor(day) {
    this._day = day;
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate(this._day);
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
