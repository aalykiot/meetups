import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import firebase from '../services/firebase';
import InviteCard from '../Components/InviteCard';

class PendingEventsScreen extends Component {
  static navigationOptions = {
    title: 'Invitations',
  };

  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      data: [],
    };
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    try {
      firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .onSnapshot(doc => {
          const { invites } = doc.data() || [];
          if (invites.length === 0) {
            this.setState({ data: invites });
            if (!this.state.initialized) {
              this.setState({ initialized: true });
            }
            return;
          }
          let tempData = [];
          invites.reverse().forEach(async (eventId, index) => {
            const eventDoc = await firebase
              .firestore()
              .collection('events')
              .doc(eventId)
              .get();
            if (eventDoc.exists) {
              const {
                title,
                description,
                location,
                startDate,
                endDate,
                going,
                creator,
              } = eventDoc.data();
              tempData.push({
                id: eventId,
                title,
                description,
                location,
                startDate,
                endDate,
                creator,
                peopleGoing: going,
              });
            }
            tempData = tempData.filter(
              event => moment(new Date()).unix() <= event.startDate
            );

            if (index === invites.length - 1 || tempData.length === 0) {
              this.setState({
                data: tempData,
              });
              if (!this.state.initialized) {
                this.setState({ initialized: true });
              }
            }
          });
        });
    } catch (err) {
      Alert.alert(
        'Data loading failed',
        'Sorry, but something went wrong while loading your data'
      );
    }
  }

  renderInvites = () => {
    const { data } = this.state;
    if (data.length === 0) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Icon name="md-sad" size={100} style={{ marginBottom: 20 }} />
          <Text style={{ fontSize: 20 }}>No invites found</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={this.state.data}
          renderItem={({ item, index }) => (
            <InviteCard
              id={item.id}
              title={item.title}
              description={item.description}
              location={item.location}
              peopleGoing={item.peopleGoing}
              creator={item.creator}
              startDate={item.startDate}
              endDate={item.endDate}
            />
          )}
        />
      );
    }
  };

  render() {
    if (!this.state.initialized) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#e74c3c" />
        </View>
      );
    }

    return <View style={styles.container}>{this.renderInvites()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PendingEventsScreen;
