import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Card as RnCard, Button, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

import firebase from '../services/firebase';

class Card extends Component {
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

  render() {
    return (
      <RnCard containerStyle={{ marginBottom: 10 }} title={this.props.title}>
        <View style={{ flex: 1 }}>
          <Text style={{ marginBottom: 10 }}>{this.props.description}</Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Location</Text>
            <Text>{this.props.location}</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Date</Text>
            <Text>{this.props.date}</Text>
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
          <Button
            icon={
              <Icon
                name="md-thumbs-up"
                size={20}
                style={{ marginRight: 10 }}
                color="#ffffff"
              />
            }
            buttonStyle={{
              borderRadius: 0,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
            }}
            disabled
            disabledTitleStyle={{
              color: '#ffffff',
            }}
            disabledStyle={{
              backgroundColor: '#e74c3c',
            }}
            title="Going"
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

export default Card;
