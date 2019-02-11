import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';

import { SignInNavigator } from './router';
import firebase from './services/firebase';

const SignIn = createAppContainer(SignInNavigator);

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      user: {}
    }
  }

  render() {

    const { isSignedIn, user } = this.state;

    return (
      <View style={styles.container}>
        { !isSignedIn ? <SignIn /> : <Text>Home</Text> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
