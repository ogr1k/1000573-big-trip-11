import EditTripForm from "./components/add-edit-trip-form.js";
import DayItemsTemplate from "./components/day-items.js";
import TripDaysListTemplate from "./components/days-list.js";
import FilterTemplate from "./components/filters.js";
import InfoSectionTemplate from "./components/information-section.js";
import InfoTemplate from "./components/information";
import DayItem from "./components/points-element.js";
import EventOption from "./components/points-option.js";
import PriceTemplate from "./components/price.js";
import SortTemplate from "./components/sorting.js";
import TabsTemplate from "./components/tabs.js";

import {generateDays} from "./mock/item.js";
// import {isEscEvent} from "../src/utils.js";
import {render, RenderPosition} from "./utils.js";
import {getRandomArrayItem} from "./utils.js";
import {findLastElement} from "./utils.js";


import {NAVIGATION_ELEMENTS} from "../src/constants.js";
import {FILTER_ELEMENTS} from "../src/constants.js";
import {SORT_ELEMENTS} from "../src/constants.js";

const DAY_COUNT = 3;
const POINTS_COUNT = 15;
const POINTS_PER_DAY_COUNT = 5;

const days = generateDays(POINTS_COUNT);


const mainTripElement = document.querySelector(`.trip-main`);
render(mainTripElement, new InfoSectionTemplate().getElement(), RenderPosition.AFTERBEGIN);

const infoSectionElement = document.querySelector(`.trip-info`);

render(infoSectionElement, new InfoTemplate().getElement(), RenderPosition.BEFOREEND);
render(infoSectionElement, new PriceTemplate().getElement(), RenderPosition.BEFOREEND);

const filtersContanerElement = document.querySelector(`.trip-controls`);
render(filtersContanerElement, new TabsTemplate(NAVIGATION_ELEMENTS).getElement(), RenderPosition.AFTERBEGIN);
render(filtersContanerElement, new FilterTemplate(FILTER_ELEMENTS).getElement(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, new SortTemplate(SORT_ELEMENTS).getElement(), RenderPosition.BEFOREEND);

render(tripEventsElement, new TripDaysListTemplate().getElement(), RenderPosition.BEFOREEND);

const tripDaysElement = document.querySelector(`.trip-days`);

const renderOptions = (element, currentItem) => {
  render(element, new EventOption(currentItem).getElement(), RenderPosition.BEFOREEND);
};

let currentDay1;
let currentForm;
let currentItem1;


const renderDayItem = (element, currentDay) => {
  for (let i = 0; i < POINTS_PER_DAY_COUNT; i++) {

    const currentItem = getRandomArrayItem(days);
    const dayItemComponent = new DayItem(currentItem);
    render(element, dayItemComponent.getElement(), RenderPosition.BEFOREEND);
    const rollUp = dayItemComponent.getElement().querySelector(`.event__rollup-btn`);

    const editComponent = new EditTripForm(currentItem);

    const onRollUpClick = () => {
      if (currentForm !== undefined) {
        currentDay1.replaceChild(currentForm, currentItem1);
      }
      currentDay1 = currentDay;
      console.log(currentDay1);
      currentForm = editComponent.getElement();
      console.log(currentForm);
      currentItem1 = dayItemComponent.getElement();
      console.log(currentItem1);

      currentDay1.replaceChild(currentForm, currentItem1);
      closeRollup.addEventListener(`click`, onCloseRollupClick);
      editComponent.getElement().addEventListener(`submit`, onEditFormSubmit);
      rollUp.removeEventListener(`click`, onRollUpClick);
    };

    rollUp.addEventListener(`click`, onRollUpClick);

    const closeRollup = editComponent.getElement().querySelector(`.event__rollup-btn`);

    const replaceFormOnItem = (evt) => {
      evt.preventDefault();
      currentDay.replaceChild(dayItemComponent.getElement(), editComponent.getElement());
      closeRollup.removeEventListener(`click`, onCloseRollupClick);
      editComponent.getElement().removeEventListener(`submit`, onEditFormSubmit);
      rollUp.addEventListener(`click`, onRollUpClick);
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
  render(tripDaysElement, dayComponent.getElement(), RenderPosition.BEFOREEND);
  const itemsList = dayComponent.getElement().querySelector(`.trip-events__list`);
  renderDayItem(itemsList, itemsList);
};

for (let i = 0; i < DAY_COUNT; i++) {
  renderDay(i);
}

const daysListElements = Array.from(document.querySelectorAll(`.trip-events__list`));
const destination = daysListElements.map((it) => findLastElement(`.destination__item`, it).textContent).join(` &mdash; `);

document.querySelector(`.trip-info__title`).innerHTML = `${destination}`;

const tripCostElement = document.querySelector(`.trip-info__cost-value`);
const summ = Array.from(document.querySelectorAll(`.event__price-value`));

const finalSumm = summ.reduce((accumulator, currentvalue) => {
  return accumulator + Number(currentvalue.textContent);
}, 0);

tripCostElement.innerHTML = `${finalSumm}`;

export {days};

// const newEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);

// const tripSortFormelement = document.querySelector(`.trip-sort`);
// const createNewEventForm = () => {
//   render(tripSortFormelement, createAddEditTripFormTemplate(), `afterend`);
// };

// const rollupElement = document.querySelector(`.event__rollup-btn`);
// const rollupElements = document.querySelectorAll(`.event__rollup-btn`);

// const createEditEventForm = (evt) => {
//   const elementIndex = evt.target.id;
//   render(evt.target.parentNode, createAddEditTripFormTemplate(days[elementIndex]), `afterend`);
// };

// const removeFormElement = () => {
//   const createFormElement = document.querySelector(`.event--edit`);
//   if (createFormElement !== null) {
//     createFormElement.remove();
//   }
// };

// const onCloseRollUpClick = () => {
//   removeFormElement();
//   rollupElement.addEventListener(`click`, onRollUpClick);
// };

// const onRollUpClick = (evt) => {
//   removeFormElement();
//   createEditEventForm(evt);
//   const formElement = document.querySelector(`.event--edit`);
//   const rollUpCloseElement = formElement.querySelector(`.event__rollup-btn`);
//   rollUpCloseElement.addEventListener(`click`, onCloseRollUpClick);
//   newEventButtonElement.addEventListener(`click`, onEventButtonClick);
// };

// rollupElements.forEach((rollUp) => {
//   rollUp.addEventListener(`click`, onRollUpClick);
// });


// const onEventButtonClick = () => {
//   removeFormElement();
//   createNewEventForm();
//   newEventButtonElement.removeEventListener(`click`, onEventButtonClick);
//   document.addEventListener(`keydown`, onDocumentKeydown);
//   rollupElement.addEventListener(`click`, onRollUpClick);
// };

// const onDocumentKeydown = (evt) => {
//   isEscEvent(evt, removeFormElement);
//   rollupElement.addEventListener(`click`, onRollUpClick);
//   newEventButtonElement.addEventListener(`click`, onEventButtonClick);
// };

// newEventButtonElement.addEventListener(`click`, onEventButtonClick);
