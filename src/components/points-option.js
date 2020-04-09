export const createEventOptionElement = (data) => {
  const options = data.name;
  return (`<li class="event__offer">
   <span class="event__offer-title">${options}</span>
   &plus;
   &euro;&nbsp;<span class="event__offer-price">40</span>
  </li>`);
};
