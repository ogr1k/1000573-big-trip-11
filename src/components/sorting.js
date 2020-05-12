import AbstractComponent from "./abstract-component.js";

export const SORT_ELEMENTS = [`event`, `time`, `price`];

export const SortType = {
  PRICE: `price`,
  TIME: `time`,
  DEFAULT: `event`,
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
  const sorts = SORT_ELEMENTS.map((it, index) => createSortElement(it, index === 0)).join(`\n`);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">Day</span>
        ${sorts}
        <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};


export default class SortTemplate extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currenSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }
}
