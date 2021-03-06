import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, ScrollView, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import geolib from 'geolib';

import * as actions from '../actions';
import { CardSection } from '../components/common';
import Map from '../components/Map';
// import MapInterval from '../components/MapInterval';
import LocationInterval from '../components/LocationInterval';
import BackgroundLocation from '../components/BackgroundLocation';
// import Box from '../components/Box';

class MapScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Maps',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="my-location" size={30} color={tintColor} />
    ),
  };

  componentDidMount() {
    console.log('Load MapScreen');
  }

  // runMap() {
  //   if (this.props.isAppOn) {
  //     return (
  //       <LocationInterval />
  //     );
  //   }
  // }
  //
  // runBackgroundLocation() {
  //   if (this.props.isAppOn) {
  //     return (
  //       <BackgroundLocation />
  //     );
  //   } else {
  //     return <BackgroundLocation />
  //   }
  // }

  render() {
    if (this.props.isAppOn) {
      return (
        <View style={styles.container}>
          <BackgroundLocation />
          <View style={styles.topContainer}>
            <Map />
          </View>
          <View style={styles.bottomContainer}>
            <CardSection style={styles.headerStyle}>
              <Text style={styles.headerText}>Current User Stats</Text>
            </CardSection>
            <ScrollView>
              <View style={{ marginBottom: 7 }}>
                <Text>Current Position:</Text>
                <Text>Latitude: {this.props.currentPosition.latitude}</Text>
                <Text>Longitude: {this.props.currentPosition.longitude}</Text>
              </View>
              <View style={{ marginBottom: 7 }}>
                <Text>In Area:</Text>
                <Text>{this.props.currentArea ? this.props.currentArea.AreaID : 'None'}</Text>
              </View>
              <View style={{ marginBottom: 7 }}>
                <Text>In Sector:</Text>
                <Text>{this.props.currentSector ? this.props.currentSector.SectorID : 'None'}</Text>
              </View>
              <View style={{ marginBottom: 7 }}>
                <Text>Last Pre-Sector:</Text>
                <Text>{this.props.lastPreSector ? this.props.lastPreSector : 'None'}</Text>
              </View>
              <View style={{ marginBottom: 7 }}>
                <Text>Did Light Change?:</Text>
                <Text>{this.props.didLightChange ? 'Yes' : 'No'}</Text>
              </View>
              <View style={{ marginBottom: 7 }}>
                <Text>Speed:</Text>
                <Text>{this.props.currentSpeed} mph</Text>
              </View>
              <View style={{ marginBottom: 7 }}>
                <Text>User ID:</Text>
                <Text>{this.props.user ? this.props.user.uid : null}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={{ paddingTop: 80, textAlign: 'center', alignSelf: 'center', fontSize: 20 }}>Flip the switch to load the map</Text>
          <BackgroundLocation />
        </View>
      )
    }
  }
}

const styles = {
  container: {
    flex: 1
  },
  topContainer: {
    flex: 1
  },
  bottomContainer: {
    flex: 1
  },
  rateRow: {
    height: 50
  },
  headerStyle: {
    backgroundColor: '#2F62A8',
  },
  headerText: {
    color: '#3EB56C',
    fontSize: 15,
    fontWeight: '600'
  },
  colOne: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-around',

  },
  colTwo: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-around',

  },
  colThree: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  colFour: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  redText: {
    color: 'red'
  },
  greenText: {
    color: 'green'
  }
};

function mapStateToProps(state) {
  return {
    isAppOn: state.map.isAppOn,
    currentPosition: state.map.currentPosition,
    user: state.auth.user,
    currentZone: state.map.currentZone,
    currentArea: state.map.currentArea,
    currentSector: state.map.currentSector,
    lastPreSector: state.map.lastPreSector,
    currentSpeed: state.map.currentSpeed,
    didLightChange: state.map.didLightChange
  };
}

export default connect(mapStateToProps, actions)(MapScreen);
