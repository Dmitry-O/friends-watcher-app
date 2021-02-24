import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
                    <FontAwesome5 name="search" color={tintColor} size={25} />
                )
            }
        },
        Friends: {
            screen: FriendsScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome5 name="user-friends" color={tintColor} size={25} />
                )
            }
        },
        Requests: {
            screen: RequestsScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome5 name="user-clock" color={tintColor} size={25} />
                )
            }
        },
        Map: {
            screen: MapScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome5 name="map-marked-alt" color={tintColor} size={25} />
                )
            }
        },
        Settings: {
            screen: SettingsScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome name="gear" color={tintColor} size={25} />
                )
            }
        }
    },
    {initialRouteName: 'Map'}
);

const MenuNavigator = createAppContainer(bottomTabNavigator);

class Main extends React.Component {
    render() {
        return (
            <MenuNavigator/>
        )
    }
}

export default Main;