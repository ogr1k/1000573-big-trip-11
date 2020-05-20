import InformationSection from "./components/information.js";
import Loading from "./components/loading.js";
import Tabs from "./components/tabs.js";
import Statistics from "./components/statistic.js";
import TripSection from "./components/trip-section.js";
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import FilterController from "./controllers/filter.js";
import NewEventButton from "./components/new-event-button.js";
import API from "./api.js";

import {RenderPosition, render, remove} from "./utils/render.js";
import {NavigationTypes} from "./constants.js";

const AUTHORIZATION = `Basic er895jdzbdw`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(AUTHORIZATION, END_POINT);

const pointsModel = new PointsModel();

const mainTripElement = document.querySelector(`.trip-main`);
render(mainTripElement, new InformationSection(), RenderPosition.AFTERBEGIN);

const filtersContainerElement = document.querySelector(`.trip-controls`);
const tabsComponent = new Tabs(Object.values(NavigationTypes));
render(filtersContainerElement, tabsComponent, RenderPosition.AFTERBEGIN);

const newEventButtonComponent = new NewEventButton();
render(mainTripElement, newEventButtonComponent, RenderPosition.BEFOREEND);

const filterController = new FilterController(filtersContainerElement, pointsModel);
filterController.render();

const mainContainerElement = document.querySelector(`#js-trip-event`);

const loadingComponent = new Loading();
render(mainContainerElement, loadingComponent, RenderPosition.BEFOREEND);

const tripSectionComponent = new TripSection();
render(mainContainerElement, tripSectionComponent, RenderPosition.BEFOREEND);


const tripController = new TripController(tripSectionComponent, pointsModel, api);

const statisticsComponent = new Statistics(pointsModel);
render(mainContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

tabsComponent.setOnChange((menuItem) => {

  tabsComponent.setActive(menuItem);

  if (menuItem === NavigationTypes.DEFAULT) {
    statisticsComponent.hide();
    tripController.show();
    return;
  }

  if (menuItem === NavigationTypes.STATS) {
    tripController.hide();
    statisticsComponent.show();
    return;
  }
});


Promise.all([api.getDestinations(), api.getOffers(), api.getPoints()]).then(
    ([destinations, offers, points]) => {
      pointsModel.setDestinations(destinations);
      pointsModel.setOffers(offers);
      pointsModel.setPoints(points);
      remove(loadingComponent);
      tripController.render();
    });

export {newEventButtonComponent};
