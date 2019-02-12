import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import firebase from '../services/firebase';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this._init();
  }

  _init = async () => {
    const user = firebase.auth().currentUser;
    this.props.navigation.navigate(user ? 'App' : 'Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AuthLoadingScreen;
