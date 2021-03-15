import React from 'react';
import { StyleSheet, Text, View, FlatList, Alert, Modal, Pressable, ScrollView, SafeAreaView, LogBox, ActivityIndicator } from 'react-native';
import { ListItem, Avatar, Button, Header, Icon } from 'react-native-elements';
import { createBottomTabNavigator, createAppContainer, NavigationEvents } from 'react-navigation';
import {fetchFriends, deleteFriend} from '../redux/ActionCreators';
import {connect} from 'react-redux';
import getDistance from '../shared/destinationFunc';
import getOnlineStatus from '../shared/onlineFunc';
import { _styles } from '../shared/styles';
import AnimatedLoader from "react-native-animated-loader";

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
        flexDirection: "row",
        padding: 10,
    },
    modalView: {
      margin: 10,
      height: 375,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      backgroundColor: "black",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "yellow"
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
      textAlign: "center",
      color: "white",
      fontSize: 25
    }
  });

const useEffect = (fetchFriends) => React.useEffect(() => {
    let isMounted = true;
    if (isMounted)
        fetchFriends();
    return () => { isMounted = false };
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
                        <Avatar rounded size="large" avatarStyle={_styles.avatarStyle} source={{uri: item.image}}/>
                        <View style={{flexDirection: "column"}}>
                            <Text style={styles.modalText}>{item.fullname}</Text>
                            <Text style={styles.modalText}>{item.username}</Text>
                        </View>
                    </View>
                    <Text style={styles.modalText}>{item.telnum ? 'Tel. num: ' + item.telnum : null}</Text>
                    <Text style={styles.modalText}>{item.visible ? getOnlineStatus(item.timestamp ? item.timestamp : new Date()) : 'Was online recently'}</Text>
                    <Text style={styles.modalText}>{item.visible && item.coords !== undefined ? 'In ' + Math.floor(getDistance(+item.coords.latitude, +item.coords.longitude, +myCoords.latitude, +myCoords.longitude)) 
                            + ' km from you' : null}</Text>
                    <View style={styles.modalContent}>
                        <Button title="View on Map" disabled={!item.visible ?? false}
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
        //isMounted = true;
        //if (isMounted)
        this.props.fetchFriends;
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
            //useEffect();
            //const [modalVisible, setModalVisible] = React.useState(false);
            return (
                <ListItem key={index} bottomDivider containerStyle={{backgroundColor: "black"}}
                    onPress={() => this.setModalVisible(true, item._id)}>
                    <Avatar rounded size="large" avatarStyle={_styles.avatarStyle} source={{uri: item.image}} />
                    <ListItem.Content>
                        <ListItem.Title style={_styles.itemTitle}>{item.fullname}</ListItem.Title>
                        <ListItem.Subtitle style={_styles.itemSubtitle}>{item.username}</ListItem.Subtitle>
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
       
       if (this.props.friends.isLoading)
            return (
                <View style={_styles.loadingContainer}> 
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text style={{color: "blue", fontSize: 40, fontWeight: "bold"}}>Loading...</Text>            
                </View>
            );
        else return (
            <View style={_styles.container}>
                <Header containerStyle={{height: 70, backgroundColor: 'black'}}>
                    <View/>
                    <View>
                        <Text style={{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>
                            Friends
                        </Text>
                    </View>
                    <Icon 
                        name="users"
                        type="font-awesome-5"
                        color="#fff"
                        style={{marginTop: 10}}
                    />
                </Header>
                <View style={{ flex: 1, padding: 24 }}>
                    { this.props.friends.friends !== null || this.props.friends.friends.length !== 0 ? 
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
                    }
                </View>
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