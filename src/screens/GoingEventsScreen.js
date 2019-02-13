import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
              const { title, description, location, date } = eventDoc.data();
              tempData.push({
                id: eventId,
                title,
                description,
                location,
                date,
              });
              if (index === events.length - 1 || events.length === 0) {
                this.setState({ data: tempData });
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
      <FlatList
        data={this.state.data}
        renderItem={({ item, index }) => (
          <View>
            <Card
              title={item.title}
              description={item.description}
              location={item.location}
              date={item.date}
            />
          </View>
        )}
      />;
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
