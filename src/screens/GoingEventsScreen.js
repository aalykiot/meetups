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
import Card from '../Components/Card';

class GoingEventsScreen extends Component {
  static navigationOptions = {
    title: 'Events',
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
          const { events } = doc.data() || [];
          if (events.length === 0) {
            this.setState({ data: events });
            if (!this.state.initialized) {
              this.setState({ initialized: true });
            }
            return;
          }
          const tempData = [];
          events.reverse().forEach(async (eventId, index) => {
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
                date,
                going,
                creator,
              } = eventDoc.data();
              tempData.push({
                id: eventId,
                title,
                description,
                location,
                date,
                creator,
                peopleGoing: going,
              });
              if (index === events.length - 1 || events.length === 0) {
                this.setState({
                  data: tempData.filter(
                    event => moment(new Date()).unix() <= event.date
                  ),
                });
                if (!this.state.initialized) {
                  this.setState({ initialized: true });
                }
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

  renderEvents = () => {
    const { data } = this.state;
    if (data.length === 0) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Icon name="md-sad" size={100} style={{ marginBottom: 20 }} />
          <Text style={{ fontSize: 20 }}>No events found</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={this.state.data}
          renderItem={({ item, index }) => (
            <Card
              title={item.title}
              description={item.description}
              location={item.location}
              peopleGoing={item.peopleGoing}
              creator={item.creator}
              date={moment.unix(item.date).format('DD/MM/YYYY - hh:mm')}
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

    return <View style={styles.container}>{this.renderEvents()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GoingEventsScreen;
