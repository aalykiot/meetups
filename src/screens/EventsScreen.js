import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import GoingEventsScreen from './GoingEventsScreen';
import PendingEventsScreen from './PendingEventsScreen';

const AppContainer = createAppContainer(
  createBottomTabNavigator(
    {
      GoingEvents: GoingEventsScreen,
      PendingEvents: PendingEventsScreen,
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let IconComponent = Ionicons;
          let iconName;
          if (routeName === 'GoingEvents') {
            iconName = 'md-heart';
          } else if (routeName === 'PendingEvents') {
            iconName = 'md-notifications';
          }

          return <IconComponent name={iconName} size={30} color={tintColor} />;
        },
      }),
      tabBarOptions: {
        activeTintColor: '#e74c3c',
      },
    }
  )
);

class EventsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity onPress={() => navigation.navigate('CreateEvent')}>
        <Icon
          name="md-add-circle"
          style={{ marginRight: 15 }}
          size={30}
          color="#e74c3c"
        />
      </TouchableOpacity>
    ),
  });

  render() {
    return <AppContainer />;
  }
}

export default EventsScreen;
