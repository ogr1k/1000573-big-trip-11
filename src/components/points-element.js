import {setPretext, formatTime} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";
import moment from "moment";
import {Events} from "../constants.js";

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;

const formatDifference = (element, text) => {
  if (element === 0) {
    return ``;
  }
  return `${(element).toString().padStart(2, `0`)}${text}`;
};

const createDayElement = (data, elementIndex) => {
  let {type, destination, price, dateDifference} = data;

  type = Events[type];
  const startTime = data.date[0];
  const endTime = data.date[1];


  const duration = moment.duration(dateDifference);

  const daysDifference = Math.floor(duration.asDays());
  const hoursDifference = Math.floor(duration.asHours() - daysDifference * HOURS_PER_DAY);
  const minsDifference = Math.floor(duration.asMinutes() - (hoursDifference * MINUTES_PER_HOUR) - (daysDifference * MINUTES_PER_DAY));

  const differenceResult = `${formatDifference(daysDifference, `D`)} ${formatDifference(hoursDifference, `H`)} ${formatDifference(minsDifference, `M`)}`;
  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);

  setPretext(type);

  return (
    `<li class="trip-events__item">
    <div class="event">
        <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png"
                alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${setPretext(type)} <span class="destination__item">${destination.name}</span></h3>

        <div class="event__schedule">
            <p class="event__time">
                <time class="event__start-time" datetime="${formattedStartTime}">${formattedStartTime}</time>
                &mdash;
                <time class="event__end-time" datetime="${formattedEndTime}">${formattedEndTime}</time>
            </p>
            <p class="event__duration">${differenceResult}</p>
        </div>

        <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        </ul>

        <button class="event__rollup-btn" type="button" id="${elementIndex}">
            <span class="visually-hidden">Open event</span>
        </button>
    </div>
  </li>`);
};


export default class Point extends AbstractComponent {
  constructor(point, index) {
    super();

    this._point = point;
    this._index = index;
  }

  getTemplate() {
    return createDayElement(this._point, this._index);
  }

  setOnRollupClick(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }

  removeOnRollupClick(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .removeEventListener(`click`, handler);
  }
}
