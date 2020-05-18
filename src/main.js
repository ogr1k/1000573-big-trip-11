import InfoSectionTemplate from "./components/information-section.js";
import InfoTemplate from "./components/information";
import PriceTemplate from "./components/price.js";
import TabsTemplate from "./components/tabs.js";
import Statistics from "./components/statistic.js";
import TripSectionTemplate from "./components/trip-section.js";
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import FilterController from "./controllers/filter.js";
import API from "./api.js";

// import {generateDays} from "./mock/item.js";

import {RenderPosition, render} from "./utils/render.js";
import {NAVIGATION_ELEMENTS} from "./constants.js";

const AUTHORIZATION = `Basic er883jdzbdw`;

const api = new API(AUTHORIZATION);

// const POINTS_COUNT = 15;

// const days = generateDays(POINTS_COUNT);
const pointsModel = new PointsModel();

// pointsModel.setPoints(days);


const mainTripElement = document.querySelector(`.trip-main`);
render(mainTripElement, new InfoSectionTemplate(), RenderPosition.AFTERBEGIN);

const infoSectionElement = document.querySelector(`.trip-info`);

render(infoSectionElement, new InfoTemplate(), RenderPosition.BEFOREEND);
render(infoSectionElement, new PriceTemplate(), RenderPosition.BEFOREEND);

const filtersContanerElement = document.querySelector(`.trip-controls`);
const tabsComponent = new TabsTemplate(NAVIGATION_ELEMENTS);
render(filtersContanerElement, tabsComponent, RenderPosition.AFTERBEGIN);

const filterController = new FilterController(filtersContanerElement, pointsModel);
filterController.render();

const mainContainerElement = document.querySelector(`#js-trip-event`);
const tripSectionComponent = new TripSectionTemplate();
render(mainContainerElement, tripSectionComponent, RenderPosition.BEFOREEND);


const tripController = new TripController(tripSectionComponent, pointsModel, api);

const statisticsComponent = new Statistics(pointsModel);
render(mainContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

tabsComponent.setOnChange((menuItem) => {

  tabsComponent.setActive(menuItem);

  if (menuItem === `Table`) {
    statisticsComponent.hide();
    tripController.show();
    return;
  }

  if (menuItem === `Stats`) {
    tripController.hide();
    statisticsComponent.show();
    return;
  }
});

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(points);
    tripController.render();
  });

// const getDestinations = (element) => {
//   return element;
// };

// api.getDestinations()
// .then((dest) => {
//   getDestinations(dest);
// });
