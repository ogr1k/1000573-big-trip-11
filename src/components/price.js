import AbstractComponent from "./abstract-component.js";

const createPriceTemplate = () => {
  return (
    `<p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value"></span>
      </p>`
  );
};


export default class PriceTemplate extends AbstractComponent {
  getTemplate() {
    return createPriceTemplate();
  }
}
