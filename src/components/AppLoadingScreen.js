import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

class AppLoadingScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <Image
          style={styles.image}
          source={require('../../assets/images/logo.jpg')}
        />
      </View>
    )
  }
}

const styles = {
    image: {
      // width: 110,
      // height: 110,
      alignSelf: 'center'
    }
};

export default AppLoadingScreen;
