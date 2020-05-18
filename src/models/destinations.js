export default class Destinations {
  constructor() {
    this.destinations = [];
  }

  getDestinations() {
    return this.destinations;
  }

  setDestinations(destinations) {
    this.destinations = Array.from(destinations);
  }
}
