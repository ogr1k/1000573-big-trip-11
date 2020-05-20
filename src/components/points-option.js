import AbstractComponent from "./abstract-component.js";


const createEventOptionElement = (option) => {
  const options = option.title;
  const price = option.price;
  return (`<li class="event__offer">
   <span class="event__offer-title">${options}</span>
   &plus;
   &euro;&nbsp;<span class="event__offer-price">${price}</span>
  </li>`);
};

export default class EventOptions extends AbstractComponent {
  constructor(option) {
    super();

    this._option = option;
  }

  getTemplate() {
    return createEventOptionElement(this._option);
  }
}
