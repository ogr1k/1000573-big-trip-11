import {EVENTS_PRETEXTS} from "../constants.js";

const formatTime = (date) => {
  return date.format(`HH:mm`);
};


const setPretext = (element) => {
  return EVENTS_PRETEXTS[element] || `to`;
};

export {setPretext};
export {formatTime};
