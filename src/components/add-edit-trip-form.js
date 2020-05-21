import {TransferEvents, ActivityEvents, Events} from "../constants.js";
import {setPretext} from "../utils/common.js";
import AbstractSmartComponent from "./abstact-smart-components.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import {EmptyPoint} from "../controllers/point.js";
import PointModel from "../models/point.js";


const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
  cancelButtonText: `Cancel`
};

const createOption = (nameElement, priceElement) => {
  return {
    title: nameElement,
    price: priceElement,
  };
};

const checkIsNewOffer = (currentCheckedOffers, newCheckedOffer) => {
  for (const offer of currentCheckedOffers) {
    if (offer.title === newCheckedOffer.title) {
      return false;
    }
  }
  return true;
};

const getFormData = (elements = {}) => {
  const {flatpickrStart, flatpickrEnd, type, offers, currentDestination} = elements;

  const form = document.querySelector(`.event--edit`);

  const formData = new FormData(form);

  const favouriteElement = form.querySelector(`#event-favorite-1`);

  const parseIsFavourite = () => {
    if (favouriteElement) {
      return favouriteElement.checked;
    }
    return false;
  };

  const formattedStartDate = flatpickrStart.selectedDates[0].toISOString();
  const formattedEndDate = flatpickrEnd.selectedDates[0].toISOString();


  return new PointModel({
    "id": form.id,
    "destination": currentDestination,
    "base_price": Number(formData.get(`event-price`)),
    "date_from": formattedStartDate,
    "date_to": formattedEndDate,
    "type": Events[type],
    "offers": offers,
    "is_favorite": parseIsFavourite(),
    "dateDiff": formattedEndDate - formattedStartDate
  });
};

const getOptionsAndDestinationTemplate = (optionsList, createdOptions, destination, createdImages, destinationNames) => {
  const isValidDestination = checkIsValidDestination(destination.name, destinationNames);
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
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${ !destination ? `` : `${createdImages}`}
          </div>
        </div>
      </section>` : ``}
    </section>`);
};

const renderOption = (option, price, index, isChecked, isRequesting) => {
  return (`
            <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index + 1}" type="checkbox" name="event-offer-luggage" ${isChecked ? `checked` : ``} ${isRequesting ? `disabled` : ``}>
            <label class="event__offer-label" for="event-offer-luggage-${index + 1}">
              <span class="event__offer-title">${option}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${price}</span>
            </label>
            </div>
      `);
};

const setTypes = (types, activeType) => (
  Object.entries(types).map((type) => {
    const key = type[0];
    const value = type[1];
    const loweredValue = value.toLowerCase();
    return (`
    <div class="event__type-item">
    <input id="event-type-${loweredValue}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${key}" ${value === activeType ? `checked` : ``}>
    <label class="event__type-label  event__type-label--${loweredValue}" for="event-type-${loweredValue}-1">${value}</label>
    </div>
  `);
  })
);

const renderImages = (image) => {
  return (`<img class="event__photo" src="${image.src}" alt="${image.description}"/>`);
};

const setDestinationOptions = (destination) => {
  return (`<option value="${destination}"></option>`);
};


const checkIsValidDestination = (element, validDestinations) => {
  if (element) {
    for (const point of validDestinations) {
      if (element === point) {
        return true;
      }
    }
  }
  return false;
};

const findIsCheckedOption = (element, checkedOffers) => {
  for (const offer of checkedOffers) {
    if (element === offer.title) {
      return true;
    }
  }
  return false;
};

const getAvailableOffers = (elementType, offers) => {
  for (const offer of offers) {
    if (elementType === offer.type) {
      return offer;
    }
  }
  return null;
};

const getDestinationNames = (elements) => {
  let names = [];
  elements.map((element) => {
    names.push(element.name);
  });
  return names;
};

const findCurrentDestination = (currentDestination, allDestinations) => {
  for (const destination of allDestinations) {
    if (currentDestination === destination.name) {
      return destination;
    }
  }
  return false;
};

const createAddEditTripFormTemplate = (itemsData, allAvailableDestinations, allAvailableOffers, elements = {}) => {
  const isCreateForm = (itemsData === EmptyPoint);

  const id = elements.id;
  const destinationsNames = getDestinationNames(allAvailableDestinations);
  const isRequesting = elements.isRequesting;

  const type = Events[elements.type];
  const availableOffers = getAvailableOffers(type.toLowerCase(), allAvailableOffers).offers;
  const currentDestination = findCurrentDestination(elements.destination, allAvailableDestinations);


  const deleteButtonText = elements.externalData.deleteButtonText;
  const cancelButtonText = elements.externalData.cancelButtonText;
  const saveButtonText = elements.externalData.saveButtonText;

  const date = elements.date;
  const price = elements.price;
  const isFavourite = elements.isFavourite;

  const checkedOptions = elements.offers;


  let offers;
  if (availableOffers.length >= 1) {
    offers = availableOffers.map((it, index) => renderOption(it.title, it.price, index, findIsCheckedOption(it.title, checkedOptions), isRequesting)).join(`\n`);
  }

  const isValidDestination = checkIsValidDestination(currentDestination.name, destinationsNames);


  let images;
  if (isValidDestination) {
    images = currentDestination.pictures.map((it) => renderImages(it)).join(`\n`);
  }

  const transferTypes = setTypes(TransferEvents, type).join(`\n`);
  const activityTypes = setTypes(ActivityEvents, type).join(`\n`);
  const destinationOptions = destinationsNames.map((it) => setDestinationOptions(it)).join(`\n`);
  const pretext = setPretext(type);

  const optionAndDestinationTemplate = getOptionsAndDestinationTemplate(availableOffers, offers, currentDestination, images, destinationsNames);

  return (
    `<form class="trip-events__item  event  event--edit ${isCreateForm ? `event--create` : ``}" action="#" method="post" id="${id}">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox"  ${isRequesting ? `disabled` : ``}>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>
            ${transferTypes}
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>

            ${activityTypes}

          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type} ${pretext}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${isCreateForm && !currentDestination ? `` : `${currentDestination.name}`}" list="destination-list-1" ${isRequesting ? `readonly` : ``}>
        <datalist id="destination-list-1">
        ${destinationOptions}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${ isCreateForm ? `` : `${date[0]}`}" ${isRequesting ? `disabled` : ``}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${ isCreateForm ? `` : `${date[1]}`}" ${isRequesting ? `disabled` : ``}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number"  min="1" step="1" name="event-price" value="${price}" autocomplete="off" ${isRequesting ? `readonly` : ``}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${!isValidDestination || price <= 0 || isRequesting ? `disabled` : ``}>${saveButtonText}</button>
      <button class="event__reset-btn" type="reset" ${isRequesting ? `disabled` : ``}>${isCreateForm ? `${cancelButtonText}` : `${deleteButtonText}`}</button>
      ${ isCreateForm ? `` : `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavourite ? `checked` : ``} ${isRequesting ? `disabled` : ``}></input>
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

    ${ !isValidDestination && availableOffers.length < 1 ? `` :
      optionAndDestinationTemplate}
  </form>`
  );
};


export default class EditTripForm extends AbstractSmartComponent {
  constructor(point, destinations, offers) {
    super();

    this._point = point;
    this._allDestinations = destinations;
    this._allOffers = offers;

    this._isRequesting = false;

    this._clickHandler = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._favouriteHandler = null;

    this._externalData = DefaultData;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._id = ``;
    if (point) {
      this._id = point.id;
      this._type = point.type;
      this._destination = point.destination.name;
      this._dates = [...point.date];
      this._price = point.price;
      this._isFavourite = point.isFavourite;
      this._offers = [...point.offers];
    }

    if (!point) {
      this._dates = [];
    }

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const day = this._point;

    this._type = day.type;
    this._dates = [...day.date];
    this._destination = day.destination.name;
    this._id = day.id;
    this._price = day.price;
    this._isFavourite = day.isFavourite;
    this._offers = [...day.offers];
    this._isRequesting = false;
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
      enableTime: true,
      defaultDate: new Date()
    };

    let startDate;

    if (this._dates) {
      startDate = moment(this._dates[0]).toDate();
      flatpickrSettings.defaultDate = startDate;
    }


    this._flatpickrStart = flatpickr(startTimeElement, flatpickrSettings);

    if (this._dates) {
      flatpickrSettings.minDate = startDate;
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
    return createAddEditTripFormTemplate(this._point, this._allDestinations, this._allOffers, {
      type: this._type,
      destination: this._destination,
      date: this._dates,
      id: this._id,
      price: this._price,
      offers: this._offers,
      isFavourite: this._isFavourite,
      externalData: this._externalData,
      isRequesting: this._isRequesting,
    });
  }

  recoveryListeners() {

    if (this.getElement().querySelector(`.event__rollup-btn`)) {
      this.setOnCloseRollupClick(this._clickHandler);
      this.setOnFavouriteClick(this._favouriteHandler);
    }

    this.setOnFormSubmit(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);

    this._subscribeOnEvents();
  }

  setDataAndBlockForm(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.changeIsRequesting(true);
  }

  getData() {
    const currentDestination = findCurrentDestination(this._destination, this._allDestinations);

    return getFormData({
      flatpickrStart: this._flatpickrStart,
      flatpickrEnd: this._flatpickrEnd,
      type: this._type,
      offers: this._offers,
      currentDestination
    });
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  changeIsFavourite() {
    this._isFavourite = !this._isFavourite;
  }

  changeIsRequesting(data) {
    this._isRequesting = data;
    this.rerender();
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

  setOnFavouriteClick(handler) {
    this.getElement().querySelector(`.event__favorite-icon`).
    addEventListener(`click`, handler);

    this._favouriteHandler = handler;
  }

  removeOnFavouriteClick(handler) {
    const favouriteElement = this.getElement().querySelector(`.event__favorite-icon`);

    if (favouriteElement) {
      this.getElement().querySelector(`.event__favorite-icon`).
    removeEventListener(`click`, handler);


      this._favouriteHandler = handler;
    }
  }

  _subscribeOnEvents() {
    this.setOnEventsListClick();
    this.setOnDestinationInputChange();
    this.setOnStartDateChanged();
    this.setOnEndDateChanged();
    this.setOnPriceChanged();
    this.setOnOfferClick();
  }

  setOnStartDateChanged() {
    this.getElement().querySelector(`#event-start-time-1`)
      .addEventListener(`change`, () => {
        const pickedStartDate = this._flatpickrStart.selectedDates[0];
        this._dates[0] = pickedStartDate;
        this._flatpickrEnd.set(`minDate`, new Date(pickedStartDate));

        if (moment(this._flatpickrEnd.selectedDates[0]).isBefore(moment(pickedStartDate))) {
          this._flatpickrEnd.setDate(new Date(pickedStartDate));
        }
      });
  }

  setOnEndDateChanged() {
    this.getElement().querySelector(`#event-end-time-1`)
      .addEventListener(`change`, () => {
        this._dates[1] = this._flatpickrEnd.selectedDates[0];
      });
  }

  setOnEventsListClick() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      if (evt.target.control.value !== this._type) {
        this._type = evt.target.control.value;
        this._offers = [];
      }

      this.rerender();
    });
  }

  setOnDestinationInputChange() {
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      this._destination = evt.target.value;
      this.rerender();
    });
  }

  setOnPriceChanged() {
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      this._price = evt.target.value;
      this.rerender();
    });
  }

  setOnOfferClick() {
    const offersElements = this.getElement().querySelectorAll(`.event__offer-label`);

    offersElements.forEach((element) => {
      element.addEventListener(`click`, (evt) => {

        const title = evt.currentTarget.querySelector(`.event__offer-title`).textContent;
        const price = Number(evt.currentTarget.querySelector(`.event__offer-price`).textContent);
        const newClickedOffer = createOption(title, price);
        const isNewOffer = checkIsNewOffer(this._offers, newClickedOffer);


        if (!evt.currentTarget.control.checked) {
          if (isNewOffer) {
            this._offers.push(newClickedOffer);
          }
        } else {
          this._offers = this._offers.filter((offer) => {
            return offer.title !== newClickedOffer.title;
          });
        }
      });
    });
  }
}
