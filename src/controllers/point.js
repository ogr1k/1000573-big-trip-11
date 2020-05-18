import {RenderPosition, replace, render, remove} from "../utils/render.js";
import DayItem from "../components/points-element.js";
import EventOption from "../components/points-option.js";
import EditTripForm from "../components/add-edit-trip-form.js";
import PointModel from "../models/point.js";
import moment from "moment";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  id: String(new Date() + Math.random()),
  decription: ``,
  destination: ``,
  type: `bus`,
  date: [moment(new Date()), moment(new Date())],
  price: ``,
  offers: []
};

const renderOptions = (element, currentItem) => {
  render(element, new EventOption(currentItem), RenderPosition.BEFOREEND);
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(day, mode) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;

    const newEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);

    this._pointComponent = new DayItem(day);
    this._pointEditComponent = new EditTripForm(day);

    const onEditFormSubmit = (evt) => {
      evt.preventDefault();
      const data = this._pointEditComponent.getData();
      this._onDataChange(this, day, data);
    };

    switch (mode) {
      case Mode.DEFAULT:
        newEventButtonElement.disabled = false;
        if (oldPointComponent && oldPointEditComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);

          this._replaceEditToPoint();

        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldPointComponent && oldPointEditComponent) {
          remove(oldPointComponent);
          remove(oldPointEditComponent);
        }
        this._pointEditComponent.setOnFormSubmit(onEditFormSubmit);
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(document.querySelector(`.trip-events`), this._pointEditComponent, RenderPosition.BEFOREBEGIN, this._container.parentElement);
        break;
    }

    const onCloseRollupClick = () => {
      this._replaceEditToPoint();
      this._pointComponent.setOnRollupClick(onRollUpClick);
    };


    this._pointEditComponent.setDeleteButtonClickHandler(() => {
      this._onDataChange(this, day, null);
      newEventButtonElement.disabled = false;
    });

    const onFavouriteClick = () => {
      const newPoint = PointModel.clone(day);
      newPoint.isFavourite = !newPoint.isFavourite;

      this._onDataChange(this, day, newPoint);
    };


    const onRollUpClick = () => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
      this._pointEditComponent.setOnCloseRollupClick(onCloseRollupClick);
      this._pointEditComponent.setOnFormSubmit(onEditFormSubmit);
      this._pointEditComponent.setOnFavouriteClick(onFavouriteClick);
      newEventButtonElement.disabled = false;
    };

    this._pointComponent.setOnRollupClick(onRollUpClick);

    const optionsContainer = this._pointComponent.getElement().querySelector(`.event__selected-offers`);
    day.offers.map((option) => renderOptions(optionsContainer, option)).join(`\n`);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }


  setDefaultView() {
    const createFormElement = document.querySelector(`.event--create`);
    if (createFormElement) {
      createFormElement.remove();
    }

    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._pointEditComponent.reset();

    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointComponent, this._pointEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._pointEditComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    }
  }
}
