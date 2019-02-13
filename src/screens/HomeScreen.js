import React, { Component } from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import EventsScreen from './EventsScreen';
import CreateEventScreen from './CreateEventScreen';
import InvitePeopleScreen from './InvitePeopleScreen';

import firebase from 'firebase';

const AppContainer = createAppContainer(
  createStackNavigator({
    Events: {
      screen: EventsScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Meetups',
      }),
    },
    CreateEvent: CreateEventScreen,
    InvitePeople: InvitePeopleScreen,
  })
);

class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return <AppContainer />;
  }
}

export default HomeScreen;
