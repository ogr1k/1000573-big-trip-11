import {RenderPosition, replace, render, remove} from "../utils/render.js";
import DayItem from "../components/points-element.js";
import EventOption from "../components/points-option.js";
import EditTripForm from "../components/add-edit-trip-form.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {};

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

    this._pointComponent = new DayItem(day);
    this._pointEditComponent = new EditTripForm(day);

    if (oldPointComponent && oldPointEditComponent) {
      replace(this._pointComponent, oldPointComponent);
      replace(this._pointEditComponent, oldPointEditComponent);
    } else {
      render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
    }

    const onCloseRollupClick = () => {
      this._replaceEditToPoint();
      this._pointComponent.setOnRollupClick(onRollUpClick);
    };


    const onEditFormSubmit = () => {
      const data = this._pointEditComponent.getData();
      this._onDataChange(this, day, data);
      this._pointComponent.setOnRollupClick(onRollUpClick);
    };

    this._pointEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, day, null));


    const onRollUpClick = () => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
      this._pointEditComponent.setOnCloseRollupClick(onCloseRollupClick);
      this._pointEditComponent.setOnFormSubmit(onEditFormSubmit);
    };

    this._pointComponent.setOnRollupClick(onRollUpClick);

    const optionsContainer = this._pointComponent.getElement().querySelector(`.event__selected-offers`);
    day.options.map((option) => renderOptions(optionsContainer, option)).join(`\n`);

    this._pointEditComponent.setOnFavClick(() => {
      this._onDataChange(this, day, Object.assign({}, day, {
        isFavourite: !day.isFavourite,
      }));

      this._pointEditComponent.setOnCloseRollupClick(onCloseRollupClick);
      this._pointEditComponent.setOnFormSubmit(onEditFormSubmit);
    });
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
      this._replaceEditToPoint();
    }
  }

  _onFilterChange() {
    this._updateTasks();
  }
}
