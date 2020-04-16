import {createElement} from "../utils.js";

const createPriceTemplate = () => {
  return (
    `<p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value"></span>
      </p>`
  );
};


export default class PriceTemplate {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createPriceTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
