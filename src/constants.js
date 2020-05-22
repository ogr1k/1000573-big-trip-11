export const TransferEvents = {
  TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`
};

export const ActivityEvents = {
  CHECKIN: `Check-in`,
  RESTAURANT: `Restaurant`,
  SIGHTSEEING: `Sightseeing`,
};

export const Events = Object.assign({}, ActivityEvents, TransferEvents);

export const EventsPretexts = {
  [ActivityEvents.CHECKIN]: `in`,
  [ActivityEvents.RESTAURANT]: `in`,
  [ActivityEvents.SIGHTSEEING]: `in`,
  [TransferEvents.TAXI]: `to`,
  [TransferEvents.BUS]: `to`,
  [TransferEvents.TRAIN]: `to`,
  [TransferEvents.SHIP]: `to`,
  [TransferEvents.TRANSPORT]: `to`,
  [TransferEvents.DRIVE]: `to`,
  [TransferEvents.FLIGHT]: `to`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const NavigationTypes = {
  DEFAULT: `Table`,
  STATS: `Stats`
};

export const SortType = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`,
};
