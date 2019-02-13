import React, { Component } from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import EventsScreen from './EventsScreen';

const AppContainer = createAppContainer(
  createStackNavigator({
    Events: {
      screen: EventsScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Meetups',
      }),
    },
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
