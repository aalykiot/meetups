import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Header } from 'react-navigation';

import firebase from '../services/firebase';

class SignUpScreen extends Component {
  static navigationOptions = {
    title: 'Sign up to meetups',
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      loading: false,
    };
  }

  async submit() {
    const { name, email, password } = this.state;

    if (name === '' || email === '' || password === '') {
      return;
    }

    const db = firebase.firestore();

    try {
      this.setState({ loading: true });

      const profile = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await db
        .collection('users')
        .doc(profile.user.uid)
        .set({
          id: profile.user.uid,
          email: profile.user.email,
          fullName: name,
          events: [],
          invites: []
        });

      this.props.navigation.navigate('App');
    } catch (err) {
      Alert.alert('Sign up failed', err.message);
    }

    this.setState({ loading: false });
  }

  render() {
    const { loading } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <Input
            placeholder="Full Name"
            inputStyle={styles.input}
            containerStyle={styles.inputContainer}
            leftIcon={{ type: 'font-awesome', name: 'user' }}
            onChangeText={name => this.setState({ name })}
          />
          <Input
            placeholder="Email"
            inputStyle={styles.input}
            containerStyle={styles.inputContainer}
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            onChangeText={email => this.setState({ email })}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            inputStyle={styles.input}
            containerStyle={styles.inputContainer}
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={password => this.setState({ password })}
          />
        </KeyboardAvoidingView>
        <Button
          title="Sign up"
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          loading={loading}
          onPress={() => this.submit()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  baseView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  input: {
    padding: 20,
  },
  inputContainer: {
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
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
