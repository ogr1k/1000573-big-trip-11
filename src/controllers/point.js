import {RenderPosition, replace, render, remove} from "../utils/render.js";
import {DefaultFormButtonsText} from "../components//add-edit-trip-form.js";
import {newEventButtonComponent} from "../main.js";
import Point from "../components/points-element.js";
import EventOptions from "../components/points-option.js";
import EditTripForm from "../components/add-edit-trip-form.js";
import PointModel from "../models/point.js";
import moment from "moment";

const SHAKE_ANIMATION_TIMEOUT = 600;
const MAX_POINTS_COUNT = 3;
const EMPTY_POINT_DEFAULT_TYPE = `BUS`;
const ESCAPE_EVENT = `Escape`;
const ESCAPE_EVENT_SHORT = `Esc`;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  id: String(new Date() + Math.random()),
  decription: ``,
  destination: ``,
  type: EMPTY_POINT_DEFAULT_TYPE,
  dates: [moment(new Date()), moment(new Date())],
  price: ``,
  offers: []
};

const RequestingFormButtonsText = {
  DELETE: `Deleting...`,
  SAVE: `Saving...`
};

const renderOptions = (option, currentItem) => {
  render(option, new EventOptions(currentItem), RenderPosition.BEFOREEND);
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, destinations, offers) {
    this._container = container;
    this._destinations = destinations;
    this._offers = offers;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, mode) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;

    const isCreateForm = (point === EmptyPoint);

    const newEventButtonElement = newEventButtonComponent.getElement();

    this._pointComponent = new Point(point);
    this._pointEditComponent = new EditTripForm(point, this._destinations, this._offers);

    const onEditFormSubmit = (evt) => {
      evt.preventDefault();
      const data = this._pointEditComponent.getData();

      this._pointEditComponent.setButtonTextData({
        SAVE: RequestingFormButtonsText.SAVE,
      });

      this._pointEditComponent.removeOnFavouriteClick(onFavouriteClick);

      newEventButtonElement.disabled = false;

      this._onDataChange(this, point, data);
    };

    switch (mode) {
      case Mode.DEFAULT:
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
        render(document.querySelector(`.trip-events`), this._pointEditComponent, RenderPosition.BEFOREBEGIN, this._container);
        break;
    }

    const onCloseRollupClick = () => {
      this._replaceEditToPoint();
      this._pointComponent.setOnRollupClick(onRollUpClick);
    };


    this._pointEditComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      if (!isCreateForm) {
        this._pointEditComponent.setButtonTextData({
          DELETE: RequestingFormButtonsText.DELETE,
        });
        this._pointEditComponent.removeOnFavouriteClick(onFavouriteClick);
      }

      this._onDataChange(this, point, null);
      newEventButtonElement.disabled = false;
    });

    const onFavouriteClick = () => {
      point.isFavourite = !point.isFavourite;
      const newPoint = PointModel.clone(point);
      const isFavouriteClicked = true;

      this._pointEditComponent.changeIsFavourite();
      this._pointEditComponent.setButtonTextData();
      this._pointEditComponent.removeOnFavouriteClick(onFavouriteClick);

      this._onDataChange(this, point, newPoint, isFavouriteClicked);
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
    point.offers.slice(0, MAX_POINTS_COUNT).map((option) => renderOptions(optionsContainer, option)).join(`\n`);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  rerenderEditForm() {
    this._pointEditComponent.setButtonTextData({
      DELETE: DefaultFormButtonsText.DELETE,
      SAVE: DefaultFormButtonsText.SAVE
    });
    this._pointEditComponent.changeIsRequesting(false);
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

  shake() {
    this._pointEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._pointComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._pointEditComponent.getElement().style.animation = ``;
      this._pointComponent.getElement().style.animation = ``;
      this.rerenderEditForm();
    }, SHAKE_ANIMATION_TIMEOUT);
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
    const isEscKey = evt.key === ESCAPE_EVENT || evt.key === ESCAPE_EVENT_SHORT;

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
