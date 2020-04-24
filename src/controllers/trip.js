import DayItemsTemplate from "../components/day-items.js";
import TripDaysListTemplate from "../components/days-list.js";
import SortTemplate from "../components/sorting.js";
import NoPointsTemplate from "../components/no-points.js";
import NewEventButton from "../components/new-event-button.js";
import {RenderPosition, render} from "../utils/render.js";
import PointController from "./point.js";
import EditTripForm from "../components/add-edit-trip-form.js";

import {SORT_ELEMENTS} from "../constants.js";

const DAY_COUNT = 3;
const POINTS_PER_DAY_COUNT = 5;

const mainTripElement = document.querySelector(`.trip-main`);

const renderDayItem = (container, days, onDataChange, daysIndex, onViewChange) => {
  return days.map((item, index) => {
    const pointController = new PointController(container, onDataChange, onViewChange);
    const indexForTypes = index + daysIndex;
    pointController.render(item, indexForTypes);

    return pointController;
  });
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._points = [];

    this._showedPointControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent = new SortTemplate(SORT_ELEMENTS);
    this._daysComponent = new TripDaysListTemplate();
    this._newEventButtonComponent = new NewEventButton();
    this._noPointsComponent = new NoPointsTemplate();
  }

  render(points) {
    this._points = points;
    render(this._container.getElement(), this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container.getElement(), this._daysComponent, RenderPosition.BEFOREEND);
    render(mainTripElement, this._newEventButtonComponent, RenderPosition.BEFOREEND);
    const tripDaysElement = document.querySelector(`.trip-days`);

    const onNewEventButtonClick = () => {
      this._onViewChange();
      render(this._container.getElement(), new EditTripForm(), RenderPosition.BEFOREBEGIN, tripDaysElement);
    };

    this._newEventButtonComponent.setOnClick(onNewEventButtonClick);

    const renderDay = (index, elements) => {
      const dayComponent = new DayItemsTemplate(index + 1);
      render(tripDaysElement, dayComponent, RenderPosition.BEFOREEND);
      const itemsList = dayComponent.getElement().querySelector(`.trip-events__list`);
      const calculatedIndex = index * POINTS_PER_DAY_COUNT;
      const daysList = elements.slice(calculatedIndex, calculatedIndex + POINTS_PER_DAY_COUNT);
      const newPoints = renderDayItem(itemsList, daysList, this._onDataChange, calculatedIndex, this._onViewChange);
      this._showedPointControllers = this._showedPointControllers.concat(newPoints);
    };

    const renderDates = (container, noPointsComponent, elements) => {

      if (DAY_COUNT === 0) {
        render(container, noPointsComponent, RenderPosition.BEFOREEND);
        return;
      }

      for (let i = 0; i < DAY_COUNT; i++) {
        renderDay(i, elements);
      }
    };

    renderDates(this._container, this._noPointsComponent, points);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._points.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));

    pointController.render(this._points[index]);
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }
}
