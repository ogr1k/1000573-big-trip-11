import AbstractComponent from "./abstract-component.js";

export const SORT_ELEMENTS = [`event`, `time`, `price`];

export const SortType = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`,
};


const createSortElement = (name, isChecked) => {
  return (`<div class="trip-sort__item  trip-sort__item--${name}">
  <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${name}" ${isChecked ? `checked` : ``}>
  <label class="trip-sort__btn" for="sort-${name}" data-sort-type="${name}" id=${name}>
  ${name}
      ${name !== `event` ? `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z" />
      </svg>` : ``}
  </label>
</div>`);
};


const createSortTemplate = () => {
  const sorts = Object.values(SortType).map((it, index) => createSortElement(it, index === 0)).join(`\n`);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">Day</span>
        ${sorts}
        <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};


export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
