import {createInfoSectionTemplate} from "./components/information-section.js";
import {createInfoTemplate} from "./components/information";
import {createPriceTemplate} from "./components/price.js";
import {createTabsTemplate} from "./components/tabs.js";
import {createFiltersTemplate} from "./components/filters.js";
import {createSortTemplate} from "./components/sorting.js";
import {createAddEditTripFormTemplate} from "./components/form.js";
import {createTripDaysListTemplate} from "./components/days-list.js";
import {createDayItemsTemplate} from "./components/day-items.js";

const DAY_COUNT = 3;

const render = (container, template, where) => {
  container.insertAdjacentHTML(where, template);
};

const mainTripElement = document.querySelector(`.trip-main`);
render(mainTripElement, createInfoSectionTemplate(), `afterbegin`);

const infoSectionElement = document.querySelector(`.trip-info`);
render(infoSectionElement, createInfoTemplate(), `beforeend`);
render(infoSectionElement, createPriceTemplate(), `beforeend`);

const filtersHeaderElement = document.querySelector(`.filters-header`);
render(filtersHeaderElement, createTabsTemplate(), `beforebegin`);
render(filtersHeaderElement, createFiltersTemplate(), `afterend`);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createSortTemplate(), `beforeend`);
render(tripEventsElement, createAddEditTripFormTemplate(), `beforeend`);

render(tripEventsElement, createTripDaysListTemplate(), `beforeend`);

const tripDaysElement = document.querySelector(`.trip-days`);

for (let i = 0; i < DAY_COUNT; i++) {
  render(tripDaysElement, createDayItemsTemplate(i + 1), `beforeend`);
}
