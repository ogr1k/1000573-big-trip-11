export const NAVIGATION_ELEMENTS = [`Table`, `Stats`];
export const FILTER_ELEMENTS = [`everything`, `future`, `past`];
export const SORT_ELEMENTS = [`event`, `time`, `price`];

const Events = {
  CHECKIN: `Check-in`,
  RESTAURANT: `Restaurant`,
  SIGHTSEEING: `Sightseeing`,
  TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`
};


export const EVENTS_PRETEXTS = {
  [Events.CHECKIN]: `in`,
  [Events.RESTAURANT]: `in`,
  [Events.SIGHTSEEING]: `in`,
  [Events.TAXI]: `to`,
  [Events.BUS]: `to`,
  [Events.TRAIN]: `to`,
  [Events.SHIP]: `to`,
  [Events.TRANSPORT]: `to`,
  [Events.DRIVE]: `to`,
  [Events.FLIGHT]: `to`
};

export const TYPES_POINT_TRANSFER = [Events.TAXI, Events.BUS, Events.TRAIN, Events.SHIP, Events.TRANSPORT, Events.DRIVE, Events.FLIGHT];
export const TYPES_POINT_ACTIVITY = [Events.CHECKIN, Events.RESTAURANT, Events.SIGHTSEEING];
export const TYPES_POINT = Object.values(Events);

export const DESTINATIONS_POINT = [`Amsterdam`, `Geneva`, `Milan`, `Chamonix`];
export const OPTIONS = [`Order Uber`, `Add luggage`, `Rent a car`, `Add breakfast`, `Book tickets`, `Choose seats`, `Add meal`];
