import {setPretext, formatTime} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";
import moment from "moment";
import {Events} from "../constants.js";


const NOT_VALID_CASES = [`00D`, `00H`, `00M`];

const getFinalDifferenceResult = (startTime, endTime) => {
  const duration = moment.duration(endTime.diff(startTime));

  const daysDifferenceDuration = moment.duration(duration).days();
  const formattedDays = daysDifferenceDuration >= 10 ? daysDifferenceDuration : `0${daysDifferenceDuration}`;
  const differenceResult = moment.utc(duration.asMilliseconds()).format(`${formattedDays}[D] HH[H] mm[M]`);

  const resultToString = differenceResult.split(` `);

  const checkValid = () => {
    let resultString = ``;
    for (let i = 0; i < resultToString.length; i++) {
      if (NOT_VALID_CASES[i] !== resultToString[i]) {
        resultString += `${resultToString[i]} `;
      }
    }
    return resultString;
  };

  return (checkValid());
};

const createDayElement = (data, elementIndex) => {
  let {type, destination, price, dateDifference} = data;

  type = Events[type.replace(`-`, ``).toUpperCase()];
  const startTime = data.date[0];
  const endTime = data.date[1];

  // console.log(moment.utc(dateDifference).format(`DD[day], HH[hour and] m [min]`));

  let x = 433276000;
  let tempTime = moment.duration(x);
  let y = ` ${tempTime.hours()} ${tempTime.minutes()} `;

  console.log(y);

  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);
  const differenceResult = getFinalDifferenceResult(startTime, endTime);

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


export default class DayItem extends AbstractComponent {
  constructor(day, index) {
    super();

    this._day = day;
    this._index = index;
  }

  getTemplate() {
    return createDayElement(this._day, this._index);
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
