import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

import firebase from 'firebase';

class InvitePeopleScreen extends Component {
  static navigationOptions = {
    title: 'Invite people',
  };

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      searching: false,
      results: [],
      localInvites: [],
    };
  }

  componentDidMount() {
    const invitesFromParent = this.props.navigation.getParam('invites');
    this.setState({ localInvites: invitesFromParent.map(user => user.id) });
  }

  onSearchChange = term => {
    this.setState({ searchTerm: term, searching: true });
    this.debounceSearch();
  };

  debounceSearch = _.debounce(() => {
    const { searchTerm } = this.state;
    firebase
      .firestore()
      .collection('users')
      .where('email', '==', searchTerm)
      .get()
      .then(response => {
        const tmpResults = response.docs.map(doc => {
          const udata = doc._document.proto.fields;
          return {
            id: udata.id.stringValue,
            email: udata.email.stringValue,
            fullName: udata.fullName.stringValue,
          };
        });
        this.setState({ results: tmpResults, searching: false });
      })
      .catch(err => console.log(err));
  }, 300);

  renderSearchResults = () => {
    const { results, localInvites } = this.state;

    if (this.state.searching) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#e74c3c" />
        </View>
      );
    } else {
      const addUserToInvites = this.props.navigation.getParam(
        'addUserToInvites'
      );

      return (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <ListItem
              key={item.id}
              title={item.fullName}
              subtitle={item.email}
              leftIcon={{
                name: 'md-send',
                type: 'ionicon',
                size: 35,
                color: localInvites.some(userId => userId === item.id)
                  ? '#e74c3c'
                  : '#95a5a6',
              }}
              onPress={() => {
                if (item.id !== firebase.auth().currentUser.uid) {
                  if (localInvites.some(userId => userId === item.id)) {
                    this.setState(prevState => ({
                      localInvites: prevState.localInvites.filter(
                        userId => userId !== item.id
                      ),
                    }));
                  } else {
                    this.setState(prevState => ({
                      localInvites: [...prevState.localInvites, item.id],
                    }));
                  }
                  addUserToInvites(item);
                }
              }}
            />
          )}
          style={{ flex: 1 }}
        />
      );
    }
  };

  render() {
    const { searchTerm } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          placeholder="Search email..."
          value={searchTerm}
          onChangeText={term => this.onSearchChange(term)}
        />
        {this.renderSearchResults()}
      </View>
    );
  }
}

export default InvitePeopleScreen;
