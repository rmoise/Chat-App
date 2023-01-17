import React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Image from '../assets/background-image.png';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome';


const backgroundColors = {
  black: '#556CD2',
  purple: '#ffe0cc',
  grey: '#E0E4E7',
  green: '#D6EFDE',
};

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', color: '', fontsLoaded: false };
  }

  async loadFonts() {
    await Font.loadAsync({
      'Poppins-Bold': require('../assets/Poppins/Poppins-Bold.ttf'),
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();
  }

  render() {
    if (this.state.fontsLoaded) {
      return (
        <View style={styles.container}>
          <ImageBackground source={Image} style={styles.image}>
            <Text style={styles.title}>Chat App</Text>
            <View style={styles.startWrapper}>
              <View style={styles.inputWrapper}>
                <Icon name="user" size={22} color="#757083" style={{ marginLeft: 8 }} />
                <TextInput
                  style={styles.input}
                  onChangeText={(name) => this.setState({ name })}
                  value={this.state.name}
                  placeholder="Your Name"
                />
              </View>
              <View style={styles.colorWrapper}>
                <Text style={styles.colorText}>Choose Background Color</Text>
                <View style={styles.colors}>
                  <TouchableOpacity
                    style={[
                      styles.color,
                      { backgroundColor: backgroundColors.black },
                    ]}
                    onPress={() =>
                      this.setState({ color: backgroundColors.black })
                    }
                  />
                  <TouchableOpacity
                    style={[
                      styles.color,
                      { backgroundColor: backgroundColors.purple },
                    ]}
                    onPress={() =>
                      this.setState({ color: backgroundColors.purple })
                    }
                  />
                  <TouchableOpacity
                    style={[
                      styles.color,
                      { backgroundColor: backgroundColors.grey },
                    ]}
                    onPress={() =>
                      this.setState({ color: backgroundColors.grey })
                    }
                  />
                  <TouchableOpacity
                    style={[
                      styles.color,
                      { backgroundColor: backgroundColors.green },
                    ]}
                    onPress={() =>
                      this.setState({ color: backgroundColors.green })
                    }
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  this.props.navigation.navigate('Chat', {
                    name: this.state.name,
                    color: this.state.color,
                  })
                }
                accessible={true}
                accessibilityLabel="Start chatting"
                accessibilityHint="Enter the chat room, where you can send messages to your contacts."
              >
                <Text style={styles.buttonText}>Start Chatting</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    marginTop: 95,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '55%',
  },

  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: '600',
    color: '#3C405B',
    marginTop: -70,

    marginBottom: 100,
    fontFamily: 'Poppins-Bold',
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    color: backgroundColors.grey,
    fontFamily: 'Poppins-Bold',
  },

  startWrapper: {
    flex: 2,
    backgroundColor: 'white',
    maxHeight: '55%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
     borderTopLeftRadius: 20,
       borderTopRightRadius: 20,
    //paddingVertical: '6%',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'lightgrey',
    opacity: 50,
    height: 60,
    width: '88%',
    borderColor: '#90C9F9',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 5,
  },

  icon: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },

  input: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    height: 60,
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 2,
    borderRadius: 5,
    //elevation: 2,
    position: 'absolute',
    left: -2,
    paddingLeft: 35,
    paddingRight: 20,
    width: '101%',
  },

  colorWrapper: {
    width: '88%',
    justifyContent: 'center',
  },

  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },

  colors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  color: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginTop: '4%',
    marginRight: 25,
  },

  button: {
    height: 60,
    width: '88%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#90C9F9',
     borderRadius: 16,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
