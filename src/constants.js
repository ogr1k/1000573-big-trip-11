export const NAVIGATION_ELEMENTS = [`Table`, `Stats`];
export const FILTER_ELEMENTS = [`everything`, `future`, `past`];
export const SORT_ELEMENTS = [`event`, `time`, `price`];

const Events = {
  CheckIn: `Check-in`,
  Restaurant: `Restaurant`,
  Sightseeing: `Sightseeing`,
  Taxi: `Taxi`,
  Bus: `Bus`,
  Train: `Train`,
  Ship: `Ship`,
  Transport: `Transport`,
  Drive: `Drive`,
  Flight: `Flight`
};

export const EVENTS_PRETEXTS = {
  [Events.CheckIn]: `in`,
  [Events.Restaurant]: `in`,
  [Events.Sightseeing]: `in`,
  [Events.Taxi]: `to`,
  [Events.Bus]: `to`,
  [Events.Train]: `to`,
  [Events.Ship]: `to`,
  [Events.Transport]: `to`,
  [Events.Drive]: `to`,
  [Events.Flight]: `to`
};

export const TYPES_POINT_TRANSFER = [Events.Taxi, Events.Bus, Events.Train, Events.Ship, Events.Transport, Events.Drive, Events.Flight];
export const TYPES_POINT_ACTIVITY = [Events.CheckIn, Events.Sightseeing, Events.Restaurant];
export const TYPES_POINT = Object.values(Events);

export const DESTINATIONS_POINT = [`Amsterdam`, `Geneva`, `Milan`, `Chamonix`];
export const OPTIONS = [`Order Uber`, `Add luggage`, `Rent a car`, `Add breakfast`, `Book tickets`, `Choose seats`, `Add meal`];
