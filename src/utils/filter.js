import {FilterType} from "../constants.js";

// export const getTasksByFilter = (tasks) => {
//   return tasks;
// };

export const getFutureTasks = (points, date) => {
  return points.filter((point) => {
    const pointDate = point.date[0];

    return date < pointDate;

  });
};

export const getPastDate = (points, date) => {
  return points.filter((point) => {
    const pointDate = point.date[0];

    return date > pointDate;

  });
};

export const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.FUTURE:
      return getFutureTasks(tasks, nowDate);
    case FilterType.PAST:
      return getPastDate(tasks, nowDate);
  }
  return tasks;
};
