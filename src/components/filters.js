import AbstractComponent from "./abstract-component.js";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilterElement = (name, isChecked) => {
  return (`
    <div class="trip-filters__filter">
            <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio"
                name="trip-filter" value="everything" ${isChecked ? `checked` : ``}>
            <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>
    `);
};


const createFiltersTemplate = (data) => {
  const filters = data.map((it) => createFilterElement(it.name, it.checked)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
     ${filters}
    </form>`
  );
};


export default class FilterTemplate extends AbstractComponent {
  constructor(day) {
    super();

    this._day = day;
  }

  getTemplate() {
    return createFiltersTemplate(this._day);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
