import React from 'react';
import { StyleSheet, Text, View, FlatList, Alert, Modal, Pressable, ScrollView, SafeAreaView, LogBox } from 'react-native';
import { ListItem, Avatar, Button } from 'react-native-elements';
import { createBottomTabNavigator, createAppContainer, NavigationEvents } from 'react-navigation';
import {fetchFriends, deleteFriend} from '../redux/ActionCreators';
import {connect} from 'react-redux';
import getDistance from '../shared/destinationFunc';
import getOnlineStatus from '../shared/onlineFunc';

const mapStateToProps = state => {
    return {
        friends: state.friends
    }
}

const mapDispatchToProps = dispatch => ({
    fetchFriends: () => {dispatch(fetchFriends())},
    deleteFriend: (friendId) => {dispatch(deleteFriend(friendId))}
});

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalContent: {
        flex: 1,
        flexDirection: "row"
    },
    modalView: {
      margin: 20,
      height: 250,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });

const FriendInfo = ({item, setModalVisible, visible, myCoords, navigate, deleteFriend}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(false);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <Avatar source={{uri: item.image}}/>
                        <View style={{flexDirection: "column"}}>
                            <Text style={styles.modalText}>{item.fullname}</Text>
                            <Text style={styles.modalText}>{item.username}</Text>
                        </View>
                    </View>
                    <Text>Tel. num: {item.telnum}</Text>
                    <Text>{item.visible ? getOnlineStatus(item.timestamp ? item.timestamp : new Date()) : null}</Text>
                    <Text>{ item.visible ? 'In' + Math.floor(getDistance(+item.coords.latitude, +item.coords.longitude, +myCoords.latitude, +myCoords.longitude)) 
                            + 'km from you' : null}</Text>
                    <View style={styles.modalContent}>
                        <Button title="View on Map" disabled={item.visible ? false : true}
                            onPress={() => navigate('Map', {friend: item})}
                        />
                        <Button title="Delete friend" onPress={() => deleteFriend(item._id)}/>
                    </View>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.textStyle}>OK</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

class FriendsScreen extends React.Component {
    componentDidMount() {
        this.props.fetchFriends();
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            modalId: ''
        }

        this.setModalVisible = this.setModalVisible.bind(this);
    }

    setModalVisible(flag, id) {
        this.setState({modalVisible: flag, modalId: id});
    }

    render() {
        const renderFriendItem = ({item, index}) => {
            //const [modalVisible, setModalVisible] = React.useState(false);
            return (
                <View>
                    <ListItem key={index} bottomDivider onPress={() => this.setModalVisible(true, item._id)}>
                        <Avatar source={{uri: item.image}} />
                        <ListItem.Content>
                            <ListItem.Title>{item.fullname}</ListItem.Title>
                            <ListItem.Subtitle>{item.username}</ListItem.Subtitle>
                            <Text>{index} : {item._id}</Text>
                        </ListItem.Content>
                        {
                            this.state.modalId === item._id ?
                            <FriendInfo item={item}
                                setModalVisible={this.setModalVisible}
                                visible={this.state.modalVisible}
                                myCoords={this.props.friends.friends.user.coords}
                                navigate={this.props.navigation.navigate}
                                deleteFriend={this.props.deleteFriend}
                            />
                            : null
                        }
                    </ListItem>
                </View>

                /*<ListItem
                    key={index}
                    title={item.fullname}
                    subtitle={item.username}
                    hideChevron={true}
                    leftAvatar={{ source: item.image}}
                  />*/
            );
       };

       //const {navigate} = this.props.navigation;

       var data = this.props.friends.friends ? this.props.friends.friends.friends : null;
       //console.log("An Arraaaayyy: ", data);
       
    
        return (
            <View style={{ flex: 1, padding: 24 }}>
                { this.props.friends.friends !== null ? this.props.friends.friends.length !== 0 ? 
                    <ScrollView>
                        <SafeAreaView style={{flex: 1}}>
                            <FlatList
                                data={data}
                                renderItem={(renderFriendItem)}
                                keyExtractor={item => item._id}
                            />
                    </SafeAreaView>
                </ScrollView>
                :   <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: 30, fontWeight: "bold"}}>Friend list is empty...</Text>
                        <Button style={{marginTop: 50}} title="Find friends" onPress={() => this.props.navigation.navigate('Search')}/>
                    </View>
                :    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: 30, fontWeight: "bold"}}>Friend list is empty...</Text>
                        <Button style={{marginTop: 50}} title="Find friends" onPress={() => this.props.navigation.navigate('Search')}/>
                    </View> 
                }
            </View>

            /*
           

            <View style={{flex: 1}}>
                <FlatList 
                    data={this.props.friends.friends.friends}
                    renderItem={renderFriendItem}
                    keyExtractor={item => item._id}
                />
            </View>*/
        );
        //return (
         /*<View style={{flex: 1}}>
             <Text>Random text</Text>
         </View>*/
            //<Friends friends={this.props.friends.friends.friends}/>
        
        //)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsScreen);

/*
    const [token, setToken] = React.useState('');
    const getToken = async() => {
        try {
            setToken(await AsyncStorage.getItem('token'));
            //console.log(token);
        }
        catch (err) {
            console.log(err);
        }
    }

    const btn = () => {
        getToken();

        const bearer = 'Bearer ' + token; //'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDE1N2ZkNTJiM2FmODI3ZDBjNjA4NDEiLCJpYXQiOjE2MTIyMTI3NjMsImV4cCI6MTYxMjU3Mjc2M30.cRTH5xWSw8Jl6Wj54GTWskUvm9ZcN-eFe3gaxdu1qRs';
        
        //console.log(token);
        
        return fetch('https://infinite-brook-32272.herokuapp.com/users/account', {
            method: 'GET',
            //body: JSON.stringify(newDish),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bearer
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(error => { console.log('Post comments ', error.message);
            console.log('Your comment could not be posted\nError: '+ error.message); })
    }
    */


//export default FriendsScreen;