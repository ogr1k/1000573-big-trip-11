import AbstractComponent from "./abstract-component.js";


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

export default class DayItemsTemplate extends AbstractComponent {
  constructor(dayCount) {
    super();

    this._count = dayCount;
  }

  getTemplate() {
    return createDayItemsTemplate(this._count);
  }
}
