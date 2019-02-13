import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card as RnCard, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const Card = props => (
  <RnCard containerStyle={{ marginBottom: 10 }} title={props.title}>
    <Text style={{ marginBottom: 10 }}>{props.description}</Text>
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>Location</Text>
      <Text>{props.location}</Text>
    </View>
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>Date</Text>
      <Text>{props.date}</Text>
    </View>
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>Going</Text>
      <Text>{props.going} people</Text>
    </View>
    <Button
      icon={
        <Icon
          name="md-checkmark-circle"
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
  </RnCard>
);

export default Card;
