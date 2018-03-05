import React, { Component } from 'react';
// import { Font } from 'expo';
import { View, Text, Switch, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';

import * as actions from '../actions';

class AppScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'App',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="apps" size={30} color={tintColor} />
    ),
  };

  // async componentDidMount() {
  //   await Font.loadAsync({
  //     'Dosis-Bold': require('../../assets/fonts/Dosis-Bold.ttf'),
  //     'Dosis-Medium': require('../../assets/fonts/Dosis-Medium.ttf'),
  //     'Dosis-Light': require('../../assets/fonts/Dosis-Light.ttf'),
  //     'OpenSans-Regular': require('../../assets/fonts/OpenSans-Regular.ttf'),
  //     'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
  //     'Roboto-Thin': require('../../assets/fonts/Roboto-Thin.ttf'),
  //   })
  //
  //   this.props.loadFonts();
  // }

  render() {
    return (
      this.props.fontsLoaded ? (
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require('../../assets/images/logo.jpg')}
          />
          <Text style={styles.header}>Welcome to ThruGreen</Text>
          <Text style={styles.caption}>Flip the switch below to get started.</Text>
          <ToggleSwitch
            isOn={false}
            onColor='#3EB56C'
            offColor='#F78D8D'
            // label='Example label'
            labelStyle={{ color: 'black', fontWeight: '900' }}
            size='large'
            onToggle={(isOn) => this.props.appToggle(isOn)}
          />
        </View>
      ) : null
    );
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
    // fontFamily: 'Dosis-Medium',
    fontSize: 36,
    color: '#525252',
    paddingTop: 35,
    marginTop: 35,
    marginBottom: 5,
    alignSelf: 'center',
    textAlign: 'center'
  },
  caption: {
    // fontFamily: 'Roboto-Thin',
    fontSize: 17,
    color: '#333',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 40
  }
};

function mapStateToProps(state) {
  return {
    fontsLoaded: state.auth.fontsLoaded
  };
}

export default connect(mapStateToProps, actions)(AppScreen);
