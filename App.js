import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import Main from './components/Main';
import SigninForm from './components/SigninForm';

import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();

export default function App() {
  const [auth, setAuth] = React.useState(true);

  const isAuthenticated = async() => {
    try {
      console.log("hhheeeey ", await AsyncStorage.getItem('isAuthenticated'))
      return await AsyncStorage.getItem('isAuthenticated');
    }
    catch (err) {
      console.log(err);
    }
  }

  //console.log("is auth: ", auth);

  isAuthenticated();

  return (
    <Provider store={store}>
      {isAuthenticated ? <SigninForm/> : <Main/>}
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
/**
 * 
 * <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
 */