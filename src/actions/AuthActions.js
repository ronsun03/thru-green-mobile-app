import firebase from 'firebase';
import { Keyboard } from 'react-native';
import config from './config';
import axios from 'axios';

import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  FONTS_LOADED,
  CREATE_USER_LOADING,
  CREATE_USER_ERROR,
  CREATE_USER_SUCCESS,
  TOGGLE_FORGOT_PASSWORD_MODAL,
  FORGOT_PASSWORD_LOADING,
  FORGOT_PASSWORD_SENT_SUCCESS
} from './types';

const apiURL = config.apiURL;

export const loadFonts = () => {
  console.log('run loadFonts()');
  return (dispatch) => {
    dispatch({
      type: FONTS_LOADED
    });
  };
};

export const openForgotPasswordModal = () => {
  return dispatch => {
    dispatch({
      type: TOGGLE_FORGOT_PASSWORD_MODAL,
      payload: true
    })
  }
}

export const closeForgotPasswordModal = () => {
  return dispatch => {
    dispatch({
      type: TOGGLE_FORGOT_PASSWORD_MODAL,
      payload: false
    })
  }
}

export const resetPassword = (email, successCB, errorCB) => {
  return dispatch => {
    // dispatch({
    //   type: FORGOT_PASSWORD_LOADING,
    //   payload: true
    // })

    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        console.log('email sent');
        dispatch({
          type: FORGOT_PASSWORD_SENT_SUCCESS
        })
        successCB();
      })
      .catch(error => {
        // dispatch({
        //   type: FORGOT_PASSWORD_LOADING,
        //   payload: false
        // })
        console.log('Reset error: ', error);
        errorCB();
      })
  }
}

export const existingUserLoggedIn = (user, callback) => {
  return (dispatch) => {
    const userRef = firebase.database().ref(`/user/${user.uid}`);

    const d = new Date();

    userRef.update({
      lastLoggedIn: d
    });

    userRef.on('value', snapshot => {
      const userData = {
        uid: user.uid,
        data: snapshot.val()
      };

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: userData
      });
      callback();
    });
  };
};

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const createUser = ({ name, email, password, passwordConfirm }, callback) => {
  return (dispatch) => {
      let passwordCheck = false;

      password === passwordConfirm ? passwordCheck = true : passwordCheck = false;

      console.log('passwordCheck: ', passwordCheck);

      console.log('url: ', apiURL);

      // Check if registration limit has been reached
      axios.get(`${apiURL}/api/admin/check-registration-limit`).then(response => {
        console.log('response: ', response);
        const allowRegistration = response.data.boolean;

        // If allowRegistration is true, allow registration to proceed
        if (allowRegistration) {
          if (!name) {
            dispatch({
              type: CREATE_USER_ERROR,
              payload: 'Please enter your name.'
            });

            return;
          }

          if (!email) {
            dispatch({
              type: CREATE_USER_ERROR,
              payload: 'Please enter an email address.'
            });

            return;
          }

          if (!passwordCheck) {
            dispatch({
              type: CREATE_USER_ERROR,
              payload: 'Passwords must match. Please try again.'
            });

            return;
          }

          if (passwordCheck) {
            dispatch({
              type: CREATE_USER_LOADING
            });

            firebase.auth().createUserWithEmailAndPassword(email, password)
              .then(user => {
                console.log('create user: ', user);
                const userRef = firebase.database().ref(`/user/${user.uid}`);
                userRef
                  .update({
                    admin: false,
                    lightChecks: {
                      isInSector: false
                    },
                    profileData: {
                      name
                    },
                    userStats: {
                      numTimesEnteredSector: 0,
                      numTimesLightChanged: 0
                    }
                  })
                  .then(() => {
                    dispatch({
                      type: CREATE_USER_SUCCESS
                    })
                    callback();
                  });
              })
              .catch(error => {
                console.log('create user error: ', error);
                if (error.message === 'The email address is badly formatted.') {
                  dispatch({
                    type: CREATE_USER_ERROR,
                    payload: 'Please enter a valid email address.'
                  });
                } else {
                  dispatch({
                    type: CREATE_USER_ERROR,
                    payload: error.message
                  });
                }
              });
          }
        }

        if (!allowRegistration) {
          dispatch({
            type: CREATE_USER_ERROR,
            payload: 'User registration limit has been reached. \nPlease try again at a later date.'
          });
        }
      })
  };
};

export const loginUser = ({ email, password }, callback) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      console.log('set persistence login');

      return firebase.auth().signInWithEmailAndPassword(email, password)
              .then(user => {
                loginUserSuccess(dispatch, user, callback);

                firebase.app('liveDB').auth().signInWithEmailAndPassword('thrugreenlivedb@thrugreen.com', 'thrugreenlivedb')
                  .then(user => {
                    console.log('liveDB successfully authenticated - ');
                  })
                  .catch(() => {
                    console.log('liveDB could not authenticate');
                  })

              })
              .catch(() => loginUserFail(dispatch));
    })
    .catch(error => {
      console.log('set persistence fail', error);
      dispatch({
        type: LOGIN_USER_FAIL
      });
    });
  };
};

export const logout = (callback) => {
  return (dispatch) => {
    // firebase.auth().onAuthStateChanged(user => {
    //   console.log('Current User:', user);
    // });

    firebase.auth().signOut()
      .then(() => {
        console.log('User logged out');
        callback();
      })
      .catch(error => {
        console.log('Sign out error:', error);
      });
  };
};

const loginUserSuccess = (dispatch, user, callback) => {
  console.log('login success');

  firebase.database().ref(`/user/${user.uid}`)
    .on('value', snapshot => {
      const userData = {
        uid: user.uid,
        data: snapshot.val()
      };

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: userData
      });
      callback();
      Keyboard.dismiss();
    });
};

const loginUserFail = (dispatch) => {
  console.log('login fail');

  dispatch({
    type: LOGIN_USER_FAIL
  });
};
