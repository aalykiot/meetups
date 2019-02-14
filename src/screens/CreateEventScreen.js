import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ToastAndroid,
} from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import short from 'short-uuid';
import RNCalendarEvents from 'react-native-calendar-events';

import firebase from '../services/firebase';

class CreateEventScreen extends Component {
  static navigationOptions = {
    title: 'Create new event',
  };

  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      dateIndex: 0,
      title: '',
      description: '',
      location: '',
      startDate: undefined,
      endDate: undefined,
      invites: [],
      creating: false,
    };
  }

  addUserToInvites = user => {
    const { invites } = this.state;
    const alreadyInvited = invites.some(item => item.id === user.id);

    if (!alreadyInvited) {
      this.setState(prevState => ({
        invites: [...prevState.invites, user],
      }));
    } else {
      this.setState(prevState => ({
        invites: prevState.invites.filter(item => item.id !== user.id),
      }));
    }
  };

  submit = async () => {
    const {
      title,
      description,
      location,
      startDate,
      endDate,
      invites,
    } = this.state;
    const uid = firebase.auth().currentUser.uid;

    if (
      (title !== '' && description !== '' && location !== '' && startDate,
      endDate)
    ) {
      const fulfilled = await RNCalendarEvents.authorizationStatus();
      if (fulfilled === 'undetermined' || fulfilled === 'denied') {
        const status = await RNCalendarEvents.authorizeEventStore();
        if (status === 'denied' || status === 'undetermined') {
          Alert.alert(
            'Calendar access required',
            'You have to grand the app, calendar access in order to create evets or accept invitations'
          );
          return;
        }
      }

      this.setState({ creating: true });

      const eventId = short().new();

      try {
        await firebase
          .firestore()
          .collection('events')
          .doc(eventId)
          .set({
            creator: uid,
            title,
            description,
            location,
            startDate: moment(startDate).unix(),
            endDate: moment(endDate).unix(),
            going: [],
          });

        const creatorData = await firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .get();
        if (creatorData.exists) {
          await firebase
            .firestore()
            .collection('users')
            .doc(uid)
            .set({
              ...creatorData.data(),
              events: [...creatorData.data().invites, eventId],
            });
        }

        invites.forEach(async user => {
          const userData = await firebase
            .firestore()
            .collection('users')
            .doc(user.id)
            .get();
          if (userData.exists) {
            await firebase
              .firestore()
              .collection('users')
              .doc(user.id)
              .set({
                ...userData.data(),
                invites: [...userData.data().invites, eventId],
              });
          }
        });

        await RNCalendarEvents.saveEvent(title, {
          isDetached: true,
          location: location,
          alarms: [{ date: 60 }, { date: 1440 }],
          startDate: moment(
            Number.parseInt(moment(startDate).unix(), 10) * 1000
          ).toISOString(),
          endDate: moment(
            Number.parseInt(moment(endDate).unix(), 10) * 1000
          ).toISOString(),
        });

        ToastAndroid.showWithGravity(
          'Event added to calendar!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );

        this.props.navigation.goBack();
      } catch (err) {
        Alert.alert(
          'Creation failed',
          'Unable to create the event. Try again later.'
        );
        console.log(err);
      }
    }
  };

  renderDateString = index => {
    const { startDate, endDate } = this.state;
    if (index === 0) {
      return this.state.startDate
        ? this.state.startDate.toString()
        : 'Set starting date';
    } else {
      return this.state.endDate
        ? this.state.endDate.toString()
        : 'Set ending date';
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Input
          placeholder="Title"
          inputStyle={styles.input}
          containerStyle={styles.inputContainer}
          onChangeText={title => this.setState({ title })}
        />
        <Input
          placeholder="Description"
          inputStyle={styles.input}
          containerStyle={styles.inputContainer}
          onChangeText={description => this.setState({ description })}
        />
        <Input
          placeholder="Location"
          inputStyle={styles.input}
          containerStyle={styles.inputContainer}
          onChangeText={location => this.setState({ location })}
        />

        <TouchableOpacity
          onPress={() =>
            this.setState({ isDateTimePickerVisible: true, dateIndex: 0 })
          }
        >
          <Text style={styles.link}>{this.renderDateString(0)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            this.setState({ isDateTimePickerVisible: true, dateIndex: 1 })
          }
        >
          <Text style={styles.link}>{this.renderDateString(1)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('InvitePeople', {
              invites: this.state.invites,
              addUserToInvites: this.addUserToInvites,
            })
          }
        >
          <Text style={styles.link}>Invite people</Text>
        </TouchableOpacity>

        <FlatList
          data={this.state.invites}
          renderItem={({ item }) => (
            <ListItem
              key={item.id}
              title={item.fullName}
              subtitle={item.email}
              leftIcon={{
                name: 'md-send',
                type: 'ionicon',
                size: 35,
                color: '#e74c3c',
              }}
            />
          )}
          style={{
            flex: 1,
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 5,
          }}
        />

        <Button
          title="Create the event"
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          onPress={() => this.submit()}
          loading={this.state.creating}
        />
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          mode="datetime"
          minimumDate={new Date()}
          onConfirm={date => {
            const { dateIndex } = this.state;
            if (dateIndex === 0) {
              this.setState({ startDate: date });
            } else {
              this.setState({ endDate: date });
            }
          }}
          onHideAfterConfirm={() =>
            this.setState({ isDateTimePickerVisible: false })
          }
          onCancel={() => this.setState({ isDateTimePickerVisible: false })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  input: {
    padding: 20,
  },
  inputContainer: {
    marginTop: -10,
    marginBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
  },
  button: {
    backgroundColor: '#e74c3c',
    padding: 15,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 20,
  },
  link: {
    color: '#e74c3c',
    marginTop: 15,
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft: 25,
    paddingRight: 25,
  },
});

export default CreateEventScreen;
