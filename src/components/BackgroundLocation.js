import _ from 'lodash';
import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import Permissions from 'react-native-permissions';
import { connect } from 'react-redux';
import BackgroundGeolocation from 'react-native-background-geolocation';

import * as actions from '../actions';

const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = 0.0035;

class BackgroundLocation extends Component {
  async componentDidMount() {
    console.log('BackgroundLocation componentDidMount()');

    const appToggle = JSON.parse(await AsyncStorage.getItem('appToggle'));

    console.log('backgroundlocation appToggle: ', appToggle);

    if (appToggle) {
      BackgroundGeolocation.removeListeners();

      console.log(`appToggle is ${appToggle}, add BackgroundGeolocation listener`);
      const configurationOptions = {
        desiredAccuracy: 0,
        distanceFilter: 2,
        disableElasticity: true,
        fastestLocationUpdateInterval: 2000,
        stationaryRadius: 1,
        // activityRecognitionInterval: 1000,
        notificationTitle: 'ThruGreen Active',
        notificationText: 'Background location services are running',
        // stationaryRadius: 10
      }


      // Listen to events
      BackgroundGeolocation.on('location', this.onLocation.bind(this), this.onError);
      BackgroundGeolocation.on('motionchange', this.onMotion.bind(this), this.onError);

      // Configure
      BackgroundGeolocation.configure(configurationOptions)


      BackgroundGeolocation.start(state => {
        BackgroundGeolocation.changePace(true, function() {
          console.log('background location now tracking');
        });

        console.log('- BackgroundGeolocation started, state: ', state);
      })
    }

    if (!appToggle) {
      console.log(`appToggle is ${appToggle}, stop BackgroundLocation`);
      BackgroundGeolocation.stop();
    }
  }

  onLocation(location) {
    const d = new Date();
    const sec = d.getSeconds();

    console.log('run on location(), seconds: ', sec);

    const lat = parseFloat(location.coords.latitude);
    const long = parseFloat(location.coords.longitude);

    const initialRegion = {
      latitude: lat,
      longitude: long,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    };

    // convert speed from m/s to mph
    let speed = (location.coords.speed * 2.23694).toFixed(1);

    if (speed < 0) {
      speed = 0;
    }

    this.props.setCurrentPosition(initialRegion);
    this.props.checkInArea(initialRegion, this.props.user);
    this.props.setCurrentSpeed(speed);

    if (this.props.user) {
      this.props.pushDataToDB(initialRegion, speed, this.props.user);
    }
  }

  onMotion({location}) {
    // console.log('onMotion location: ', location);
    const d = new Date();
    const sec = d.getSeconds();

    console.log('run on motion(), seconds: ', sec);

    const lat = parseFloat(location.coords.latitude);
    const long = parseFloat(location.coords.longitude);

    const initialRegion = {
      latitude: lat,
      longitude: long,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    };

    // convert speed from m/s to mph
    let speed = (location.coords.speed * 2.23694).toFixed(1);

    if (speed < 0) {
      speed = 0;
    }

    this.props.setCurrentPosition(initialRegion);
    this.props.checkInArea(initialRegion, this.props.user);
    this.props.setCurrentSpeed(speed);

    if (this.props.user) {
      this.props.pushDataToDB(initialRegion, speed, this.props.user);
    }
  }


  onError() {
    console.log('Error getting location.');
  }

  render() {
    return (<View />)
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

export default connect(mapStateToProps, actions)(BackgroundLocation);
