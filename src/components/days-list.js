import AbstractComponent from "./abstract-component.js";

const createTripDaysListTemplate = () => {
  return (
    `<ul class="trip-days">
      </ul>`
  );
};


export default class TripDaysList extends AbstractComponent {
  getTemplate() {
    return createTripDaysListTemplate();
  }
}
