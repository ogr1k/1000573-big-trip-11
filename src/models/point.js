import moment from "moment";
import {Events} from "../constants.js";

export default class Point {
  constructor(data) {
    this.destination = data[`destination`];
    this.id = data[`id`];
    this.dates = [moment(data[`date_from`]), moment(data[`date_to`])];
    this.isFavourite = Boolean(data[`is_favorite`]);
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.type = data[`type`].replace(`-`, ``).toUpperCase();
    this.dateDifference = this.dates[1] - this.dates[0];
  }

  toRAW() {
    return {
      "base_price": this.price,
      "date_from": this.dates[0].toISOString(),
      "date_to": this.dates[1].toISOString(),
      "destination": this.destination,
      "id": this.id,
      "is_favorite": this.isFavourite,
      "offers": this.offers,
      "type": Events[this.type].toLowerCase()
    };
  }

  static parsePoint(point) {
    return new Point(point);
  }

  static parsePoints(points) {
    return points.map(Point.parsePoint);
  }

  static clone(point) {
    return new Point(point.toRAW());
  }
}
