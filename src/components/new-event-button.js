import AbstractComponent from "./abstract-component.js";

const createNewEventButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};


export default class NewEventButton extends AbstractComponent {
  getTemplate() {
    return createNewEventButtonTemplate();
  }

  setOnEventButtonClick(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  removeOnEventButtonClick(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
