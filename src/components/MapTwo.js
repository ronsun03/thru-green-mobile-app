import _ from 'lodash';
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { MapView } from 'expo';
import { connect } from 'react-redux';

import { setCurrentPosition, getLocations } from '../actions';
import MapMarkerCurrent from './MapMarkerCurrent';
import MapMarker from './MapMarker';

const { width, height } = Dimensions.get('window');

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;

const LATITUDE_DELTA = 0.001;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LONGITUDE_DELTA = 0.015;

class MapTwo extends Component {
  componentWillMount() {
    // this.props.getLocations();
  }

  watchID: ?number = null;

  componentDidMount() {
    console.log('mapTwo');


    navigator.geolocation.getCurrentPosition(position => {
      const lat = parseFloat(position.coords.latitude);
      const long = parseFloat(position.coords.longitude);

      const initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      };

      this.props.setCurrentPosition(initialRegion);
    },
    error => alert(JSON.stringify(error)),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 });

    this.watchID = navigator.geolocation.watchPosition(position => {
      const lat = parseFloat(position.coords.latitude);
      const long = parseFloat(position.coords.longitude);

      const lastRegion = {
        latitude: lat,
        longitude: long,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA
      }

      this.props.setCurrentPosition(lastRegion);
    },
    error => alert(JSON.stringify(error)),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }

  renderMarkers() {
    if (this.props.locations) {
      const locations = this.props.locations.filter(x => {
        return (x !== (undefined || null || ''));
      });

      const markers = _.map(locations, (location, uid) => {
        const position = {
          latitude: location.lat,
          longitude: location.long
        };
        return <MapMarker key={uid} coordinate={position} />;
      });

      return markers;
    }

    return <View />;
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        region={this.props.currentPosition}
        // region={{
        //   latitude: 38.9029983,
        //   longitude: -77.0430983,
        //   latitudeDelta: 0.09,
        //   longitudeDelta: 0.04
        // }}
        // onRegionChangeComplete={region => { console.log('region change', region); }}
      >
        {this.renderMarkers()}
        <MapMarkerCurrent coordinate={this.props.currentPosition} />
      </MapView>
    );
  }
}

function mapStateToProps(state) {
  return {
    locations: state.map.locations,
    currentPosition: state.map.currentPosition
  };
}

export default connect(mapStateToProps, { setCurrentPosition, getLocations })(MapTwo);
