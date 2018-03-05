import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import geolib from 'geolib';

import { connect } from 'react-redux';
import { getLocations, sendSignal, removeSignal } from '../actions';
import { CardSection, Card } from './common';

class Box extends Component {
  renderZones(boxId, zones) {
    const currentPosition = {
      latitude: this.props.currentPosition.latitude,
      longitude: this.props.currentPosition.longitude
    };

    return _.map(zones, (zone, zoneId) => {
      // const coords = zone.coordGroup;
      // const coordsLength = _.size(coords);
      //
      // const polygon = [];
      // let index = 0;
      // while (index < coordsLength) {
      //   const newPoint = {
      //     latitude: coords[index].lat,
      //     longitude: coords[index].long
      //   };
      //   polygon.push(newPoint);
      //   index++;
      // }
      //
      // let inRange = false;
      // let signalSent = '-';
      // let lightChanged = false;
      //
      // inRange = geolib.isPointInside(currentPosition, polygon);
      //
      // if (!inRange) {
      //   this.props.removeSignal(boxId, zoneId);
      //   signalSent = '-';
      // }
      //
      // if (inRange) {
      //   const num = Math.random();
      //   console.log('random num', num);
      //   if (num > 0.5) {
      //     lightChanged = true;
      //     signalSent = 'Yes';
      //     this.props.sendSignal(boxId, zoneId, this.props.user, lightChanged);
      //   }
      // }
      //
      // if (inRange && !lightChanged) { signalSent = 'No'; }

      const { inRange, lightChanged } = zone;
      const string = lightChanged ? 'Yes' : 'No';

      return (
        <CardSection key={`${boxId}-${zoneId}`}>
          <View style={styles.zoneTextColOne}>
            <Text>{boxId} - {zoneId}</Text>
          </View>
          <View style={styles.zoneTextColTwo}>
            <Text>{inRange ? 'Yes' : 'No'}</Text>
          </View>
          <View style={styles.zoneTextColThree}>
            <Text>{inRange ? string : '-'}</Text>
          </View>
        </CardSection>
      );
    });
  }

  render() {
    const {
      boxId,
      city,
      state,
      zip,
      street1,
      street2,
      lat,
      long,
      zones
    } = this.props.boxLocation;

    return (
      <Card>
        <CardSection>
          <View style={styles.boxIdCol}>
            <Text style={styles.boxIdText}>Box ID: {boxId}</Text>
          </View>
          <View style={styles.addressCol}>
            <Text style={styles.addressText}>{street1} / {street2}</Text>
            <Text style={styles.addressText}>{city}, {state} {zip}</Text>
          </View>
        </CardSection>
        <CardSection>
          <View style={styles.zoneHeaderColOne}>
            <Text>Zone</Text>
          </View>
          <View style={styles.zoneHeaderColTwo}>
            <Text>In Range?</Text>
          </View>
          <View style={styles.zoneHeaderColThree}>
            <Text>Changed?</Text>
          </View>
        </CardSection>
        {this.renderZones(boxId, zones)}
      </Card>
    );
  }
}

const styles = {
  titleWrapper: {
    flexDirection: 'row'
  },
  zoneWrapper: {
    flexDirection: 'row',
    flex: 1
  },
  zoneHeaderColOne: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  zoneHeaderColTwo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-end'
  },
  zoneHeaderColThree: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-end'
  },
  zoneTextColOne: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  zoneTextColTwo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-end'
  },
  zoneTextColThree: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-end'
  },
  boxIdText: {
    fontSize: 18,
    color: 'black'
  },
  boxIdCol: {
    flex: 1,
    flexDirection: 'column'
  },
  addressCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  addressText: {
    alignSelf: 'flex-end',
    fontSize: 14
  },
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
    color: '#2F62A8',
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
    locations: state.map.locations,
    currentPosition: state.map.currentPosition,
    user: state.auth.user
  };
}

export default connect(mapStateToProps, { getLocations, sendSignal, removeSignal })(Box);
