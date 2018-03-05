import React, { Component } from 'react';
import { View } from 'react-native';
import { MapView } from 'expo';

class MapMarkerCurrent extends Component {
  render() {
    const { coordinate } = this.props;

    return (
      <MapView.Marker
        coordinate={coordinate}
        // centerOffset={{ x: 0, y: 25 }}
      >
        <View style={styles.markerWrap}>
          <View style={styles.radius} />
          <View style={styles.marker} />
        </View>
      </MapView.Marker>
    );
  }
}

const styles = {
  radius: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    top: 25
    // width: 24,
    // height: 24,
    // borderRadius: 12,
    // backgroundColor: 'rgba(130,4,150, 0.3)',
    // position: 'absolute',
    // top: 4,
    // borderWidth: 1,
    // borderColor: 'rgba(130,4,150, 0.5)',
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    // height: 20,
    // width: 20,
    // borderWidth: 3,
    // borderColor: 'white',
    // borderRadius: 20 / 2,
    // overflow: 'hidden',
    // backgroundColor: '#007AFF'
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(130,4,150, 0.9)'
  }
};


export default MapMarkerCurrent;
