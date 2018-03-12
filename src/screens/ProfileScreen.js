import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { connect } from 'react-redux';

import * as actions from '../actions';

class ProfileScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="person" size={30} color={tintColor} />
    ),
  };

  componentWillMount() {
    this.props.getUserData();
  }

  componentDidMount() {
    console.log('Load ProfileScreen');
  }

  logoutUser() {
    this.props.logout(() => {
      this.props.navigation.navigate('welcome');
    });
  }

  render() {
    if (this.props.user) {
      const name = this.props.user.data.profileData.name;
      const {
        numTimesEnteredSector,
        numTimesLightChanged
      } = this.props.user.data.userStats;

      return (
        <View style={styles.profileContainer}>
          <View style={styles.nameContainer}>
            <Image
              style={styles.picture}
              source={require('../../assets/traffic-box-icon.png')}
            />
            <Text style={styles.name}>{name}</Text>
            <Button
              title='Logout'
              onPress={this.logoutUser.bind(this)}
              backgroundColor="rgba(0,0,0,0)"
              color="rgba(0, 122, 255, 1)"
            />
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.colOne}>
              <View style={styles.colOneBorder}>
                <Text style={styles.statOne}>{numTimesEnteredSector}</Text>
                <Text style={styles.statText}>Sectors Entered</Text>
              </View>
            </View>
            <View style={styles.colTwo}>
              <View style={styles.colTwoBorder}>
                <Text style={styles.statTwo}>{numTimesLightChanged}</Text>
                <Text style={styles.statText}>Lights Changed</Text>
              </View>
            </View>
          </View>
          <View style={styles.bottomContainer}>
          </View>
          {/* <View>
            <Text style={styles.header}>Profile</Text>
            <Button
              title='Logout'
              onPress={this.logoutUser.bind(this)}
              backgroundColor="rgba(0,0,0,0)"
              color="rgba(0, 122, 255, 1)"
            />
          </View>
          <Text>ProfileScreen</Text>
          <Text>ProfileScreen</Text>
          <Button
            onPress={this.props.getLocations.bind(this)}
            title={'Get Locations'}
          /> */}
        </View>
      );
    }

    return (<View />);
  }
}

const styles = {
  header: {
    fontSize: 38
  },
  picture: {
    width: 100,
    height: 100
  },
  name: {
    fontFamily: 'Dosis-Medium',
    fontSize: 48,
    paddingTop: 15,
    color: '#525252'
  },
  profileContainer: {
    backgroundColor: '#5FD48C',
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    height: '100%'
  },
  nameContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  statsContainer: {
    flex: 1,
    backgroundColor: '#525252',
    flexDirection: 'row'
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  colOneBorder: {
    marginTop: 25,
    marginBottom: 25,
    borderRightColor: 'white',
    borderRightWidth: 1,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  colTwoBorder: {
    marginTop: 25,
    marginBottom: 25,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  colOne: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center'
  },
  colTwo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  statOne: {
    color: 'white',
    fontSize: 42,
    // fontFamily: 'Roboto-Thin'
  },
  statTwo: {
    color: 'white',
    fontSize: 42,
    // fontFamily: 'Roboto-Thin'
  },
  statText: {
    color: 'white',
    fontSize: 16,
    // fontFamily: 'Roboto-Thin'
  }
};

function mapStateToProps(state) {
  return {
    user: state.auth.user
  };
}

export default connect(mapStateToProps, actions)(ProfileScreen);
