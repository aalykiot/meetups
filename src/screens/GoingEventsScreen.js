import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
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
          const { events } = doc.data();
          const tempData = new Array();
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
              if (index === events.length - 1) {
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

    return (
      <View style={styles.container}>
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
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GoingEventsScreen;
