import {createElement} from "../utils.js";


const createDayItemsTemplate = (dayCount) => {
  return (
    `<li class="trip-days__item  day">
          <div class="day__info">
              <span class="day__counter">${dayCount}</span>
              <time class="day__date" datetime="2019-03-19">MAR 19</time>
          </div>
          <ul class="trip-events__list">
          </ul>
      </li>`
  );
};

export default class DayItemsTemplate {
  constructor(dayCount) {
    this._count = dayCount;
    this._element = null;
  }

  getTemplate() {
    return createDayItemsTemplate(this._count);
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
