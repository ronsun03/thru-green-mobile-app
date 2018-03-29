import React, { Component } from 'react';
// import { Font } from 'expo';
import { View, Text, Switch, Image, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
import ToggleSwitch from 'toggle-switch-react-native';

import * as actions from '../actions';

class AppScreen extends Component {
  state = {
    loaded: false,
    appToggle: null
  }

  static navigationOptions = {
    tabBarLabel: 'App',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="apps" size={30} color={tintColor} />
    ),
  };

  componentWillMount() {
    AsyncStorage.getItem('appToggle').then(response => {
      const appToggle = JSON.parse(response);
      console.log('appToggle get: ', appToggle);
      this.props.initializeToggle(appToggle)
      this.setState({
        loaded: true,
        appToggle
      })
    })

    // Get latest list of areas and store in localstorage
    const areaRef = firebase.database().ref('/areas');
    areaRef.once('value', snapshot => {
      AsyncStorage.setItem('areaList', JSON.stringify(snapshot.val())).then(() => {
        console.log('Area List successfully updated.');
      })
    })
  }

  render() {
    if (this.state.loaded && this.props.user) {
      let appToggle = this.state.appToggle;

      if (appToggle === null) {
        appToggle = false;
      }

      return (
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require('../../assets/images/logo.jpg')}
          />
          <Text style={styles.header}>Welcome to ThruGreen</Text>
          <Text style={styles.caption}>Flip the switch below to get started.</Text>
          <ToggleSwitch
            isOn={appToggle}
            onColor='#3EB56C'
            offColor='#F78D8D'
            // label='Example label'
            labelStyle={{ color: 'black', fontWeight: '900' }}
            size='large'
            onToggle={(isOn) => this.props.appToggle(isOn, this.props.user)}
          />
        </View>
      );
    } else {
      return <View />
    }

  }
}

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingLeft: 30,
    paddingRight: 30
  },
  header: {
    borderTopColor: '#3EB56C',
    borderTopWidth: 1,
    fontFamily: 'Dosis-Medium',
    fontSize: 36,
    color: '#525252',
    paddingTop: 35,
    marginTop: 35,
    marginBottom: 5,
    alignSelf: 'center',
    textAlign: 'center'
  },
  caption: {
    fontFamily: 'Roboto-Thin',
    fontSize: 17,
    color: '#333',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 40
  }
};

function mapStateToProps(state) {
  return {
    isAppOn: state.map.isAppOn,
    fontsLoaded: state.auth.fontsLoaded,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps, actions)(AppScreen);
