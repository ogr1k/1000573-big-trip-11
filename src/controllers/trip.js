import DayItemsTemplate from "../components/day-items.js";
import TripDaysListTemplate from "../components/days-list.js";
import SortTemplate from "../components/sorting.js";
import NoPointsTemplate from "../components/no-points.js";
import NewEventButton from "../components/new-event-button.js";
import {RenderPosition, render} from "../utils/render.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point.js";

import {SORT_ELEMENTS} from "../constants.js";
const DAY_COUNT = 3;

const mainTripElement = document.querySelector(`.trip-main`);

const renderPoint = (points, onDataChange, onViewChange) => {

  return points.map((item) => {

    const container = document.querySelectorAll(`.trip-events__list`)[item.parentIndex];
    const pointController = new PointController(container, onDataChange, onViewChange);
    pointController.render(item, PointControllerMode.DEFAULT);

    return pointController;
  });
};


export default class TripController {
  constructor(container, pointsModels) {
    this._container = container;
    this._pointsModels = pointsModels;

    this._showedPointControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent = new SortTemplate(SORT_ELEMENTS);
    this._daysComponent = new TripDaysListTemplate();
    this._newEventButtonComponent = new NewEventButton();
    this._noPointsComponent = new NoPointsTemplate();

    this._pointsModels.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const points = this._pointsModels.getPoints();

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);
    render(mainTripElement, this._newEventButtonComponent, RenderPosition.BEFOREEND);
    const tripDaysElement = document.querySelector(`.trip-days`);

    const onNewEventButtonClick = () => {
      this._onViewChange();
      this.createPoint();

    };

    this._newEventButtonComponent.setOnClick(onNewEventButtonClick);

    const renderDay = (index) => {
      const dayCount = index + 1;
      const dayComponent = new DayItemsTemplate(dayCount);
      render(tripDaysElement, dayComponent, RenderPosition.BEFOREEND);
    };


    const renderDates = (datesContainer, noPointsComponent) => {

      if (DAY_COUNT === 0) {
        render(datesContainer, noPointsComponent, RenderPosition.BEFOREEND);
        return;
      }

      for (let i = 0; i < DAY_COUNT; i++) {
        renderDay(i);
      }
    };

    renderDates(this._container, this._noPointsComponent, points);
    this._renderPoint(points);
  }

  createPoint() {
    const pointsDay = document.querySelector(`.trip-days__item`);
    const pointController = new PointController(pointsDay, this._onDataChange, this._onViewChange);
    pointController.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _removePoints() {
    this._showedPointControllers.forEach((controller) => controller.destroy());
    this._showedPointControllers = [];
  }

  _renderPoint(elements) {
    const newPoints = renderPoint(elements, this._onDataChange, this._onViewChange);
    this._showedPointControllers = this._showedPointControllers.concat(newPoints);
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoint(this._pointsModels.getPoints());
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModels.addPoint(newData);
        pointController.render(newData, PointControllerMode.DEFAULT, true);

        this._showedPointControllers = [].concat(pointController, this._showedPointControllers);

      }
    } else if (newData === null) {
      this._pointsModels.removePoint(oldData.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModels.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updatePoints();
  }
}
