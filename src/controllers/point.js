import {RenderPosition, replace, render} from "../utils/render.js";
import DayItem from "../components/points-element.js";
import EventOption from "../components/points-option.js";
import EditTripForm from "../components/add-edit-trip-form.js";
import NewEventButton from "../components/new-event-button.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};


const renderOptions = (element, currentItem) => {
  render(element, new EventOption(currentItem), RenderPosition.BEFOREEND);
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._newEventButtonComponent = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(day, index) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new DayItem(day);
    this._pointEditComponent = new EditTripForm(day, index);
    this._newEventButtonComponent = new NewEventButton();

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
      this._replaceEditToPoint();
      this._pointComponent.setOnRollupClick(onRollUpClick);
    };

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

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._pointEditComponent.reset();
    replace(this._pointComponent, this._pointEditComponent);
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
}
