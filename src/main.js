import {createInfoSectionTemplate} from "./components/information-section.js";
import {createInfoTemplate} from "./components/information";
import {createPriceTemplate} from "./components/price.js";
import {createTabsTemplate} from "./components/tabs.js";
import {createFiltersTemplate} from "./components/filters.js";
import {createSortTemplate} from "./components/sorting.js";
import {createAddEditTripFormTemplate} from "./components/add-edit-trip-form.js";
import {createTripDaysListTemplate} from "./components/days-list.js";
import {createDayItemsTemplate} from "./components/day-items.js";
import {generateDays} from "./mock/item.js";
import {createDayElement} from "./components/points-element.js";
import {createEventOptionElement} from "./components/points-option.js";
import {getRandomIntegerNumber} from "../src/utils.js";
import {getRandomArrayItem} from "../src/utils.js";
import {findLastElement} from "../src/utils.js";
import {isEscEvent} from "../src/utils.js";
import {NAVIGATION_ELEMENTS} from "./mock/filters-sort.js";
import {FILTER_ELEMENTS} from "./mock/filters-sort.js";
import {SORT_ELEMENTS} from "./mock/filters-sort.js";

const DAY_COUNT = 3;
const POINTS_COUNT = 15;
const POINTS_PER_DAY_COUNT = 5;

const days = generateDays(POINTS_COUNT);

const render = (container, template, where) => {
  container.insertAdjacentHTML(where, template);
};

const mainTripElement = document.querySelector(`.trip-main`);
render(mainTripElement, createInfoSectionTemplate(), `afterbegin`);

const infoSectionElement = document.querySelector(`.trip-info`);
render(infoSectionElement, createInfoTemplate(), `beforeend`);
render(infoSectionElement, createPriceTemplate(), `beforeend`);

const filtersHeaderElement = document.querySelector(`.filters-header`);
render(filtersHeaderElement, createTabsTemplate(NAVIGATION_ELEMENTS), `beforebegin`);
render(filtersHeaderElement, createFiltersTemplate(FILTER_ELEMENTS), `afterend`);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createSortTemplate(SORT_ELEMENTS), `beforeend`);

render(tripEventsElement, createTripDaysListTemplate(), `beforeend`);

const tripDaysElement = document.querySelector(`.trip-days`);


for (let i = 0; i < DAY_COUNT; i++) {
  render(tripDaysElement, createDayItemsTemplate(i + 1), `beforeend`);
  for (let k = 0 + (i * POINTS_PER_DAY_COUNT); k < POINTS_PER_DAY_COUNT + (i * POINTS_PER_DAY_COUNT); k++) {
    render(findLastElement(`.trip-events__list`), createDayElement(days[k]), `beforeend`);
    for (let j = 0; j < getRandomIntegerNumber(0, days[k].options.length); j++) {
      render(findLastElement(`.event__selected-offers`), createEventOptionElement(days[k].options[j]), `beforeend`);
    }
  }
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

const newEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);

const tripSortFormelement = document.querySelector(`.trip-sort`);
const createNewEventForm = () => {
  render(tripSortFormelement, createAddEditTripFormTemplate(getRandomArrayItem(days), `create--form`, `Cancel`), `afterend`);
};

const rollupElement = document.querySelector(`.event__rollup-btn`);

const createEditEventForm = () => {
  render(rollupElement.parentNode, createAddEditTripFormTemplate(getRandomArrayItem(days), `edit--form`, `Delete`, `edit`), `afterend`);
};

const removeCreateFormElement = () => {
  const createFormElement = document.querySelector(`.trip-events__item`);
  createFormElement.remove();
};

const removeEditFormElement = () => {
  const editFormElement = tripDaysElement.querySelector(`.edit--form`);
  editFormElement.remove();
  rollupElement.addEventListener(`click`, onRollUpClick);
};

const onRollUpClick = () => {
  createEditEventForm();
  rollupElement.removeEventListener(`click`, onRollUpClick);
  const editFormElement = document.querySelector(`.edit--form`);
  const rollUpCloseElement = editFormElement.querySelector(`.event__rollup-btn`);
  rollUpCloseElement.addEventListener(`click`, removeEditFormElement);
};

rollupElement.addEventListener(`click`, onRollUpClick);


const onEventButtonClick = () => {
  createNewEventForm();
  newEventButtonElement.removeEventListener(`click`, onEventButtonClick);
  document.addEventListener(`keydown`, onDocumentKeydown);
};

const onDocumentKeydown = (evt) => {
  isEscEvent(evt, removeCreateFormElement);
  newEventButtonElement.addEventListener(`click`, onEventButtonClick);
};

newEventButtonElement.addEventListener(`click`, onEventButtonClick);
