import {
  SET_CURRENT_POSITION,
  GET_AREAS,
  IN_CURRENT_AREA,
  IN_CURRENT_SECTOR,
  APP_TOGGLE,
  SET_CURRENT_SPEED
 } from '../actions/types';

const INITIAL_STATE = {
  isAppOn: false,
  currentPosition: {
    latitude: 38.9013,
    longitude: -77.0446,
    latitudeDelta: 0.002,
    longitudeDelta: 0.0035
  },
  areas: null,
  currentArea: null,
  currentSector: null,
  currentSpeed: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case APP_TOGGLE:
      return { ...state, isAppOn: action.payload };

    case SET_CURRENT_POSITION:
      return { ...state, currentPosition: action.payload };

    case GET_AREAS:
      return { ...state, areas: action.payload };

    case IN_CURRENT_AREA:
      return { ...state, currentArea: action.payload };

    case IN_CURRENT_SECTOR:
      return { ...state, currentSector: action.payload };

    case SET_CURRENT_SPEED:
      return { ...state, currentSpeed: action.payload };

    default:
      return state;
  }
};
