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
 } from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  user: null,
  error: '',
  loading: false,
  fontsLoaded: false,
  createUserLoading: false,
  createUserError: '',
  forgotPasswordModalVisible: false,
  forgotPasswordLoading: false,
  forgotPasswordSentSuccess: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FONTS_LOADED:
      return { ...state, fontsLoaded: true };

    case EMAIL_CHANGED:
      return { ...state, email: action.payload };

    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };

    case LOGIN_USER:
      return { ...state, loading: true, error: '' };

    case LOGIN_USER_SUCCESS:
      return { ...state,
        user: action.payload,
        loading: false,
        error: '',
        email: '',
        password: ''
      };

    case LOGIN_USER_FAIL:
      return { ...state, error: 'Authentication Failed', loading: false, password: '' };

    case CREATE_USER_LOADING:
      return { ...state, createUserLoading: true };

    case CREATE_USER_ERROR:
      return { ...state, createUserError: action.payload, createUserLoading: false }

    case CREATE_USER_SUCCESS:
      return { ...state, createUserLoading: false, createUserError: '' }

    case TOGGLE_FORGOT_PASSWORD_MODAL:
      return { ...state, forgotPasswordModalVisible: action.payload }

    case FORGOT_PASSWORD_LOADING:
      return { ...state, forgotPasswordLoading: true }

    case FORGOT_PASSWORD_SENT_SUCCESS:
      return { ...state, forgotPasswordLoading: false, forgotPasswordModalVisible: false, forgotPasswordSentSuccess: true }

    default:
      return state;
  }
};
