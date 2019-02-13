import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';

class CreateEventScreen extends Component {
  static navigationOptions = {
    title: 'Create new event',
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      invites: [],
    };
  }

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

        <TouchableOpacity>
          <Text style={styles.link}>Add date and starting time</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link}>Invite people</Text>
        </TouchableOpacity>

        <Button
          title="Create the event"
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
  },
});

export default CreateEventScreen;
