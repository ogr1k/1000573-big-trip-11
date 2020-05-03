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

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};


export const EVENTS_PRETEXTS = {
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

export const TYPES_POINT = [...Object.values(TransferEvents), ...Object.values(ActivityEvents)];
export const NAVIGATION_ELEMENTS = [`Table`, `Stats`];
export const SORT_ELEMENTS = [`event`, `time`, `price`];
export const DESTINATIONS_POINT = [`Amsterdam`, `Geneva`, `Milan`, `Chamonix`];
export const OPTIONS = [`Order Uber`, `Add luggage`, `Rent a car`, `Add breakfast`, `Book tickets`, `Choose seats`, `Add meal`];
