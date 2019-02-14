import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  ToastAndroid,
} from 'react-native';
import {
  Card as RnCard,
  Button,
  ListItem,
  ButtonGroup,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';

import firebase from '../services/firebase';

class InviteCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPeople: false,
      fetching: false,
      data: [],
    };
  }

  componentDidMount() {
    const { peopleGoing, creator } = this.props;
    try {
      this.setState({ fetching: true });
      const tmpData = [];
      [...peopleGoing, creator].forEach(async (peopleId, index) => {
        const peopleDoc = await firebase
          .firestore()
          .collection('users')
          .doc(peopleId)
          .get();
        if (peopleDoc.exists) {
          const { fullName } = peopleDoc.data();
          tmpData.push(fullName);
          if (index === peopleGoing.length) {
            this.setState({ data: tmpData, fetching: false });
          }
        }
      });
    } catch (err) {
      // Failed to load people
    }
  }

  renderPeople = () => {
    const { data, fetching, showPeople } = this.state;
    if (showPeople) {
      if (fetching) {
        return <ActivityIndicator size="small" color="#e74c3c" />;
      } else {
        return (
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => {
              return (
                <ListItem
                  title={item}
                  containerStyle={{
                    padding: 5,
                    marginLeft: 10,
                    width: '100%',
                  }}
                  leftIcon={{
                    name: 'md-checkmark',
                    type: 'ionicon',
                    size: 20,
                  }}
                />
              );
            }}
            style={{
              flex: 1,
            }}
          />
        );
      }
    } else {
      return <View />;
    }
  };

  handleInvite = async type => {
    const fulfilled = await RNCalendarEvents.authorizationStatus();

    const accepted = type === 0;
    const { id, title, startDate, endDate, location } = this.props;
    const userId = firebase.auth().currentUser.uid;

    try {
      if (accepted) {
        if (fulfilled === 'undetermined' || fulfilled === 'denied') {
          const status = await RNCalendarEvents.authorizeEventStore();
          if (status === 'denied' || status === 'undetermined') {
            Alert.alert(
              'Calendar access required',
              'You have to grand the app, calendar access in order to accept invitations'
            );
          }
        }
        const eventDoc = await firebase
          .firestore()
          .collection('events')
          .doc(id)
          .get();

        if (eventDoc.exists) {
          const { going } = eventDoc.data();

          await firebase
            .firestore()
            .collection('events')
            .doc(id)
            .set({
              ...eventDoc.data(),
              going: [...going, userId],
            });

          await RNCalendarEvents.saveEvent(title, {
            isDetached: true,
            location: location,
            alarms: [{ date: 60 }, { date: 1440 }],
            startDate: moment(
              Number.parseInt(startDate, 10) * 1000
            ).toISOString(),
            endDate: moment(Number.parseInt(endDate, 10) * 1000).toISOString(),
          });

          ToastAndroid.showWithGravity(
            'Event added to calendar!',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        }
      }

      const userDoc = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .get();

      if (userDoc.exists) {
        const { events, invites } = userDoc.data();

        await firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .set({
            ...userDoc.data(),
            invites: invites.filter(inviteId => inviteId !== id),
            events: accepted ? [...events, id] : events,
          });
      }
    } catch (err) {
      Alert.alert(
        'Operation Failed',
        'Unable to accept invite, try again later.'
      );
    }
  };

  component1 = () => <Icon name="md-thumbs-up" size={20} />;
  component2 = () => <Icon name="md-thumbs-down" size={20} />;

  render() {
    const buttons = [
      { element: this.component1 },
      { element: this.component2 },
    ];

    return (
      <RnCard containerStyle={{ marginBottom: 10 }} title={this.props.title}>
        <View style={{ flex: 1 }}>
          <Text style={{ marginBottom: 10 }}>{this.props.description}</Text>
          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
            }}
          >
            <Text style={{ fontWeight: 'bold', marginRight: 15 }}>
              Location
            </Text>
            <Text>{this.props.location}</Text>
          </View>
          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
            }}
          >
            <Text style={{ fontWeight: 'bold', marginRight: 15 }}>
              Starting
            </Text>
            <Text>
              {moment.unix(this.props.startDate).format('DD/MM/YYYY - hh:mm')}
            </Text>
          </View>
          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
            }}
          >
            <Text style={{ fontWeight: 'bold', marginRight: 15 }}>Ending</Text>
            <Text>
              {moment.unix(this.props.endDate).format('DD/MM/YYYY - hh:mm')}
            </Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() =>
                this.setState(prevState => ({
                  showPeople: !prevState.showPeople,
                }))
              }
            >
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                {this.state.data.length} Going
              </Text>
            </TouchableOpacity>
            {this.renderPeople()}
          </View>
          <ButtonGroup
            buttons={buttons}
            onPress={val => this.handleInvite(val)}
            containerStyle={{ flex: 1 }}
          />
        </View>
      </RnCard>
    );
  }
}

const styles = StyleSheet.create({
  link: {
    color: '#e74c3c',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default InviteCard;
