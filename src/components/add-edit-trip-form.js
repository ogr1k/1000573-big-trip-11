import {TYPES_POINT_TRANSFER, TYPES_POINT_ACTIVITY, DESTINATIONS_POINT} from "../constants.js";
import {setPretext, createOptions} from "../utils/common.js";
import AbstractSmartComponent from "./abstact-smart-components.js";
import {optionsMocks} from "../mock/item-options.js";
import {descriptionMocks, imagesMocks} from "../mock/item-description-images.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import {EmptyPoint} from "../controllers/point.js";


const createOption = (nameElement, priceElement, typeElement) => {
  return {
    name: nameElement,
    price: priceElement,
    type: typeElement
  };
};

const parseFormData = (formData, form, start, end) => {
  const typeText = form.querySelector(`.event__type-output`).textContent.split(` `);
  const optionNameElement = Array.from(form.querySelectorAll(`.event__offer-title`));
  let optionsArray = [];
  if (optionNameElement) {
    const optionName = optionNameElement.textContent;
    const optionPrice = form.querySelectorAll(`.event__offer-price`);
    optionNameElement.map((it, index) => {
      optionsArray.push(createOption(it.textContent, optionPrice[index].textContent, optionName));
    });
  }
  return {
    id: form.id,
    destination: formData.get(`event-destination`),
    price: formData.get(`event-price`),
    date: [moment(start.selectedDates[0]), moment(end.selectedDates[0])],
    type: typeText[10],
    options: optionsArray
  };
};

const getOptionsAndDestinationTemplate = (optionsList, createdOptions, destination, createdImages) => {
  const isValidDestination = checkIsValidDestination(destination);
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
          ${ !destination ? `` : `${createdImages}`}
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
  const isCreateForm = (itemsData === EmptyPoint);
  const id = elements.id;
  let type = elements.type;
  const destination = elements.destination;
  const date = elements.date;


  if (isCreateForm && !type) {
    type = `bus`;
  }


  const typeUpperCase = transformFirstLetterToUpperCase(type);

  const optionsList = createOptions(typeUpperCase, optionsMocks);

  let options;
  if (optionsList.length >= 1) {
    options = optionsList.map((it, index) => renderOption(it.name, it.price, index)).join(`\n`);
  }

  const isValidDestination = checkIsValidDestination(destination);

  let images;
  if (isValidDestination) {
    images = imagesMocks[destination].map((it) => renderImages(it)).join(`\n`);
  }
  const transferTypes = TYPES_POINT_TRANSFER.map((it) => setTypes(it)).join(`\n`);
  const activityTypes = TYPES_POINT_ACTIVITY.map((it) => setTypes(it)).join(`\n`);
  const destinationOptions = DESTINATIONS_POINT.map((it) => setDestinationOptions(it)).join(`\n`);
  const pretext = setPretext(typeUpperCase);

  const optionAndDestinationTemplate = getOptionsAndDestinationTemplate(optionsList, options, destination, images);

  return (
    `<form class="trip-events__item  event  event--edit ${isCreateForm ? `event--create` : ``}" action="#" method="post" id="${id}">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" value="">

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
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${ isCreateForm ? `` : `${date[0]}`}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${ isCreateForm ? `` : `${date[1]}`}">
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
      optionAndDestinationTemplate}
  </form>`
  );
};


export default class EditTripForm extends AbstractSmartComponent {
  constructor(day) {
    super();

    this._day = day;

    this._clickHandler = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._id = ``;
    if (day) {
      this._id = day.id;
      this._type = day.type;
      this._destination = day.destination;
      this._dates = [...day.date];
      this._price = day.price;
    }

    if (!day) {
      this._dates = [];
    }

    this._applyFlatpickr();
    this.setOnEventsListClick();
    this.setOnDestinationInputChange();
    this.setOnStartDateChanged();
    this.setOnEndDateChanged();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const day = this._day;

    this._type = day.type;
    this._dates = [...day.date];
    this._destination = day.destination;
    this._price = day.price;
    this._id = day.id;
    this.rerender();
  }

  removeElement() {
    if (this._flatpickrStart && this._flatpickrEnd) {
      this._destroyFlatpickrs();
    }

    super.removeElement();
  }

  _applyFlatpickr() {
    if (this._flatpickrStart && this._flatpickrEnd) {
      this._destroyFlatpickrs();
    }

    const startTimeElement = this.getElement().querySelector(`#event-start-time-1`);
    const endTimeElement = this.getElement().querySelector(`#event-end-time-1`);

    const flatpickrSettings = {
      altInput: true,
      altFormat: `d/m/y H:i`,
      dateFormat: `d/m/y H:i`,
      // eslint-disable-next-line
      time_24hr: true,
      enableTime: true,
      defaultDate: new Date()
    };

    let startDateObject;

    if (this._dates) {
      startDateObject = moment(this._dates[0]).toDate();
      flatpickrSettings.defaultDate = startDateObject;
    }


    this._flatpickrStart = flatpickr(startTimeElement, flatpickrSettings);

    if (this._dates) {
      flatpickrSettings.minDate = startDateObject;
      flatpickrSettings.defaultDate = moment(this._dates[1]).toDate();
    }

    this._flatpickrEnd = flatpickr(endTimeElement, flatpickrSettings);
  }

  _destroyFlatpickrs() {
    this._flatpickrStart.destroy();
    this._flatpickrStart = null;
    this._flatpickrEnd.destroy();
    this._flatpickrEnd = null;
  }

  getTemplate() {
    return createAddEditTripFormTemplate(this._day, {
      type: this._type,
      destination: this._destination,
      date: this._dates,
      id: this._id
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
    this.setOnStartDateChanged();
    this.setOnEndDateChanged();
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
  }

  getData() {
    const form = document.querySelector(`.event--edit`);
    const formData = new FormData(form);

    return parseFormData(formData, form, this._flatpickrStart, this._flatpickrEnd);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setOnStartDateChanged() {
    this.getElement().querySelector(`#event-start-time-1`)
      .addEventListener(`change`, () => {
        this._dates[0] = this._flatpickrStart.selectedDates[0];
        const pickedStartDate = this._flatpickrStart.selectedDates[0];
        this._flatpickrEnd.set(`minDate`, new Date(pickedStartDate));
      });
  }

  setOnEndDateChanged() {
    this.getElement().querySelector(`#event-end-time-1`)
      .addEventListener(`change`, () => {
        this._dates[1] = this._flatpickrEnd.selectedDates[0];
      });
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

  setOnEventsListClick() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `LABEL`) {
        return;
      }

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
