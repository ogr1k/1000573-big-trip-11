import InfoSectionTemplate from "./components/information-section.js";
import InfoTemplate from "./components/information";
import PriceTemplate from "./components/price.js";
import TabsTemplate from "./components/tabs.js";
import TripSectionTemplate from "./components/trip-section.js";
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import FilterController from "./controllers/filter.js";
import API from "./api.js";

import {generateDays} from "./mock/item.js";

import {RenderPosition, render} from "./utils/render.js";
import {findLastElement} from "./utils/common.js";

import {NAVIGATION_ELEMENTS} from "./constants.js";

const POINTS_COUNT = 15;
const AUTHORIZATION = `Basic personal123`;

const data = new API(AUTHORIZATION);
console.log(data.getPoints());

const days = generateDays(POINTS_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(days);

const daysCopy = days.slice();

daysCopy.sort((a, b) => a.date[0] - b.date[0]);

const dayStructure = new Map();
dayStructure.set(daysCopy[0].date[0], [daysCopy[0]]);

const slicedDayStructure = daysCopy.slice(1);
const createStructure = () => {
  slicedDayStructure.map((item) => {
    const keysArray = Array.from(dayStructure.keys());
    const currentLastKey = keysArray[keysArray.length - 1];
    const currentItemDate = item.date[0];
    if (currentLastKey === currentItemDate) {
      dayStructure.get(keysArray[keysArray.length - 1]).push(item);
    } else {
      dayStructure.set(item.date[0], [item]);
    }
  });
};

const keysArray = dayStructure.keys();
console.log(keysArray.length);

createStructure();


console.log(dayStructure);

// console.log([].concat(dayStructure.values()));

const mainTripElement = document.querySelector(`.trip-main`);
render(mainTripElement, new InfoSectionTemplate(), RenderPosition.AFTERBEGIN);

const infoSectionElement = document.querySelector(`.trip-info`);

render(infoSectionElement, new InfoTemplate(), RenderPosition.BEFOREEND);
render(infoSectionElement, new PriceTemplate(), RenderPosition.BEFOREEND);

const filtersContanerElement = document.querySelector(`.trip-controls`);
render(filtersContanerElement, new TabsTemplate(NAVIGATION_ELEMENTS), RenderPosition.AFTERBEGIN);

const filterController = new FilterController(filtersContanerElement, pointsModel);
filterController.render();

const mainContainerElement = document.querySelector(`#js-trip-event`);
const tripSectionComponent = new TripSectionTemplate();
render(mainContainerElement, tripSectionComponent, RenderPosition.BEFOREEND);


const tripController = new TripController(tripSectionComponent, pointsModel);

tripController.render(days);

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
