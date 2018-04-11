import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Card, CardSection, InputWhite, Button, Spinner, ButtonClear } from './common';

class ForgotPasswordModal extends Component {
  state = {
    email: ''
  }

  onForgotPasswordEmailChange(text) {
    this.setState({ email: text })
  }

  closeForgotPasswordModal() {
    this.props.closeForgotPasswordModal();
  }

  renderCloseButton() {
    return (
      <ButtonClear onPress={this.closeForgotPasswordModal.bind(this)} >
        Close
      </ButtonClear>
    )
  }

  resetPassword() {
    console.log(this.state.email);
    this.props.resetPassword(this.state.email,
      function() {
        Alert.alert(
          'Success!',
          'A reset password email has been successfully sent.',
          [
            {text: 'Close'}
          ]
        )
      },
      function() {
        Alert.alert(
          'Error',
          'Unable to send reset email password. Please double check your email.',
          [
            {text: 'Close'}
          ]
        )
      }
    )
  }

  renderForgotButton() {
    if (this.props.forgotPasswordLoading) {
      return <Spinner size='large' />;
    }

    return (
      <Button onPress={this.resetPassword.bind(this)} >
        Reset Password
      </Button>
    );
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.forgotPasswordModalVisible}
        onRequestClose={ () => {} }
        style={styles.modal}
      >
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.hideView} />
            <View style={styles.formView}>
              <View style={styles.formContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.textHeader}>Forgot your password?</Text>
                  <Text style={styles.textCaption}>Enter your email below and we'll send you a password reset link.</Text>
                </View>
                <InputWhite
                  label="Email"
                  placeholder="email@gmail.com"
                  onChangeText={this.onForgotPasswordEmailChange.bind(this)}
                  value={this.state.email}
                  keyboardType={'default'}
                  autoCorrect={false}
                />
                <View style={{ marginBottom: 40 }} />
                {this.renderForgotButton()}
                <View style={{ marginBottom: 5 }} />
                {this.renderCloseButton()}
              </View>
            </View>
            <View style={styles.hideView} />
          </ScrollView>
        </View>
      </Modal>
    )
  }
}

const styles = {
  modal: {
    marginLeft: 15,
    marginRight: 15,
    padding: 15,
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
    height: '50%'
  },
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0, 0.7)'
  },
  formView: {
    flex: 3,
    position: 'relative',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 60
  },
  hideView: {
    flex: 1
  },
  formContainer: {
    backgroundColor: '#f6f6f6',
    flex: 1,
    position: 'relative',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  textContainer: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textHeader: {
    fontSize: 26,
    fontFamily: 'Dosis-Medium',
    marginBottom: 30,
    marginTop: 20,
    color: '#3EB56C',
  },
  textCaption: {
    fontSize: 16,
    textAlign: 'center'
  }
};

const mapStateToProps = state => {
  return {
    forgotPasswordModalVisible: state.auth.forgotPasswordModalVisible,
    forgotPasswordLoading: state.auth.forgotPasswordLoading
  }
}

export default connect(mapStateToProps, actions)(ForgotPasswordModal);
