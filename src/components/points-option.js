import AbstractComponent from "./abstract-component.js";


const createEventOptionElement = (data) => {
  const options = data.title;
  const price = data.price;
  return (`<li class="event__offer">
   <span class="event__offer-title">${options}</span>
   &plus;
   &euro;&nbsp;<span class="event__offer-price">${price}</span>
  </li>`);
};

export default class EventOption extends AbstractComponent {
  constructor(option) {
    super();

    this._option = option;
  }

  getTemplate() {
    return createEventOptionElement(this._option);
  }
}
