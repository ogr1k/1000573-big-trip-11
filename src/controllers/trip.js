import DayItemsTemplate from "../components/day-items.js";
import TripDaysList from "../components/days-list.js";
import Sort, {SortType} from "../components/sorting.js";
import NoPointsMessage from "../components/no-points.js";
import {RenderPosition, render} from "../utils/render.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point.js";
import {newEventButtonComponent} from "../main.js";

import {FilterType} from "../constants.js";

const mainTripElement = document.querySelector(`.trip-main`);
const noPointsComponent = new NoPointsMessage();


const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];
  const showingPoints = points.slice();
  switch (sortType) {
    case SortType.PRICE:
      sortedPoints = showingPoints.sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      sortedPoints = showingPoints.sort((a, b) => b.dateDifference - a.dateDifference);
      break;
    case SortType.DEFAULT:
      sortedPoints = showingPoints;
      break;
  }

  return sortedPoints.slice();
};

const getPointsStructure = (points) => {
  const daysCopy = [...points];

  daysCopy.sort((a, b) => a.date[0] - b.date[0]);

  const dayStructure = new Map();
  dayStructure.set(daysCopy[0].date[0].format(`MMMM D`), [daysCopy[0]]);

  const slicedDayStructure = daysCopy.slice(1);
  slicedDayStructure.map((item) => {
    const keysArray = Array.from(dayStructure.keys());
    const currentLastKey = keysArray[keysArray.length - 1];
    const currentItemDate = item.date[0].format(`MMMM D`);
    if (currentLastKey === currentItemDate) {
      dayStructure.get(keysArray[keysArray.length - 1]).push(item);
    } else {
      dayStructure.set(item.date[0].format(`MMMM D`), [item]);
    }
  });
  return dayStructure;
};

const renderPoints = (elements = {}) => {
  const {points, destinations, offers, onDataChange, onViewChange, noPointContainer, isSorted} = elements;
  if (points.length === 0) {
    render(noPointContainer.getElement(), noPointsComponent, RenderPosition.BEFOREEND);
    return null;
  }

  let pointControllers = [];

  const tripDaysElement = document.querySelector(`.trip-days`);

  const renderDay = (item, index) => {
    const dayCount = index + 1;
    const dayComponent = new DayItemsTemplate(item, dayCount);
    render(tripDaysElement, dayComponent, RenderPosition.BEFOREEND);
  };

  if (isSorted) {
    renderDay();
    const container = document.querySelector(`.trip-events__list`);
    points.map((item) => {
      const pointController = new PointController(container, onDataChange, onViewChange, destinations, offers);
      pointController.render(item, PointControllerMode.DEFAULT);

      pointControllers.push(pointController);
    });
  } else {
    const dayStructure = getPointsStructure(points);
    const structureDates = Array.from(dayStructure.keys());


    const renderDates = () => {

      structureDates.map((item, index) =>{
        renderDay(item, index);
      });
    };

    renderDates();

    structureDates.map((it, index) => {
      const structuredPoints = dayStructure.get(it);
      const container = document.querySelectorAll(`.trip-events__list`)[index];
      structuredPoints.map((item) => {
        const pointController = new PointController(container, onDataChange, onViewChange, destinations, offers);
        pointController.render(item, PointControllerMode.DEFAULT);

        pointControllers.push(pointController);
      });
    });
  }
  return pointControllers;
};


export default class TripController {
  constructor(container, pointsModels, api) {
    this._container = container;
    this._pointsModels = pointsModels;

    this._offers = [];
    this._destinations = [];

    this._api = api;

    this._showedPointControllers = [];

    this._isSorted = false;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent = new Sort(Object.values(SortType));
    this._daysComponent = new TripDaysList();

    this._pointsModels.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  render() {
    const container = this._container.getElement();
    const points = this._pointsModels.getPoints();
    this._offers = this._pointsModels.getOffers();
    this._destinations = this._pointsModels.getDestinations();
    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);
    render(mainTripElement, newEventButtonComponent, RenderPosition.BEFOREEND);


    const onNewEventButtonClick = () => {
      this._onViewChange();
      this.createPoint();
      this._setDefaultFilterAndSort();
      newEventButtonComponent.getElement().disabled = true;
    };

    newEventButtonComponent.getElement().disabled = false;

    newEventButtonComponent.setOnClick(onNewEventButtonClick);

    this._renderPoint(points);
  }

  createPoint() {
    const pointsDay = document.querySelector(`.trip-days__item`);
    const pointController = new PointController(pointsDay, this._onDataChange, this._onViewChange, this._destinations, this._offers);
    pointController.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _setDefaultFilterAndSort() {
    if (this._sorted === true) {
      this._isSorted = false;
      this._sortComponent.getElement().querySelector(`.trip-sort__item--day`).textContent = `Day`;
    }

    const filterElement = document.querySelector(`#filter-${FilterType.EVERYTHING}`);

    if (filterElement.checked === false) {

      document.querySelector(`#filter-${FilterType.EVERYTHING}`).checked = true;
      this._pointsModels.setFilter(FilterType.EVERYTHING);
      this._onSortTypeChange(SortType.DEFAULT);

    }

  }

  _removePoints() {
    if (this._showedPointControllers.length) {
      this._showedPointControllers.forEach((controller) => controller.destroy());
    }
    this._showedPointControllers = [];
  }

  _renderPoint(points) {
    const newPoints = renderPoints({
      points,
      destinations: this._destinations,
      offers: this._offers,
      onDataChange: this._onDataChange,
      onViewChange: this._onViewChange,
      container: this._container,
      isSorted: this._isSorted
    });
    if (points.length) {
      this._showedPointControllers = this._showedPointControllers.concat(newPoints);
    }
  }

  _removeDays() {
    const daysElements = document.querySelectorAll(`.trip-days__item`);
    if (daysElements) {
      daysElements.forEach((day) => {
        day.remove();
      });
    }
  }

  _updatePoints() {
    this._removePoints();
    this._removeDays();
    this._renderPoint(this._pointsModels.getPoints(), this._destinations, this._offers);
  }

  _catchRequestError(controller) {
    controller.shake();
    controller.rerenderEditForm();
  }

  _onDataChange(pointController, oldData, newData, star) {

    if (star) {
      this._api.updatePoint(oldData.id, newData).
      then(() => pointController.rerenderEditForm())
      .catch(() => {
        this._catchRequestError(pointController);
      });
      return;
    }

    if (oldData === EmptyPoint) {
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._api.createPoint(newData)
        .then((pointModel) => {
          this._pointsModels.addPoint(pointModel);
          pointController.render(pointModel, PointControllerMode.DEFAULT);

          this._showedPointControllers = [].concat(pointController, this._showedPointControllers);
          this._updatePoints();
        })
        .catch(() => {
          this._catchRequestError(pointController);
        });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
      .then(() => {
        this._pointsModels.removePoint(oldData.id);
        this._updatePoints();
      })
      .catch(() => {
        this._catchRequestError(pointController);
      });
    } else {
      this._api.updatePoint(oldData.id, newData)
      .then((pointModel) => {
        const isSuccess = this._pointsModels.updatePoint(oldData.id, pointModel);

        if (isSuccess) {
          pointController.render(pointModel, PointControllerMode.DEFAULT);
          this._updatePoints();
        }
      })
      .catch(() => {
        this._catchRequestError(pointController);
      });
    }
  }

  _onViewChange() {
    if (this._showedPointControllers.length) {
      this._showedPointControllers.forEach((it) => it.setDefaultView());
    }
  }

  _onFilterChange() {
    this._updatePoints();
  }

  _onSortTypeChange(sortType) {
    const sortedPoints = getSortedPoints(this._pointsModels.getPoints(), sortType);

    const daySortElement = this._sortComponent.getElement().querySelector(`.trip-sort__item--day`);

    if (sortType !== SortType.DEFAULT) {
      this._isSorted = true;
      daySortElement.textContent = ``;
    } else {
      this._isSorted = false;
      daySortElement.textContent = `Day`;
    }

    const sortInput = this._sortComponent.getElement().querySelector(`#sort-${sortType}`);
    sortInput.checked = true;

    this._removePoints();
    this._removeDays();
    this._renderPoint(sortedPoints);
  }
}
