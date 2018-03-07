import React from 'react';
// import { Font } from 'expo';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import * as firebase from 'firebase';

import reducers from './src/reducers';

import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import AppScreen from './src/screens/AppScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import OpenAppScreen from './src/screens/OpenAppScreen';

export default class App extends React.Component {
  componentWillMount() {
    console.ignoredYellowBox = ['Setting a timer'];

    const config = {
      apiKey: "AIzaSyCPxWPYBtWLLmGslSTuBQ_pjs0jcn4blU8",
      authDomain: "location-prototype-138d5.firebaseapp.com",
      databaseURL: "https://location-prototype-138d5.firebaseio.com",
      projectId: "location-prototype-138d5",
      storageBucket: "location-prototype-138d5.appspot.com",
      messagingSenderId: "799160119564"
    };

    const liveDBConfig = {
      apiKey: "AIzaSyAaaYTKixKh49UKu-iUHVQxJPrD03TEySM",
      authDomain: "thru-green-live-db.firebaseapp.com",
      databaseURL: "https://thru-green-live-db.firebaseio.com",
      projectId: "thru-green-live-db",
      storageBucket: "thru-green-live-db.appspot.com",
      messagingSenderId: "455601807101"
    };

    // Check if firebase is already initialized
    if (!firebase.apps.length) {
      // Initialize main firebase app
      firebase.initializeApp(config);

      // Initialize other live database
      const liveDB = firebase.initializeApp(liveDBConfig, "liveDB");
    }


    // Use the liveDB variable to retrieve the other app's services
    // const otherDatabase = otherApp.database();
  }

  // componentDidMount() {
  //   Font.loadAsync({
  //     'Dosis-Bold': require('./assets/fonts/Dosis-Bold.ttf'),
  //     'Dosis-Medium': require('./assets/fonts/Dosis-Medium.ttf'),
  //     'Dosis-Light': require('./assets/fonts/Dosis-Light.ttf'),
  //     'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
  //     'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
  //     'Roboto-Thin': require('./assets/fonts/Roboto-Thin.ttf'),
  //   });
  // }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    const MainNavigator = TabNavigator({
      openAppScreen: { screen: OpenAppScreen },
      welcome: { screen: WelcomeScreen },
      login: { screen: LoginScreen },
      main: {
        screen: TabNavigator({
          app: { screen: AppScreen },
          map: { screen: MapScreen },
          profile: { screen: ProfileScreen }
        }, {
          tabBarPosition: 'bottom',
          swipeEnabled: false,
          lazy: false,
          animationEnabled: false,
          tabBarOptions: {
            activeBackgroundColor: '#3EB56C',
            activeTintColor: 'white',
            inactiveBackgroundColor: '#3EB56C',
            inactiveTintColor: 'gray',
            showLabel: false,
            showIcon: true,
            labelStyle: { fontSize: 12 },
            style: {
              backgroundColor: '#3EB56C'
            },
            indicatorStyle: {
              backgroundColor: 'white',
            },
            iconStyle: {
              width: 30,
              height: 30
            }
          }
        })
      }
    }, {
      tabBarPosition: 'bottom',
      lazy: false,
      swipeEnabled: false,
      navigationOptions: {
        tabBarVisible: false
      },
      tabBarOptions: {
        activeBackgroundColor: '#5FD48C',
        activeTintColor: 'white',
        inactiveBackgroundColor: '#5FD48C',
        inactiveTintColor: '#EDEDED',
      }
    });

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
    // marginTop: Platform.OS === 'android' ? 28 : 0
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
