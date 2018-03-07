import _ from 'lodash';
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import Permissions from 'react-native-permissions';
import { connect } from 'react-redux';

import * as actions from '../actions';
import MapMarker from './MapMarker';

const { width, height } = Dimensions.get('window');

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;

const LATITUDE_DELTA = 0.002;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LONGITUDE_DELTA = 0.0035;

class LocationInterval extends Component {
  state = {
    locationInterval: null
  }

  componentWillMount() {
    this.props.getAreas();
  }

  componentDidMount() {
    Permissions.check('location').then(response => {
      this.setState({ locationPermission: response });
    });

    Permissions.request('location', {
      rationale: {
        title: 'Track Your Location',
        message: 'We need to access your location to track you'
      }
    }).then(response => {
      this.setState({ locationPermission: response });
    });

    const locationInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = parseFloat(position.coords.latitude);
        const long = parseFloat(position.coords.longitude);

        const initialRegion = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        };

        const d = new Date();

        // convert speed from m/s to mph
        const speed = (position.coords.speed * 2.23694).toFixed(1);

        this.props.setCurrentPosition(initialRegion);
        this.props.checkInArea(initialRegion, this.props.user);
        this.props.setCurrentSpeed(speed);
        this.props.pushDataToDB(initialRegion, speed, this.props.user);
        },
        // error => alert(JSON.stringify(error)),
        error => console.log('getCurrentPosition error', JSON.stringify(error)),
        // null,
        { enableHighAccuracy: true, timeout: 250, maximumAge: 2 }
      );
    }, 2000);

    console.log('locationInterval: ', locationInterval);
    this.setState({ locationInterval })
  }

  componentWillUnmount() {
    console.log('run clearInterval');
    clearInterval(this.state.locationInterval)
  }

  render() {
    return (
      <View />
    );
  }
}

function mapStateToProps(state) {
  console.log('location interval state: ', state);
  return {
    isAppOn: state.map.isAppOn,
    currentPosition: state.map.currentPosition,
    user: state.auth.user,
    areas: state.map.areas
  };
}

export default connect(mapStateToProps, actions)(LocationInterval);
