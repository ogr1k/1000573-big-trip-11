import {RenderPosition, replace, remove, render} from "../utils/render.js";
import DayItem from "../components/points-element.js";
import EventOption from "../components/points-option.js";
import EditTripForm from "../components/add-edit-trip-form.js";

const renderOptions = (element, currentItem) => {
  render(element, new EventOption(currentItem), RenderPosition.BEFOREEND);
};

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onDataChange = onDataChange;

    // this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(day, index) {
    this._pointComponent = new DayItem(day);
    this._pointEditComponent = new EditTripForm(day, index);


    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replace(this._pointComponent, this._pointEditComponent);
      }
    };

    render(this._container, this._pointComponent, RenderPosition.BEFOREEND);

    const onCloseRollupClick = () => {
      replace(this._pointComponent, this._pointEditComponent);
      this._pointComponent.setOnRollupClick(onRollUpClick);
    };


    const onEditFormSubmit = () => {
      replace(this._pointComponent, this._pointEditComponent);
      this._pointComponent.setOnRollupClick(onRollUpClick);
    };

    const onRollUpClick = () => {
      replace(this._pointEditComponent, this._pointComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
      this._pointEditComponent.setOnCloseRollupClick(onCloseRollupClick);
      this._pointEditComponent.setOnFormSubmit(onEditFormSubmit);
    };

    this._pointComponent.setOnRollupClick(onRollUpClick);


    const optionsContainer = this._pointComponent.getElement().querySelector(`.event__selected-offers`);
    day.options.map((option) => renderOptions(optionsContainer, option)).join(`\n`);

    // const onAddEventButtonClick = () => {
    //   if (currentOpenedFormComponent) {
    //     replace(currentItemForReplacementComponent, currentOpenedFormComponent);
    //   }

    //   document.addEventListener(`keydown`, onEscKeyDown);

    //   createFormElement = this._newEditFormComponent.getElement();


    //   render(this._container.getElement(), this._newEditFormComponent, RenderPosition.BEFOREBEGIN, tripDaysElement);

    //   this._newEditFormComponent.setOnFormSubmit(() => {
    //     remove(this._newEditFormComponent);
    //   });

    //   this._newEventButtonComponent.setOnClick(onAddEventButtonClick);
    // };

    this._pointEditComponent.setOnFavClick(() => {
      this._onDataChange(this, day, Object.assign({}, day, {
        isFavoruite: !day.isFavoruite,
      }));
    });
  }
}
