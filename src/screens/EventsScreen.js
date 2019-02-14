import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import GoingEventsScreen from './GoingEventsScreen';
import PendingEventsScreen from './PendingEventsScreen';

import firebase from '../services/firebase';

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
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => navigation.navigate('CreateEvent')}>
          <Icon
            name="md-add-circle"
            style={{ marginRight: 20 }}
            size={30}
            color="#e74c3c"
          />
        </TouchableOpacity>
        <Tooltip
          backgroundColor="#e74c3c"
          popover={
            <TouchableOpacity onPress={() => firebase.auth().signOut()}>
              <Text style={{ color: '#ffffff' }}>Sign out</Text>
            </TouchableOpacity>
          }
        >
          <Icon name="md-contact" style={{ marginRight: 20 }} size={30} />
        </Tooltip>
      </View>
    ),
  });

  render() {
    return <AppContainer />;
  }
}

export default EventsScreen;
