import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';

import { ButtonClear, InputWhite } from '../components/common';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { existingUserLoggedIn, openForgotPasswordModal } from '../actions';


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

  forgotPasswordClick() {
    this.props.openForgotPasswordModal()
  }


  render() {
    return (
      <KeyboardAvoidingView>
        {/* <View style={{ flex: 1 }}> */}
          {/* <ScrollView> */}
            <View style={styles.loginContainer}>
              <View style={styles.topLogin}>
                <View style={styles.centerColumn}>
                  <View style={styles.stack}>
                    <Image
                      style={styles.image}
                      source={require('../../assets/images/logo.jpg')}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.formHolder}>
                <LoginForm navigation={this.props.navigation} />
                {this.renderCreateAccountButton()}
                <TouchableOpacity
                  style={{ alignSelf: 'center', alignItems: 'center', width: '100%' }}
                  onPress={() => { this.forgotPasswordClick() }}
                >
                  <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#333' }}>
                      Forgot Password? Click Here.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <ForgotPasswordModal />

            </View>
          {/* </ScrollView> */}
        {/* </View> */}
      </KeyboardAvoidingView>
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
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  },
  topLogin: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    // marginTop: 110,
    // marginBottom: 110
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
  },
  modalContainer: {
    marginLeft: 15,
    marginRight: 15,
    padding: 15,
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid'

  }
};

export default connect(null, { existingUserLoggedIn, openForgotPasswordModal })(LoginScreen);
