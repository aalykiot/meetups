import firebase from 'firebase';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyDjn1WEeV_rJC6j7XfCKo9FndD3gU6S_q4',
  authDomain: 'meetups-b39da.firebaseapp.com',
  databaseURL: 'https://meetups-b39da.firebaseio.com',
  projectId: 'meetups-b39da',
  storageBucket: 'meetups-b39da.appspot.com',
  messagingSenderId: '669096624869',
};

const app = firebase.initializeApp(config);

export default app;
