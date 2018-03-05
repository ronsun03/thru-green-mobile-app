import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ButtonClear = (props) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={props.onPress} style={styles.buttonStyle}>
      <Text style={styles.textStyle}>
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#333',
    marginLeft: 5,
    marginRight: 5,
    position: 'relative'
  }
};

export { ButtonClear };
