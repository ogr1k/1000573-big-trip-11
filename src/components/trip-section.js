
import AbstractComponent from "./abstract-component.js";

const createTripSectionTemplate = () => {
  return (
    `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
    </section>`
  );
};


export default class TripSectionTemplate extends AbstractComponent {
  getTemplate() {
    return createTripSectionTemplate();
  }
}
