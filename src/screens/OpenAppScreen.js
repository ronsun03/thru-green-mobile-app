import React, { Component } from 'react';
// import { Font } from 'expo';
import { View, Text, Image, AsyncStorage, AppState } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import axios from 'axios';

import config from '../actions/config';
import * as actions from '../actions';

import AppLoadingScreen from '../components/AppLoadingScreen';
import CreateAccountForm from '../components/CreateAccountForm';

class OpenAppScreen extends Component {
  state = {
    firstLaunch: null
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log('user logged in: ', user);
            this.props.existingUserLoggedIn(user, () => { this.props.navigation.navigate('main'); });
          } else {
            this.props.navigation.navigate('welcome');
          }
       });

     // Watch app state to push temporary data to database when changed
    AppState.addEventListener('change', this._handleAppStateChange);

  }

  componentWillUnmount() {
    // Remove app state listener on unmount
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    console.log('nextAppState: ', nextAppState);

    AsyncStorage.getItem('tempData').then(response => {
      if (response) {
        const array = JSON.parse(response);

        axios.post(`${config.apiURL}/api/push-array-to-sql`, array)
          .then(response => {
            console.log('tempData successfully pushed to sql DB');
            AsyncStorage.removeItem('tempData')
          })
          .catch(error => {
            console.log('pushDataToDB error: ', error);
          });
      }
    })

    // const debug = firebase.database().ref(`/testing/close`)
    // debug.update({
    //   message: 'change'
    // });


    // if app is force closed, turn app toggle off and turn off last sector
    // if (nextAppState === 'inactive') {
    //   this.props.appForceClosed();
    //   const debug = firebase.database().ref(`/testing/close`)
    //   debug.update({
    //     message: 'inactive'
    //   });
    // }
  }

  render() {
    return (
      <AppLoadingScreen />
    );
  }
}

const styles = {
  image: {
    // width: 110,
    // height: 110,
    alignSelf: 'center'
  },
  titleStyle: {
    borderTopColor: '#3EB56C',
    borderTopWidth: 1,
    // fontFamily: 'Dosis-Medium',
    fontSize: 36,
    color: '#3EB56C',
    paddingTop: 35,
    marginTop: 35,
    marginBottom: 20,
    alignSelf: 'center',
    textAlign: 'center'
  },
  subtitleStyle: {
    // fontFamily: 'Roboto-Thin',
    fontSize: 17,
    color: '#333',
    alignSelf: 'center',
    textAlign: 'center'
  },
  loginContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  },
  topLogin: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  formHolder: {
    flex: 2
  },
  centerColumn: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  stack: {
    flexDirection: 'column'
  }
};

function mapStateToProps(state) {
  return {
    fontsLoaded: state.auth.fontsLoaded
  };
}

export default connect(mapStateToProps, actions)(OpenAppScreen);
