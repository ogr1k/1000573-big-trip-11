import moment from "moment";

export default class Point {
  constructor(data) {
    this.destination = data[`destination`].name;
    this.id = data[`id`];
    this.date = [moment(data[`date_from`]), moment(data[`date_to`])];
    this.isFavourite = Boolean(data[`is_favorite`]);
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.type = data[`type`];

  }

  toRAW() {
    return {
      "base_price": this.price,
      "date_from": this.date[0],
      "date_to": this.date[1],
      "destination": this.destination,
      "id": this.id,
      "is_favorite": this.isFavourite,
      "offers": this.offers,
      "type": this.type.toLowerCase()
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
