import {SortType} from "../components/sorting.js";

export const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];
  const showingPoints = points.slice();
  switch (sortType) {
    case SortType.PRICE:
      sortedPoints = showingPoints.sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      sortedPoints = showingPoints.sort((a, b) => b.dateDifference - a.dateDifference);
      break;
    case SortType.DEFAULT:
      sortedPoints = showingPoints;
      break;
  }

  return sortedPoints.slice();
};
