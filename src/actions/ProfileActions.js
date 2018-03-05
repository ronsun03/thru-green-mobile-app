import firebase from 'firebase';

import {
  GET_USER_DATA,
  FONTS_LOADED
} from './types';

export const getUserData = () => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();

    console.log('currentUser', currentUser);


    // dispatch({
    //   type: GET_USER_DATA,
    //   payload: 'hi'
    // });
  };
};

// export const loadFonts = () => {
//   return (dispatch) => {
//     console.log('load fonts');
//     dispatch({
//       type: FONTS_LOADED
//     })
//   };
// };
