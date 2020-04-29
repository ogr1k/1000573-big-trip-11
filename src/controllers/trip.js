import DayItemsTemplate from "../components/day-items.js";
import TripDaysListTemplate from "../components/days-list.js";
import SortTemplate from "../components/sorting.js";
import NoPointsTemplate from "../components/no-points.js";
import NewEventButton from "../components/new-event-button.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import PointController from "./point.js";
import EditTripForm from "../components/add-edit-trip-form.js";

import {SORT_ELEMENTS} from "../constants.js";

const DAY_COUNT = 3;
const POINTS_PER_DAY_COUNT = 5;

const mainTripElement = document.querySelector(`.trip-main`);

const renderDayItem = (container, days, onDataChange, onViewChange) => {
  return days.map((item) => {
    const pointController = new PointController(container, onDataChange, onViewChange);
    pointController.render(item);

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

    this._sortComponent = new SortTemplate(SORT_ELEMENTS);
    this._daysComponent = new TripDaysListTemplate();
    this._newEventButtonComponent = new NewEventButton();
    this._noPointsComponent = new NoPointsTemplate();

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render() {
    const container = this._container.getElement();
    const points = this._pointsModels.getTasks();

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);
    render(mainTripElement, this._newEventButtonComponent, RenderPosition.BEFOREEND);
    const tripDaysElement = document.querySelector(`.trip-days`);

    const onNewEventButtonClick = () => {
      const pointEditComponent = new EditTripForm();
      this._onViewChange();
      document.addEventListener(`keydown`, this._onEscKeyDown);
      render(container, pointEditComponent, RenderPosition.BEFOREBEGIN, tripDaysElement);
      pointEditComponent.setOnFormSubmit(() => {
        remove(pointEditComponent);
        document.removeEventListener(`keydown`, this._onEscKeyDown.bind(pointEditComponent));
      });
    };

    this._newEventButtonComponent.setOnClick(onNewEventButtonClick);

    const renderDay = (index) => {
      const dayComponent = new DayItemsTemplate(index + 1);
      render(tripDaysElement, dayComponent, RenderPosition.BEFOREEND);
      const itemsList = dayComponent.getElement().querySelector(`.trip-events__list`);
      const calculatedIndex = index * POINTS_PER_DAY_COUNT;
      const pointsList = points.slice(calculatedIndex, calculatedIndex + POINTS_PER_DAY_COUNT);
      const newPoints = renderDayItem(itemsList, pointsList, this._onDataChange, this._onViewChange);
      this._showedPointControllers = this._showedPointControllers.concat(newPoints);
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
  }

  _onDataChange(pointController, oldData, newData) {
    const isSuccess = this._pointsModels.updateTask(oldData.id, newData);

    if (isSuccess) {
      pointController.render(newData);
    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      const createFormElement = document.querySelector(`.event--create`);
      if (createFormElement) {
        createFormElement.remove();
      }
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
