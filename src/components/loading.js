import AbstractSmartComponent from "./abstact-smart-components.js";

const createLoadingTemplate = () => {
  return (
    `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
    <p class="trip-events__msg">Loading...</p>
    </section>`
  );
};


export default class Loading extends AbstractSmartComponent {
  getTemplate() {
    return createLoadingTemplate();
  }
}
