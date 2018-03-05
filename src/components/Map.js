import _ from 'lodash';
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';

import * as actions from '../actions';
// import MapMarkerCurrent from './MapMarkerCurrent';
import MapMarker from './MapMarker';

const { width, height } = Dimensions.get('window');

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;

const LATITUDE_DELTA = 0.002;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LONGITUDE_DELTA = 0.0035;

class Map extends Component {
  componentWillMount() {
    this.props.getAreas();
  }

  // componentDidMount() {
  //   console.log('this.props.isAppOn: ', this.props.isAppOn);
  //
  //   console.log('isAppOn true, run navigation code');
  //
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     console.log('getCurrentPosition()');
  //     const lat = parseFloat(position.coords.latitude);
  //     const long = parseFloat(position.coords.longitude);
  //
  //     const initialRegion = {
  //       latitude: lat,
  //       longitude: long,
  //       latitudeDelta: LATITUDE_DELTA,
  //       longitudeDelta: LONGITUDE_DELTA
  //     };
  //
  //     this.props.setCurrentPosition(initialRegion);
  //     },
  //     // error => alert(JSON.stringify(error)),
  //     error => console.log('getCurrentPosition error', JSON.stringify(error)),
  //     // null,
  //     { enableHighAccuracy: true, timeout: 250, maximumAge: 2, distanceFilter: 1 }
  //   );
  //
  //   this.watchId = navigator.geolocation.watchPosition(position => {
  //       console.log('watchposition: ', position);
  //
  //       const lat = parseFloat(position.coords.latitude);
  //       const long = parseFloat(position.coords.longitude);
  //
  //       const lastRegion = {
  //         latitude: lat,
  //         longitude: long,
  //         longitudeDelta: LONGITUDE_DELTA,
  //         latitudeDelta: LATITUDE_DELTA
  //       };
  //
  //       const d = new Date();
  //
  //       // convert speed from m/s to mph
  //       const speed = position.coords.speed * 2.23694;
  //
  //       this.props.setCurrentPosition(lastRegion);
  //       this.props.checkInArea(lastRegion, this.props.user);
  //       this.props.setCurrentSpeed(speed);
  //     },
  //     error => console.log('watchposition error', error),
  //     // null,
  //     { enableHighAccuracy: true, timeout: 250, maximumAge: 2, distanceFilter: 1 }
  //   );
  // }
  //
  // componentWillUnmount() {
  //   navigator.geolocation.clearWatch(this.watchId);
  // }

  renderSectorPolygons() {
    const areas = this.props.areas;

    const sectors = _.map(areas, area => {
      return _.map(area.sectors, sector => {
        return sector;
      });
    });

    const mergedSectors = [].concat.apply([], sectors)

    return _.map(mergedSectors, sector => {
      const polygon = [
        {
          latitude: sector.c1,
          longitude: sector.d1
        },
        {
          latitude: sector.c2,
          longitude: sector.d2
        },
        {
          latitude: sector.c3,
          longitude: sector.d3
        },
        {
          latitude: sector.c4,
          longitude: sector.d4
        },
      ];

      return (
        <MapView.Polygon
          key={sector.SectorID}
          coordinates={polygon}
          strokeColor={'rgba(133, 211, 237, .7)'}
          strokeWidth={1}
          fillColor={'rgba(133, 211, 237, .15)'}
        />
      );
    });
  }

  renderAreaPolygons() {
    const areas = this.props.areas;

    return _.map(areas, (area, AreaID) => {
      const { ALat1, ALat2, ALon1, ALon2 } = area;
      const polygon = [
        {
          latitude: ALat1,
          longitude: ALon1
        },
        {
          latitude: ALat2,
          longitude: ALon1
        },
        {
          latitude: ALat2,
          longitude: ALon2
        },
        {
          latitude: ALat1,
          longitude: ALon2
        }
      ];

      return (
        <MapView.Polygon
          key={AreaID}
          coordinates={polygon}
          strokeColor={'rgba(95, 212, 140, .7)'}
          strokeWidth={3}
          fillColor={'rgba(95, 212, 140, .15)'}
        />
      );
    });
  }

  renderAreaMarkers() {
    if (this.props.areas) {
      const areas = this.props.areas;

      return _.map(areas, (area, AreaID) => {
        const position = {
          latitude: (area.ALat1 + area.ALat2) / 2,
          longitude: (area.ALon1 + area.ALon2) / 2
        };

        return (
          <MapMarker
            key={AreaID}
            coordinate={position}
          />
        );
      });
    }

    return <View />;
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        region={this.props.currentPosition}
        showsMyLocationButton
        showsUserLocation
      >
        {this.renderAreaMarkers()}
        {this.renderAreaPolygons()}
        {this.renderSectorPolygons()}
      </MapView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAppOn: state.map.isAppOn,
    currentPosition: state.map.currentPosition,
    user: state.auth.user,
    areas: state.map.areas
  };
}

export default connect(mapStateToProps, actions)(Map);
