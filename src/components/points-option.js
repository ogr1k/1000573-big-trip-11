import {createElement} from "../utils.js";


const createEventOptionElement = (data) => {
  const options = data.name;
  const price = data.price;
  return (`<li class="event__offer">
   <span class="event__offer-title">${options}</span>
   &plus;
   &euro;&nbsp;<span class="event__offer-price">${price}</span>
  </li>`);
};


export default class EventOption {
  constructor(day) {
    this._day = day;
    this._element = null;
  }

  getTemplate() {
    return createEventOptionElement(this._day);
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
