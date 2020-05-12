import DayItemsTemplate from "../components/day-items.js";
import TripDaysListTemplate from "../components/days-list.js";
import SortTemplate, {SortType} from "../components/sorting.js";
import NoPointsTemplate from "../components/no-points.js";
import NewEventButton from "../components/new-event-button.js";
import {RenderPosition, render} from "../utils/render.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point.js";

import {FilterType} from "../constants.js";

const mainTripElement = document.querySelector(`.trip-main`);


const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];
  const showingPoints = points.slice();

  switch (sortType) {
    case SortType.PRICE:
      sortedPoints = showingPoints.sort((a, b) => a.price - b.price);
      break;
    case SortType.TIME:
      sortedPoints = showingPoints.sort((a, b) => a.dateDiff - b.dateDiff);
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

const renderPoint = (points, onDataChange, onViewChange, noPointContainer, noPointComponent, isSorted) => {

  if (points.length === 0) {
    render(noPointContainer.getElement(), noPointComponent, RenderPosition.BEFOREEND);
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
      const pointController = new PointController(container, onDataChange, onViewChange);
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
        const pointController = new PointController(container, onDataChange, onViewChange);
        pointController.render(item, PointControllerMode.DEFAULT);

        pointControllers.push(pointController);
      });
    });
  }
  return pointControllers;
};


export default class TripController {
  constructor(container, pointsModels) {
    this._container = container;
    this._pointsModels = pointsModels;

    this._showedPointControllers = [];

    this._isSorted = false;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent = new SortTemplate(Object.values(SortType));
    this._daysComponent = new TripDaysListTemplate();
    this._newEventButtonComponent = new NewEventButton();
    this._noPointsComponent = new NoPointsTemplate();

    this._pointsModels.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const container = this._container.getElement();
    const points = this._pointsModels.getPoints();
    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);
    render(mainTripElement, this._newEventButtonComponent, RenderPosition.BEFOREEND);

    const onNewEventButtonClick = () => {
      this._onViewChange();
      this.createPoint();
      this._setDefaultFilterAndSort();
      this._newEventButtonComponent.getElement().disabled = true;
    };

    this._newEventButtonComponent.setOnClick(onNewEventButtonClick);

    this._renderPoint(points);
  }

  createPoint() {
    const pointsDay = document.querySelector(`.trip-days__item`);
    const pointController = new PointController(pointsDay, this._onDataChange, this._onViewChange);
    pointController.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _setDefaultFilterAndSort() {
    this._isSorted = false;
    document.querySelector(`#filter-${FilterType.EVERYTHING}`).checked = true;
    this._pointsModels.setFilter(FilterType.EVERYTHING);
    this._onSortTypeChange(SortType.DEFAULT);
  }

  _removePoints() {
    if (this._showedPointControllers.length) {
      this._showedPointControllers.forEach((controller) => controller.destroy());
    }
    this._showedPointControllers = [];
  }

  _renderPoint(elements) {
    const newPoints = renderPoint(elements, this._onDataChange, this._onViewChange, this._container, this._noPointsComponent, this._isSorted);
    if (elements.length) {
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
        this._updatePoints();
      }
    } else if (newData === null) {
      this._pointsModels.removePoint(oldData.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModels.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
        this._updatePoints();
      }
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

    if (sortType !== SortType.DEFAULT) {
      this._isSorted = true;
    } else {
      this._isSorted = false;
    }

    const sortInput = this._sortComponent.getElement().querySelector(`#sort-${sortType}`);
    sortInput.checked = true;

    this._removePoints();
    this._removeDays();
    this._renderPoint(sortedPoints);
  }
}
