import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import geolib from 'geolib';

import * as actions from '../actions';
import { CardSection } from '../components/common';
import Map from '../components/Map';
import MapInterval from '../components/MapInterval';
import LocationInterval from '../components/LocationInterval';
// import Box from '../components/Box';

class MapScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Maps',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="my-location" size={30} color={tintColor} />
    ),
  };

  runMap() {
    if (this.props.isAppOn) {
      return (
        <LocationInterval />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.runMap()}
        <View style={styles.topContainer}>
          <Map />
        </View>
        <View style={styles.bottomContainer}>
          <CardSection style={styles.headerStyle}>
            <Text style={styles.headerText}>Current User Stats</Text>
          </CardSection>
          <ScrollView>
            <View style={{ marginBottom: 15 }}>
              <Text>Current Position:</Text>
              <Text>Latitude: {this.props.currentPosition.latitude}</Text>
              <Text>Longitude: {this.props.currentPosition.longitude}</Text>
            </View>
            <View style={{ marginBottom: 15 }}>
              <Text>User ID:</Text>
              <Text>{this.props.user ? this.props.user.uid : null}</Text>
            </View>
            <View style={{ marginBottom: 15 }}>
              <Text>In Area:</Text>
              <Text>{this.props.currentArea ? this.props.currentArea.AreaID : 'None'}</Text>
            </View>
            <View style={{ marginBottom: 15 }}>
              <Text>In Sector:</Text>
              <Text>{this.props.currentSector ? this.props.currentSector.SectorID : 'None'}</Text>
            </View>
            <View style={{ marginBottom: 15 }}>
              <Text>Speed:</Text>
              <Text>{this.props.currentSpeed} mph</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
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
    currentSpeed: state.map.currentSpeed
  };
}

export default connect(mapStateToProps, actions)(MapScreen);
