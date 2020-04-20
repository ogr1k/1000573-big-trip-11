import EditTripForm from "../components/add-edit-trip-form.js";
import DayItemsTemplate from "../components/day-items.js";
import TripDaysListTemplate from "../components/days-list.js";
import DayItem from "../components/points-element.js";
import EventOption from "../components/points-option.js";
import SortTemplate from "../components/sorting.js";
import NoPointsTemplate from "../components/no-points.js";
import NewEventButton from "../components/new-event-button.js";
import {RenderPosition, replace, remove, render} from "../utils/render.js";
import {getRandomArrayItem} from "../utils.js";

import {SORT_ELEMENTS} from "../constants.js";

import {days} from "../main.js";

const DAY_COUNT = 3;
const POINTS_PER_DAY_COUNT = 5;

const mainTripElement = document.querySelector(`.trip-main`);


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

    const renderOptions = (element, currentItem) => {
      render(element, new EventOption(currentItem), RenderPosition.BEFOREEND);
    };

    let currentOpenedFormComponent;
    let currentItemForReplacementComponent;

    const resetCurrentElements = () => {
      currentOpenedFormComponent = undefined;
      currentItemForReplacementComponent = undefined;
      createFormElement = undefined;
    };

    const replaceCurrentEditFormOnDay = () => {
      replace(currentOpenedFormComponent, currentItemForReplacementComponent);
    };

    const checkElementsAndRemove = () => {
      if (createFormElement) {
        remove(this._newEditFormComponent);
        this._newEventButtonComponent.setOnEventButtonClick(onEventButtonClick);
        resetCurrentElements();
      }

      if (currentOpenedFormComponent) {
        replace(currentItemForReplacementComponent, currentOpenedFormComponent);
      }
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        checkElementsAndRemove();
        document.removeEventListener(`keydown`, onEscKeyDown);
        resetCurrentElements();
      }
    };


    const renderDayItem = (element) => {
      for (let i = 0; i < POINTS_PER_DAY_COUNT; i++) {

        const currentItem = getRandomArrayItem(days);
        const dayItemComponent = new DayItem(currentItem);
        render(element, dayItemComponent, RenderPosition.BEFOREEND);

        const editComponent = new EditTripForm(currentItem);

        const onRollUpClick = () => {

          checkElementsAndRemove();

          currentOpenedFormComponent = editComponent;
          currentItemForReplacementComponent = dayItemComponent;


          document.addEventListener(`keydown`, onEscKeyDown);

          replaceCurrentEditFormOnDay();

          editComponent.setOnCloseRollupClick(onCloseRollupClick);
          editComponent.setOnFormSubmit(onEditFormSubmit);
        };

        dayItemComponent.setOnRollupClick(onRollUpClick);

        const replaceFormOnItem = (evt) => {
          evt.preventDefault();
          replace(dayItemComponent, editComponent);
          editComponent.removeOnCloseRollupClick(onCloseRollupClick);
          editComponent.removeOnFormSubmit(onEditFormSubmit);
          dayItemComponent.setOnRollupClick(onRollUpClick);
          resetCurrentElements();
        };

        const onCloseRollupClick = (evt) => {
          replaceFormOnItem(evt);
        };


        const onEditFormSubmit = (evt) => {
          replaceFormOnItem(evt);
        };

        const optionsContainer = dayItemComponent.getElement().querySelector(`.event__selected-offers`);
        currentItem.options.map((it) => renderOptions(optionsContainer, it)).join(`\n`);
      }
    };

    const renderDay = (index) => {
      const dayComponent = new DayItemsTemplate(index + 1);
      render(tripDaysElement, dayComponent, RenderPosition.BEFOREEND);
      const itemsList = dayComponent.getElement().querySelector(`.trip-events__list`);
      renderDayItem(itemsList);
    };

    const renderDates = () => {

      if (DAY_COUNT === 0) {
        render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
        return;
      }

      for (let i = 0; i < DAY_COUNT; i++) {
        renderDay(i);
      }
    };

    renderDates();

    let createFormElement;

    const onCreateFormSubmit = () => {
      remove(this._newEditFormComponent);
      this._newEventButtonComponent.setOnEventButtonClick(onEventButtonClick);
    };

    const onEventButtonClick = () => {
      if (currentOpenedFormComponent) {
        replace(currentItemForReplacementComponent, currentOpenedFormComponent);
      }

      document.addEventListener(`keydown`, onEscKeyDown);

      createFormElement = this._newEditFormComponent.getElement();

      render(this._container.getElement(), this._newEditFormComponent, RenderPosition.BEFOREBEGIN);
      this._newEventButtonComponent.removeOnEventButtonClick(onEventButtonClick);
      createFormElement.addEventListener(`submit`, onCreateFormSubmit);
    };

    this._newEventButtonComponent.setOnEventButtonClick(onEventButtonClick);
  }
}
