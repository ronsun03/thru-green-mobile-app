import React, { Component } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';

import { ButtonClear } from '../components/common';
import { existingUserLoggedIn } from '../actions';


import LoginForm from '../components/LoginForm';

class LoginScreen extends Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            this.props.existingUserLoggedIn(user, () => { this.props.navigation.navigate('main'); });
          }
       });
  }

  onButtonPress() {
    this.props.navigation.navigate('welcome');
  }

  renderCreateAccountButton() {
    return (
      <View style={styles.containerStyle}>
        <ButtonClear onPress={this.onButtonPress.bind(this)} >
          Create an Account
        </ButtonClear>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={styles.loginContainer}>
            <View style={styles.topLogin}>
              <View style={styles.centerColumn}>
                <View style={styles.stack}>
                  <Image
                    style={styles.image}
                    source={require('../../assets/images/logo.jpg')}
                  />
                  {/* <Text style={styles.titleStyle}>
                    ThruGreen
                  </Text>
                  <Text style={styles.subtitleStyle}>
                    Stay Safe. Arrive Quickly.
                  </Text> */}
                </View>
              </View>
            </View>
            <View style={styles.formHolder}>
              <LoginForm navigation={this.props.navigation} />
              {this.renderCreateAccountButton()}
            </View>
          </View>
        </ScrollView>
      </View>
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
    fontSize: 28,
    flexWrap: 'wrap',
    color: 'white',
    fontWeight: '500',
    alignSelf: 'center',
    paddingTop: 15
  },
  subtitleStyle: {
    fontSize: 24,
    flexWrap: 'wrap',
    color: 'white',
    fontWeight: '500',
    alignSelf: 'center'
  },
  loginContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  },
  topLogin: {
    flex: 3,
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
  },
  containerStyle: {
    padding: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    position: 'relative',
    width: '80%',
    alignSelf: 'center'
  }
};

export default connect(null, { existingUserLoggedIn })(LoginScreen);
