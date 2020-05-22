import {FilterType} from "../constants.js";

const getFuturePoints = (points, now) => {
  return points.filter((point) => {
    const eventStartDate = point.dates[0];
    return now < eventStartDate;
  });
};

const getPastPoints = (points, now) => {
  return points.filter((point) => {
    const eventEndDate = point.dates[1];

    return now > eventEndDate;

  });
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
  }
  return points;
};
