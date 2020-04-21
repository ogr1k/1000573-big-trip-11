import AbstractComponent from "./abstract-component.js";

const createInfoSectionTemplate = () => {
  return (
    `<section class="trip-main__trip-info  trip-info"></section>`
  );
};


export default class InfoSectionTemplate extends AbstractComponent {
  getTemplate() {
    return createInfoSectionTemplate();
  }
}
