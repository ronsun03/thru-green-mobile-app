import React, { Component } from 'react';
// import { Font } from 'expo';
import { View, Text, Image, AsyncStorage } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';

import * as actions from '../actions';

import AppLoadingScreen from '../components/AppLoadingScreen';
import CreateAccountForm from '../components/CreateAccountForm';

class OpenAppScreen extends Component {
  state = {
    firstLaunch: null
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log('is there user?', user);
          if (user) {
            console.log('user logged in: ', user);
            this.props.existingUserLoggedIn(user, () => { this.props.navigation.navigate('main'); });
          } else {
            this.props.navigation.navigate('welcome');

            // console.log('no user run async code');
            // AsyncStorage.getItem('alreadyLaunched').then(value => {
            //   console.log('async value', value);
            //   if (value == null) {
            //     console.log('set asyncstorage value');
            //     AsyncStorage.setItem('alreadyLaunched', true);
            //     this.setState({ firstLaunch: true });
            //     this.props.navigation.navigate('welcome');
            //   } else {
            //     this.setState({ firstLaunch: false });
            //     this.props.navigation.navigate('login');
            //   }
            // });
          }
       });
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  async componentDidMount() {
    // await Font.loadAsync({
    //   'Dosis-Bold': require('../../assets/fonts/Dosis-Bold.ttf'),
    //   'Dosis-Medium': require('../../assets/fonts/Dosis-Medium.ttf'),
    //   'Dosis-Light': require('../../assets/fonts/Dosis-Light.ttf'),
    //   'OpenSans-Regular': require('../../assets/fonts/OpenSans-Regular.ttf'),
    //   'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
    //   'Roboto-Thin': require('../../assets/fonts/Roboto-Thin.ttf'),
    // });

    this.props.loadFonts();
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
    fontFamily: 'Dosis-Medium',
    fontSize: 36,
    color: '#3EB56C',
    paddingTop: 35,
    marginTop: 35,
    marginBottom: 20,
    alignSelf: 'center',
    textAlign: 'center'
  },
  subtitleStyle: {
    fontFamily: 'Roboto-Thin',
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
