import {getTasksByFilter} from "../utils/filter.js";
import {FilterType} from "../constants.js";


export default class Points {
  constructor() {
    this._points = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getTasks() {
    return getTasksByFilter(this._points, this._activeFilterType);
  }

  getTasksAll() {
    return this._points;
  }

  setTasks(tasks) {
    this._points = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateTask(id, task) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), task, this._points.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
