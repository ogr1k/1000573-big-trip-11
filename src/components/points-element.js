import {setPretext} from "../utils.js";


export const createDayElement = (data, elementIndex) => {
  const {type, destination, price} = data;
  const startEventTime = data.time[0];
  const endEventTime = data.time[1];

  let result;

  const findTimeDifference = () => {
    const different = (endEventTime - startEventTime);

    const hours = Math.floor((different % 86400000) / 3600000);
    const minutes = Math.round(((different % 86400000) % 3600000) / 60000);
    result = `${hours}H ${minutes}M`;
  };

  findTimeDifference();

  const getStringHours = (element) => {
    return element.getHours()
                  .toString();
  };

  const getStringMinutes = (element) => {
    return element.getMinutes()
                  .toString();
  };


  const startEventHours = getStringHours(startEventTime);
  const startEventMinutes = getStringMinutes(startEventTime);
  const endEventHours = getStringHours(endEventTime);
  const endEventMinutes = getStringMinutes(endEventTime);


  setPretext(type);

  return (`
    <li class="trip-events__item">
    <div class="event">
        <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png"
                alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${setPretext(type)} <span class="destination__item">${destination}</span></h3>

        <div class="event__schedule">
            <p class="event__time">
                <time class="event__start-time" datetime="${startEventTime.toISOString()}"> ${startEventHours.length === 1 ? `0` : ``}${startEventHours}:${startEventMinutes.length === 1 ? `0` : ``}${startEventMinutes}</time>
                &mdash;
                <time class="event__end-time" datetime="${endEventTime.toISOString()}">${endEventHours.length === 1 ? `0` : ``}${endEventHours}:${endEventMinutes.length === 1 ? `0` : ``}${endEventMinutes}</time>
            </p>
            <p class="event__duration">${result}</p>
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
  </li>
      `);
};
