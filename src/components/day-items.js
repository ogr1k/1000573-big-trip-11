import AbstractComponent from "./abstract-component.js";


const createDayItemsTemplate = (date, dayCount) => {

  if (!date && !dayCount) {
    date = ``;
    dayCount = ``;
  }

  return (
    `<li class="trip-days__item  day">
          <div class="day__info">
              <span class="day__counter">${dayCount}</span>
              <time class="day__date" datetime="${date}">${date}</time>
          </div>
          <ul class="trip-events__list">
          </ul>
      </li>`
  );
};

export default class DaysItems extends AbstractComponent {
  constructor(dayDate, dayCount) {
    super();

    this._dayDate = dayDate;
    this._count = dayCount;
  }

  getTemplate() {
    return createDayItemsTemplate(this._dayDate, this._count);
  }
}
