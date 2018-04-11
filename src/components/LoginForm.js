import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Card, CardSection, InputWhite, Button, Spinner } from './common';

class LoginForm extends Component {
  onEmailChange(text) {
    this.props.emailChanged(text);
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onButtonPress() {
    const { email, password } = this.props;

    this.props.loginUser({ email, password }, () => {
      this.props.navigation.navigate('main');
    });
  }

  renderError() {
    if (this.props.error) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={styles.errorTextStyle}>
            {this.props.error}
          </Text>
        </View>

      );
    }
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size='large' />;
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)} >
        Login
      </Button>
    );
  }

  render() {
    return (
      <View>
        <View style={styles.containerStyle}>
          <InputWhite
            label="Email"
            placeholder="email@gmail.com"
            onChangeText={this.onEmailChange.bind(this)}
            value={this.props.email}
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
            value={this.props.password}
            keyboardType={'default'}
            autoCorrect={false}
          />
        </View>
        <View style={styles.containerStyle}>
          {this.renderError()}
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
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
    email: state.auth.email,
    password: state.auth.password,
    error: state.auth.error,
    loading: state.auth.loading
  };
};

export default connect(mapStateToProps, actions)(LoginForm);
