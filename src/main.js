import InfoSectionTemplate from "./components/information-section.js";
import InfoTemplate from "./components/information";
import Loading from "./components/loading.js";
import PriceTemplate from "./components/price.js";
import TabsTemplate from "./components/tabs.js";
import Statistics from "./components/statistic.js";
import TripSectionTemplate from "./components/trip-section.js";
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import FilterController from "./controllers/filter.js";
import NewEventButton from "./components/new-event-button.js";
import API from "./api.js";

import {RenderPosition, render, remove} from "./utils/render.js";
import {NAVIGATION_ELEMENTS} from "./constants.js";

const AUTHORIZATION = `Basic er894jdzbdw`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(AUTHORIZATION, END_POINT);

const pointsModel = new PointsModel();


const mainTripElement = document.querySelector(`.trip-main`);
render(mainTripElement, new InfoSectionTemplate(), RenderPosition.AFTERBEGIN);

const infoSectionElement = document.querySelector(`.trip-info`);

render(infoSectionElement, new InfoTemplate(), RenderPosition.BEFOREEND);
render(infoSectionElement, new PriceTemplate(), RenderPosition.BEFOREEND);

const filtersContanerElement = document.querySelector(`.trip-controls`);
const tabsComponent = new TabsTemplate(NAVIGATION_ELEMENTS);
render(filtersContanerElement, tabsComponent, RenderPosition.AFTERBEGIN);

const newEventButtonComponent = new NewEventButton();
render(mainTripElement, newEventButtonComponent, RenderPosition.BEFOREEND);

const filterController = new FilterController(filtersContanerElement, pointsModel);
filterController.render();

const mainContainerElement = document.querySelector(`#js-trip-event`);

const loadingComponent = new Loading();
render(mainContainerElement, loadingComponent, RenderPosition.BEFOREEND);

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

let allAvailableDestinations;
let allAvailableOffers;

Promise.all([api.getDestinations(), api.getOffers(), api.getPoints()]).then(
    ([destinations, offers, points]) => {
      allAvailableDestinations = destinations;
      allAvailableOffers = offers;
      pointsModel.setPoints(points);
      remove(loadingComponent);
      tripController.render();
    });

export {newEventButtonComponent, allAvailableDestinations, allAvailableOffers};
