import EditTripForm from "../components/add-edit-trip-form.js";
import DayItemsTemplate from "../components/day-items.js";
import TripDaysListTemplate from "../components/days-list.js";
import DayItem from "../components/points-element.js";
import EventOption from "../components/points-option.js";
import SortTemplate from "../components/sorting.js";
import NoPointsTemplate from "../components/no-points.js";
import NewEventButton from "../components/new-event-button.js";
import {RenderPosition, replace, remove, render} from "../utils/render.js";
import {getRandomArrayItem} from "../utils/common.js";

import {SORT_ELEMENTS} from "../constants.js";

import {days} from "../main.js";

const DAY_COUNT = 3;
const POINTS_PER_DAY_COUNT = 5;

const mainTripElement = document.querySelector(`.trip-main`);

const renderOptions = (element, currentItem) => {
  render(element, new EventOption(currentItem), RenderPosition.BEFOREEND);
};

const renderDay = (index, action) => {
  const dayComponent = new DayItemsTemplate(index + 1);
  const tripDaysElement = document.querySelector(`.trip-days`);
  render(tripDaysElement, dayComponent, RenderPosition.BEFOREEND);
  const itemsList = dayComponent.getElement().querySelector(`.trip-events__list`);
  action(itemsList);
};

const renderDates = (container, noPointsComponent, action) => {

  if (DAY_COUNT === 0) {
    render(container, noPointsComponent, RenderPosition.BEFOREEND);
    return;
  }

  for (let i = 0; i < DAY_COUNT; i++) {
    renderDay(i, action);
  }
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._sortComponent = new SortTemplate(SORT_ELEMENTS);
    this._daysComponent = new TripDaysListTemplate();
    this._newEventButtonComponent = new NewEventButton();
    this._noPointsComponent = new NoPointsTemplate();
    this._newEditFormComponent = new EditTripForm();
  }

  render() {
    render(this._container.getElement(), this._sortComponent, RenderPosition.BEFOREEND);

    render(this._container.getElement(), this._daysComponent, RenderPosition.BEFOREEND);

    render(mainTripElement, this._newEventButtonComponent, RenderPosition.BEFOREEND);

    const tripDaysElement = document.querySelector(`.trip-days`);


    let currentOpenedFormComponent;
    let currentItemForReplacementComponent;
    let createFormElement;

    const resetCurrentElements = () => {
      currentOpenedFormComponent = undefined;
      currentItemForReplacementComponent = undefined;
      createFormElement = undefined;
    };

    const hideNewEventForm = () => {
      remove(this._newEditFormComponent);
      this._newEventButtonComponent.setOnClick(onAddEventButtonClick);
    };

    const checkOpenedFormsAndRemove = () => {
      if (createFormElement) {
        hideNewEventForm();
      }

      if (currentOpenedFormComponent) {
        replace(currentItemForReplacementComponent, currentOpenedFormComponent);
      }
      resetCurrentElements();
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        checkOpenedFormsAndRemove();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };


    const renderDayItem = (element) => {
      for (let i = 0; i < POINTS_PER_DAY_COUNT; i++) {

        const currentItem = getRandomArrayItem(days);
        const dayItemComponent = new DayItem(currentItem);
        render(element, dayItemComponent, RenderPosition.BEFOREEND);

        const editComponent = new EditTripForm(currentItem);

        const removeListeners = () => {
          editComponent.removeOnCloseRollupClick(onCloseRollupClick);
          editComponent.removeOnFormSubmit(onEditFormSubmit);
        };

        const onCloseRollupClick = () => {
          checkOpenedFormsAndRemove();
          removeListeners();
          dayItemComponent.setOnRollupClick(onRollUpClick);
        };


        const onEditFormSubmit = () => {
          checkOpenedFormsAndRemove();
          removeListeners();
          dayItemComponent.setOnRollupClick(onRollUpClick);
        };

        const onRollUpClick = () => {
          dayItemComponent.removeOnRollupClick(onRollUpClick);
          checkOpenedFormsAndRemove();

          currentOpenedFormComponent = editComponent;
          currentItemForReplacementComponent = dayItemComponent;


          document.addEventListener(`keydown`, onEscKeyDown);

          replace(currentOpenedFormComponent, currentItemForReplacementComponent);

          editComponent.setOnCloseRollupClick(onCloseRollupClick);
          editComponent.setOnFormSubmit(onEditFormSubmit);
        };

        dayItemComponent.setOnRollupClick(onRollUpClick);


        const optionsContainer = dayItemComponent.getElement().querySelector(`.event__selected-offers`);
        currentItem.options.map((it) => renderOptions(optionsContainer, it)).join(`\n`);
      }
    };


    renderDates(this._container, this._noPointsComponent, renderDayItem);


    const onCreateFormSubmit = () => {
      hideNewEventForm();
    };

    const onAddEventButtonClick = () => {
      if (currentOpenedFormComponent) {
        replace(currentItemForReplacementComponent, currentOpenedFormComponent);
      }

      document.addEventListener(`keydown`, onEscKeyDown);

      createFormElement = this._newEditFormComponent.getElement();


      render(this._container.getElement(), this._newEditFormComponent, RenderPosition.BEFOREBEGIN, tripDaysElement);
      this._newEventButtonComponent.removeOnClick(onAddEventButtonClick);
      this._newEditFormComponent.setOnFormSubmit(onCreateFormSubmit);
    };

    this._newEventButtonComponent.setOnClick(onAddEventButtonClick);
  }
}
