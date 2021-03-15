import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs'
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
            navigationOptions: ({navigation}) => ({
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome5 name="user-friends" color={tintColor} size={25} />
                ),
                tabBarOnPress: async () => {
                    try {
                        await AsyncStorage.setItem('stopFetchFriends', "true");
                    }
                    catch (err) {
                        console.log(err);
                    }
                    navigation.navigate(navigation.state.routeName, navigation.state.index);
                }
            })
        },
        Requests: {
            screen: RequestsScreen,
            navigationOptions: ({navigation}) => (
                {
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome5 name="user-clock" color={tintColor} size={25} />
                ),
                tabBarOnPress: () => {
                    //console.log('onPress:', navigation.state.routeName);
                    navigation.navigate(navigation.state.routeName, navigation.state.index);
                }
            })
        },
        Map: {
            screen: MapScreen,
            navigationOptions: ({navigation}) => ({
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome5 name="map-marked-alt" color={tintColor} size={25} />
                ),
                tabBarOnPress: async () => {
                    try {
                        await AsyncStorage.setItem('stopFetchFriends', "false");
                    }
                    catch (err) {
                        console.log(err);
                    }
                    navigation.navigate(navigation.state.routeName, navigation.state.index);
                }
            })
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
    {
        initialRouteName: 'Map',
        tabBarOptions: {tabStyle: {backgroundColor: "black"}}
    }
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