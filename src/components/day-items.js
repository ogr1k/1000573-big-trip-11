import AbstractComponent from "./abstract-component.js";


const createDayItemsTemplate = (date, dayCount) => {
  return (
    `<li class="trip-days__item  day">
          <div class="day__info">
              <span class="day__counter">${dayCount}</span>
              <time class="day__date" datetime="2019-03-19">${date}</time>
          </div>
          <ul class="trip-events__list">
          </ul>
      </li>`
  );
};

export default class DayItemsTemplate extends AbstractComponent {
  constructor(dayDate, dayCount) {
    super();

    this._dayDate = dayDate;
    this._count = dayCount;
  }

  getTemplate() {
    return createDayItemsTemplate(this._dayDate, this._count);
  }
}
