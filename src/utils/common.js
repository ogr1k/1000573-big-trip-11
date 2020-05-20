import {EventsPretexts} from "../constants.js";

const formatTime = (date) => {
  return date.format(`HH:mm`);
};


const setPretext = (element) => {
  return EventsPretexts[element] || `to`;
};

export {setPretext};
export {formatTime};
