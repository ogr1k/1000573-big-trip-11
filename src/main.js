// import {createInfoSectionTemplate} from "./components/information-section.js";
// import {createInfoTemplate} from "./components/information";
// import {createPriceTemplate} from "./components/price.js";
// import {createTabsTemplate} from "./components/tabs.js";
// import {createFiltersTemplate} from "./components/filters.js";
// import {createSortTemplate} from "./components/sorting.js";
// import {createAddEditTripFormTemplate} from "./components/add-edit-trip-form.js";
// import {createTripDaysListTemplate} from "./components/days-list.js";
// import {createDayItemsTemplate} from "./components/day-items.js";
// import {createDayElement} from "./components/points-element.js";
// import {createEventOptionElement} from "./components/points-option.js";
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
import {findLastElement} from "../src/utils.js";
import {isEscEvent} from "../src/utils.js";
import {render, RenderPosition} from "./utils.js";

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

for (let i = 0; i < DAY_COUNT; i++) {
  render(tripDaysElement, new DayItemsTemplate(i + 1).getElement(), RenderPosition.BEFOREEND);
  for (let k = 0 + (i * POINTS_PER_DAY_COUNT); k < POINTS_PER_DAY_COUNT + (i * POINTS_PER_DAY_COUNT); k++) {
    render(findLastElement(`.trip-events__list`), new DayItem(days[k], k).getElement(), RenderPosition.BEFOREEND);
    // for (let j = 0; j < days[k].options.length; j++) {
    //   render(findLastElement(`.event__selected-offers`), new EventOption(days[k].options[j]).getElement(), RenderPosition.BEFOREEND);
    // }
  }
}


// const daysListElements = Array.from(document.querySelectorAll(`.trip-events__list`));
// const destination = daysListElements.map((it) => findLastElement(`.destination__item`, it).textContent).join(` &mdash; `);

// document.querySelector(`.trip-info__title`).innerHTML = `${destination}`;

// const tripCostElement = document.querySelector(`.trip-info__cost-value`);
// const summ = Array.from(document.querySelectorAll(`.event__price-value`));

// const finalSumm = summ.reduce((accumulator, currentvalue) => {
//   return accumulator + Number(currentvalue.textContent);
// }, 0);

// tripCostElement.innerHTML = `${finalSumm}`;

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

export {days};
