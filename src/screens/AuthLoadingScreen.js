import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

import firebase from '../services/firebase';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this._init();
  }

  _init = async () => {
    const user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'App' : 'Auth');
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Meetups</Text>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
  },
  logo: {
    color: '#ffffff',
    fontSize: 55,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
    marginBottom: 70,
  },
});

export default AuthLoadingScreen;
