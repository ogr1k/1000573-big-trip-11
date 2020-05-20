import {FilterType} from "../constants.js";

const getFuturePoints = (points, nowDate) => {
  return points.filter((point) => {
    const eventStartDate = point.date[0];
    const pointDate = eventStartDate;
    return nowDate < pointDate;
  });
};

const getPastDate = (points, nowDate) => {
  return points.filter((point) => {
    const eventEndDate = point.date[1];
    const pointDate = eventEndDate;

    return nowDate > pointDate;

  });
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
    case FilterType.PAST:
      return getPastDate(points, nowDate);
  }
  return points;
};
