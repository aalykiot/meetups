import React, { Component } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

import firebase from '../services/firebase';

class GoingEventsScreen extends Component {
  static navigationOptions = {
    title: 'Events',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Going Events</Text>
        <Button title="Sign out" onPress={() => firebase.auth().signOut()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GoingEventsScreen;
