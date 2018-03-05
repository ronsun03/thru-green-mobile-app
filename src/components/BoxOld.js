import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
// import GeoFencing from 'react-native-geo-fencing';

import { connect } from 'react-redux';
import { getLocations } from '../actions';
import { CardSection, Card } from './common';

class Box extends Component {
  renderZones(boxId) {
    const { zones } = this.props.boxLocation;

    return _.map(zones, (zone, zoneId) => {
      const coords = zone.coordGroup;

      const coordsLength = _.size(coords);

      const polygon = [];
      const index = 0;
      while (index < coordsLength) {
        polygon.push(coords[index]);
      }

      console.log('polygon', polygon);


      return (
        <CardSection key={`${boxId}-${zoneId}`} >
          <View style={styles.zoneTextColOne}>
            <Text>{boxId} - {zoneId}</Text>
          </View>
          <View style={styles.zoneTextColTwo}>
            <Text>Yes</Text>
          </View>

        </CardSection>
        // <Text>{boxId} - {zoneId}</Text>
      );
    });
  }

  render() {
    console.log('this.props.boxLocation', this.props.boxLocation);
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
          {/* <View style={styles.titleWrapper}> */}
            <View style={styles.boxIdCol}>
              <Text style={styles.boxIdText}>Box ID: {boxId}</Text>
            </View>
            <View style={styles.addressCol}>
              <Text style={styles.addressText}>{street1} / {street2}</Text>
              <Text style={styles.addressText}>{city}, {state} {zip}</Text>
            </View>
          {/* </View> */}
        </CardSection>
          <CardSection>
            <View style={styles.zoneHeaderColOne}>
              <Text>Zone</Text>
            </View>
            <View style={styles.zoneHeaderColTwo}>
              <Text>In Range?</Text>
          </View>
          </CardSection>
          {this.renderZones(boxId)}
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
    currentPosition: state.map.currentPosition
  };
}

export default connect(mapStateToProps, { getLocations })(Box);
