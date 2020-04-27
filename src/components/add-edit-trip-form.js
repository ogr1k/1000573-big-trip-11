import {TYPES_POINT_TRANSFER} from "../constants.js";
import {TYPES_POINT_ACTIVITY} from "../constants.js";
import {DESTINATIONS_POINT} from "../constants.js";
import {setPretext} from "../utils/common.js";
import {createOptions} from "../utils/common.js";
import AbstractSmartComponent from "./abstact-smart-components.js";
import {optionsMocks} from "../mock/item-options.js";
import {descriptionMocks, imagesMocks} from "../mock/item-description-images.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const getOptionsAndDestinationTemplate = (optionsList, createdOptions, destination, createFormFlag, createdImages, isValidDestination) => {
  return (`<section class="event__details">
      ${
    optionsList.length >= 1 ?
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createdOptions}
        </div>
      </section>` : `` }

      ${isValidDestination ? `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${descriptionMocks[destination]}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${ createFormFlag && !destination ? `` : `${createdImages}`}
          </div>
        </div>
      </section>` : ``}
    </section>`);
};

const renderOption = (option, price, index) => {
  return (`
            <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index + 1}" type="checkbox" name="event-offer-luggage">
            <label class="event__offer-label" for="event-offer-luggage-${index + 1}">
              <span class="event__offer-title">${option}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${price}</span>
            </label>
            </div>
      `);
};

const setTypes = (type) => {
  return (`
    <div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>
  `);
};

const renderImages = (image) => {
  return (`<img class="event__photo" src="${image}" alt="Event photo"/>`);
};

const setDestinationOptions = (destination) => {
  return (`<option value="${destination}"></option>`);
};

const transformFirstLetterToUpperCase = (str) => {
  if (!str) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
};

const checkIsValidDestination = (element) => {
  if (element) {
    for (const point of DESTINATIONS_POINT) {
      if (element === point) {
        return true;
      }
    }
  }
  return false;
};

const createAddEditTripFormTemplate = (itemsData, elements = {}) => {
  const isCreateForm = !itemsData;

  // const date = itemsData.date;
  // const time = itemsData.time;

  let type = elements.type;
  const destination = elements.destination;

  if (isCreateForm && !type) {
    type = `bus`;
  }


  const typeUpperCase = transformFirstLetterToUpperCase(type);

  const optionsList = createOptions(typeUpperCase, optionsMocks);

  let options;
  if (optionsList.length >= 1) {
    options = optionsList.map((it, index) => renderOption(it.name, it.price, index)).join(`\n`);
  }

  let isValidDestination = checkIsValidDestination(destination);

  let images;
  if (isValidDestination) {
    images = imagesMocks[destination].map((it) => renderImages(it)).join(`\n`);
  }
  const transferTypes = TYPES_POINT_TRANSFER.map((it) => setTypes(it)).join(`\n`);
  const activityTypes = TYPES_POINT_ACTIVITY.map((it) => setTypes(it)).join(`\n`);
  const destinationOptions = DESTINATIONS_POINT.map((it) => setDestinationOptions(it)).join(`\n`);
  const pretext = setPretext(typeUpperCase);

  return (
    `<form class="trip-events__item  event  event--edit ${isCreateForm ? `event--create` : ``}" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>
            ${transferTypes.toLowerCase()}
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>

            ${activityTypes.toLowerCase()}

          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${typeUpperCase} ${pretext}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${isCreateForm && !destination ? `` : `${destination}`}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${destinationOptions}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 00:00">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${isCreateForm ? ` ` : `${itemsData.price}` }">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isValidDestination ? `` : `disabled`}>Save</button>
      <button class="event__reset-btn" type="reset">${isCreateForm ? `Cancel` : `Delete`}</button>
      ${ isCreateForm ? `` : `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${itemsData.isFavourite ? `checked` : ``}></input>
      <label class="event__favorite-btn" for="event-favorite-1">
                        <span class="visually-hidden">Add to favorite</span>
                        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
                        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
                        <span class="visually-hidden">Open event</span>
      </button>`}
    </header>

    ${ !isValidDestination && optionsList.length < 1 ? `` :
      getOptionsAndDestinationTemplate(optionsList, options, destination, isCreateForm, images, isValidDestination)}
  </form>`
  );
};


export default class EditTripForm extends AbstractSmartComponent {
  constructor(day) {
    super();

    this._day = day;

    this._clickHandler = null;
    this._submitHandler = null;
    this._flatpickr = null;

    if (day) {
      this._type = day.type;
      this._destination = day.destination;
    }

    this._applyFlatpickr();
    this.setOnEventsListClick();
    this.setOnDestinationInputChange();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const day = this._day;

    this._type = day.type;
    this._destination = day.destination;

    this.rerender();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateElements = this.getElement().querySelectorAll(`.event__input--time`);
    dateElements.forEach((element) => {
      this._flatpickr = flatpickr(element, {
        dateFormat: `d/m/y H:i`,
        allowInput: true,
        defaultDate: `today`,
        enableTime: true,
        minDate: `today`
      });
    });
  }

  getTemplate() {
    return createAddEditTripFormTemplate(this._day, {
      type: this._type,
      destination: this._destination
    });
  }

  recoveryListeners() {
    const flagElement = document.querySelector(`.event--create`);
    if (flagElement === null) {
      this.setOnCloseRollupClick(this._clickHandler);
    }

    this.setOnFormSubmit(this._submitHandler);
    this.setOnEventsListClick();
    this.setOnDestinationInputChange();
  }

  setOnCloseRollupClick(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
    this._clickHandler = handler;
  }

  setOnFormSubmit(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setOnFavClick(handler) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, handler);
  }

  setOnEventsListClick() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      this._type = evt.target.innerText;
      this.rerender();
    });
  }

  setOnDestinationInputChange() {
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      this._destination = evt.target.value;
      this.rerender();
    });

  }
}
