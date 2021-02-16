import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchScreen from './SearchScreen';
import FriendsScreen from './FriendsScreen';
import RequestsScreen from './RequestsScreen';
//import MapScreen from './MapScreen';
import SettingsScreen from './SettingsScreen';
import MapScreen from './MapScreen';

const bottomTabNavigator = createBottomTabNavigator(
    {
        Search: {
            screen: SearchScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons name="home" color={tintColor} size={25} />
                )
            }
        },
        Friends: {
            screen: FriendsScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons name="home" color={tintColor} size={25} />
                )
            }
        },
        Requests: {
            screen: RequestsScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons name="home" color={tintColor} size={25} />
                )
            }
        },
        Map: {
            screen: MapScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons name="map" color={tintColor} size={25} />
                )
            }
        },
        Settings: {
            screen: SettingsScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons name="home" color={tintColor} size={25} />
                )
            }
        }
    },
    {initialRouteName: 'Map'}
);

bottomTabNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible;
    if (navigation.state.routes.length > 1) {
      navigation.state.routes.map(route => {
        if (route.routeName === "FriendMap") {
          tabBarVisible = false;
        } else {
          tabBarVisible = true;
        }
      });
    }
  
    return {
      tabBarVisible
    };
  };

const MenuNavigator = createAppContainer(bottomTabNavigator);

class Main extends React.Component {
    render() {
        return (
            <MenuNavigator/>
        )
    }
}

export default Main;