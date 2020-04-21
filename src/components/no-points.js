import AbstractComponent from "./abstract-component.js";

const createNoPointMessage = () => {
  return (`<p class="trip-events__msg">Click New Event to create your first point</p>`);
};

export default class NoPointsTemplate extends AbstractComponent {
  getTemplate() {
    return createNoPointMessage();
  }
}
