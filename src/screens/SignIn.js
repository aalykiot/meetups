import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Input, Button } from 'react-native-elements';

import firebase from '../services/firebase';

class SignIn extends Component {

  static navigationOptions = {
    title: 'Welcome to meetups',
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: "",
      password: ""
    };
  }

  async submit() {
    const { email, password } = this.state;

    if (email === '' || password === '') {
      return;
    }

    try {

      this.setState({ loading: true });

      const user = await firebase.auth().signInWithEmailAndPassword(email, password);

      Alert.alert('Sign in successful', user.uid);

    } catch (err) {
      Alert.alert('Sign in failed', err.message);
      console.log(err);
    }

    this.setState({ loading: false });
  }

  render() {

    const { loading } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={ styles.baseView }>
          <Text style={styles.logo}>Meetups</Text>
        </View>     
        <View style={styles.baseView}>
          <Input
              placeholder='Email'
              inputStyle={styles.input}
              containerStyle={styles.inputContainer}
              leftIcon={{ type: 'font-awesome', name: 'user' }}
              onChangeText={(email) => this.setState({ email })}
            />
            <Input
              placeholder='Password'
              secureTextEntry
              inputStyle={styles.input}
              containerStyle={styles.inputContainer}
              leftIcon={{ type: 'font-awesome', name: 'lock' }}
              onChangeText={(password) => this.setState({ password })}
            />
            <Button
              title="Sign in"
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
              onPress={() => this.submit()}
              loading={loading}
            />
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.link}>
                Sign up to meetups
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    color: '#e74c3c',
    fontSize: 55,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium'
  },
  input: {
    padding: 20
  },
  inputContainer: {
    marginTop: -10,
    marginBottom: 15,
    paddingLeft: 25,
    paddingRight: 25
  },
  button: {
    backgroundColor: '#e74c3c',
    padding: 15
  },
  buttonContainer: {
    width: '100%',
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 20
  },
  link: {
    color: '#e74c3c',
    marginTop: 15,
    fontSize: 15,
    fontWeight: 'bold'
  }

});

export default SignIn;
