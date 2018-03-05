import React from 'react';
import { TextInput, View, Text } from 'react-native';

const InputWhite = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCorrect }) => {
  const { inputStyle, labelStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={'#bdbdbd'}
        autoCorrect={false}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCorrect={autoCorrect}
        underlineColorAndroid={'#3EB56C'}
        selectionColor={'#3EB56C'}
      />
    </View>
  );
};

const styles = {
  inputStyle: {
    color: 'gray',
    fontSize: 14,
    lineHeight: 19,
    flex: 2,
    height: 40,
    width: 90,
    marginLeft: 10,
    marginRight: 5
  },
  labelStyle: {
    fontSize: 14,
    paddingLeft: 10,
    flex: 1,
    color: 'gray',
    fontWeight: 'bold'
  },
  containerStyle: {
    height: 30,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export { InputWhite };
