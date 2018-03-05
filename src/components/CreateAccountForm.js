import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Card, CardSection, InputWhite, Button, Spinner } from './common';

class CreateAccountForm extends Component {
  state = {
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    error: ''
  }

  onNameChange(text) {
    this.setState({ name: text });
  }

  onEmailChange(text) {
    this.setState({ email: text });
  }

  onPasswordChange(text) {
    this.setState({ password: text });
  }

  onPasswordConfirmChange(text) {
    this.setState({ passwordConfirm: text });
  }

  onButtonPress() {
    const { name, email, password, passwordConfirm } = this.state;

    // if (!name) {
    //   this.setState({ error: 'Please enter your name.' });
    //   return;
    // }

    this.props.createUser({ name, email, password, passwordConfirm }, () => {
      this.props.navigation.navigate('main');
      this.setState({
        email: '',
        password: '',
        passwordConfirm: '',
        name: ''
      });
    });
  }

  navigateToLogin() {
    this.props.navigation.navigate('login')
  }

  renderError() {
    if (this.props.createUserError) {
      return (
        <View style={{ backgroundColor: 'white', alignItems: 'center', width: '100%' }}>
          <Text style={styles.errorTextStyle}>
            {this.props.createUserError}
          </Text>
        </View>

      );
    }
  }

  renderButton() {
    if (this.props.createUserLoading) {
      return <Spinner size='large' />;
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)} >
        Create Account
      </Button>
    );
  }

  render() {
    return (
      <View>
        <View style={styles.containerStyle}>
          <InputWhite
            label="Full Name"
            placeholder="Jane Doe"
            onChangeText={this.onNameChange.bind(this)}
            value={this.state.name}
            keyboardType={'default'}
            autoCorrect={false}
          />
        </View>
        <View style={styles.containerStyle}>
          <InputWhite
            label="Email"
            placeholder="email@gmail.com"
            onChangeText={this.onEmailChange.bind(this)}
            value={this.state.email}
            keyboardType={'default'}
            autoCorrect={false}
          />
        </View>
        <View style={styles.containerStyle}>
          <InputWhite
            secureTextEntry
            label="Password"
            placeholder="password"
            onChangeText={this.onPasswordChange.bind(this)}
            value={this.state.password}
            keyboardType={'default'}
            autoCorrect={false}
          />
        </View>
        <View style={styles.containerStyle}>
          <InputWhite
            secureTextEntry
            label="Confirm Password"
            placeholder="password"
            onChangeText={this.onPasswordConfirmChange.bind(this)}
            value={this.state.passwordConfirm}
            keyboardType={'default'}
            autoCorrect={false}
          />
        </View>
        <View style={{ marginTop: 20 }} />
        <View style={styles.containerStyle}>
          {this.renderError()}
        </View>
        <View style={styles.containerStyle}>
          {this.renderButton()}
        </View>
        <View style={styles.containerStyle}>
          <TouchableOpacity
            style={{ alignSelf: 'center', alignItems: 'center', width: '100%' }}
            onPress={() => { this.navigateToLogin() }}
          >
            <View style={{ alignItems: 'center', alignSelf: 'center' }}>
              <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#333' }}>
                Already have an account? Login here.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 14,
    alignSelf: 'center',
    color: 'red'
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

const mapStateToProps = state => {
  return {
    // email: state.auth.email,
    // password: state.auth.password,
    createUserError: state.auth.createUserError,
    createUserLoading: state.auth.createUserLoading
  };
};

export default connect(mapStateToProps, actions)(CreateAccountForm);
