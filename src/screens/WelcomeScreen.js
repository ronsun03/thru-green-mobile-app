import React, { Component } from 'react';
// import { Font } from 'expo';
import { View, Text, Image } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';

import * as actions from '../actions';


import CreateAccountForm from '../components/CreateAccountForm';

class WelcomeScreen extends Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log('user logged in: ', user);
            this.props.existingUserLoggedIn(user, () => { this.props.navigation.navigate('main'); });
          }
       });
  }



  async componentDidMount() {
    // await Font.loadAsync({
    //   'Dosis-Bold': require('../../assets/fonts/Dosis-Bold.ttf'),
    //   'Dosis-Medium': require('../../assets/fonts/Dosis-Medium.ttf'),
    //   'Dosis-Light': require('../../assets/fonts/Dosis-Light.ttf'),
    //   'OpenSans-Regular': require('../../assets/fonts/OpenSans-Regular.ttf'),
    //   'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
    //   'Roboto-Thin': require('../../assets/fonts/Roboto-Thin.ttf'),
    // });

    this.props.loadFonts();
  }

  render() {
    console.log('this.props.fontsLoaded', this.props.fontsLoaded);
    return (
      this.props.fontsLoaded ? (
        <View style={styles.loginContainer}>
          <View style={styles.topLogin}>
            <View style={styles.centerColumn}>
              <View style={styles.stack}>
                <Image
                  style={styles.image}
                  source={require('../../assets/images/logo.jpg')}
                />
                <Text style={styles.titleStyle}>
                  Welcome to ThruGreen
                </Text>
                <Text style={styles.subtitleStyle}>
                  To get started, create an account below.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.formHolder}>
            <CreateAccountForm navigation={this.props.navigation} />
          </View>
        </View>
      ) : null
      // <View>
      //   <Text>
      //     Hello
      //   </Text>
      // </View>
    );
  }
}

const styles = {
  image: {
    // width: 110,
    // height: 110,
    alignSelf: 'center'
  },
  titleStyle: {
    borderTopColor: '#3EB56C',
    borderTopWidth: 1,
    // fontFamily: 'Dosis-Medium',
    fontSize: 36,
    color: '#3EB56C',
    paddingTop: 35,
    marginTop: 35,
    marginBottom: 20,
    alignSelf: 'center',
    textAlign: 'center'
  },
  subtitleStyle: {
    // fontFamily: 'Roboto-Thin',
    fontSize: 17,
    color: '#333',
    alignSelf: 'center',
    textAlign: 'center'
  },
  loginContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  },
  topLogin: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  formHolder: {
    flex: 2
  },
  centerColumn: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  stack: {
    flexDirection: 'column'
  }
};

function mapStateToProps(state) {
  return {
    fontsLoaded: state.auth.fontsLoaded
  };
}

export default connect(mapStateToProps, actions)(WelcomeScreen);
