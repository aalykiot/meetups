import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import firebase from '../services/firebase';
import Card from '../Components/Card';

class GoingEventsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          title: 'GreeceJS #28: React Unorthodox',
          description:
            'We hope you had some much-needed rest during the season break. Our first meetup for 2019 is scheduled for Jan 15. This time we focus on unorthodox React, that is React used in unconventional ways. Panagiotis Vourtsis will introduce us to React Native used for mobile development. Dimitris Michalakos will dive into Next.js, server-side rendering and the struggle for painless development on the web. Last, but not least, Apostolos Apostolakis will do a lightning talk on startups and venture capital.',
          location: 'Technopolis - Gazi',
          date: 'Tuesday, January 15, 2019 6:00 PM to 9:00 PM',
        },
        {
          title: 'GreeceJS #28: React Unorthodox',
          description:
            'We hope you had some much-needed rest during the season break. Our first meetup for 2019 is scheduled for Jan 15. This time we focus on unorthodox React, that is React used in unconventional ways. Panagiotis Vourtsis will introduce us to React Native used for mobile development. Dimitris Michalakos will dive into Next.js, server-side rendering and the struggle for painless development on the web. Last, but not least, Apostolos Apostolakis will do a lightning talk on startups and venture capital.',
          location: 'Technopolis - Gazi',
          date: 'Tuesday, January 15, 2019 6:00 PM to 9:00 PM',
        },
      ],
    };
  }

  static navigationOptions = {
    title: 'Events',
  };

  render() {
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
                going={32}
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
