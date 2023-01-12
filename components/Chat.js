import { GiftedChat, InputToolbar, Bubble } from 'react-native-gifted-chat';

import React from 'react';
import { View, Platform, KeyboardAvoidingView, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Import functions from SDKs
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        avatar: '',
        name: '',
      },
      loggedInText: 'Please wait, you are getting logged in',
         image: null,
      location: null,
      isConnected: false,
    };

    //Set up Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyBgSpVg9CvxXdo3ELkfKhRCGvz8RuXjaIM',
        authDomain: 'chatapp-d34b7.firebaseapp.com',
        projectId: 'chatapp-d34b7',
        storageBucket: 'chatapp-d34b7.appspot.com',
        messagingSenderId: '624551959192',
        appId: '1:624551959192:web:1bbea0566a464ed772ceed',
      });
    }
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

    // Get messages locally from user's device
  async getMessages() {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    // Set the name property to be included in the navigation bar
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });
      } else {
        this.setState({
          isConnected: false,
        });
      }
    });

        //Anonymous user authentication
        this.referenceChatMessages = firebase.firestore().collection('messages');

        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
            },
            loggedInText: '',
          });
          this.unsubscribe = this.referenceChatMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        });
      }

  componentWillUnmount() {
    if (this.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  //Retrieve collection data & store in messages
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through each document
    querySnapshot.forEach((doc) => {
      // Get QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || '',
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || '',
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

  //Save messages to database
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  //Appends new message to previous
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //Allows bubble customization
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
          left: {
            backgroundColor: '#fff',
          },
        }}
      />
    );
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  render() {
    let color = this.props.route.params.color;
    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}

          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            avatar: 'https://placeimg.com/140/140/any',
          }}
        />
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
