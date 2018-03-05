import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MapView from 'react-native-maps';

// This component takes the coordinate and title in its props

class MapMarker extends Component {
  render() {
    const { coordinate, location } = this.props;

    return (
      <MapView.Marker
        coordinate={coordinate}
        image={require('../../assets/box-marker-120.png')}
      >
        {/* <MapView.Callout style={styles.callout}>
          <View style={styles.callout}>
            <View style={styles.idWrapper}>
              <Text>Box ID: </Text><Text>{location.boxId}</Text>
            </View>
            <Text>{location.street1} / {location.street2}</Text>
            <Text>{location.city}, {location.state} {location.zip}</Text>
          </View>
        </MapView.Callout> */}
      </MapView.Marker>
    );
  }
}

const styles = {
  callout: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  idWrapper: {
    flex: 1,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row'
  },
  marker: {
  }
};


export default MapMarker;
