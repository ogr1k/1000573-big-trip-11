import {EventsPretexts} from "../constants.js";

const formatTime = (date) => {
  return date.format(`HH:mm`);
};


const setPretext = (type) => {
  return EventsPretexts[type] || `to`;
};

export {setPretext};
export {formatTime};
