import React from 'react';
import {View, Text, StyleSheet, Image, Button, AsyncStorage, FlatList, ScrollView, TouchableOpacity, LogBox, Dimensions} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ListItem, Avatar, Header, Icon } from 'react-native-elements';
import {_styles} from '../shared/styles';
import getOnlineStatus from '../shared/onlineFunc';
//import Tips from 'react-native-tips'
import MapView, {Marker} from "react-native-maps";
import {fetchFriends, postCoords, fetchAccount, fetchFriendsCoords} from '../redux/ActionCreators';
import {connect} from 'react-redux';
import { LOGIN_FAILURE } from '../redux/ActionTypes';

var showAllFriends = true;
var isMounted = false;
var stopFetch;
var setLoc = false;

const stopFetchFriends = async () => {
    try {  
        let temp = await AsyncStorage.getItem('stopFetchFriends');
        for (let i=0; i<10; i++)
            console.log(temp);
        if (await AsyncStorage.getItem('stopFetchFriends') === 'true')
            stopFetch = true;
        if (await AsyncStorage.getItem('stopFetchFriends') === 'trfalseue')
            stopFetch = false;
    }
    catch (err) {
        console.log(err);
    }
}

const mapStateToProps = state => {
    return {
        friends: state.friends,
        account: state.account,
        friendsCoords: state.friendsCoords
    }
}

const mapDispatchToProps = dispatch => ({
    fetchFriends: () => {dispatch(fetchFriends())},
    postCoords: (coords) => {dispatch(postCoords(coords))},
    fetchAccount: () => {dispatch(fetchAccount())},
    fetchFriendsCoords: () => {dispatch(fetchFriendsCoords())}
});

class MapScreen extends React.Component {
    async componentDidMount() {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        this.props.fetchFriends();
        this.props.fetchAccount();
        console.log("friends coords --------------");
        this.props.fetchFriendsCoords();
        console.log("friends coords --------------");
                
        if (!stopFetch || stopFetch === undefined)
            try {
                stopFetchFriends();
                //console.log("---------------stopFetchFriends: ", stopFetch);
                setInterval(async () => {
                    
                    this.props.fetchFriendsCoords();
                    //this.props.fetchFriends();
                    //console.log("friends[2].coords: ", this.props.friends.friends.friends[2].coords);
                }, 5000);
            }
            catch (err) {
                console.log(err);
            }
    }

    componentWillUnmount() {
        isMounted = false;
        //stopFetchFriends = true;
        console.log("component unmonted");
    }

    render() {
        navigator.geolocation.getCurrentPosition(position => {
            console.log("position.coords.latitude: ", position.coords.latitude);
        });
        //console.log("----------friendsCoords: ", this.props.friendsCoords.coords)
        //onblur(() => console.log("blurrring"));
        //console.log(showAllFriends);
        //onblur(stopFetchFriends = true);
        //console.log("this.props.friends.friends: ", this.props.friends.friends);
        //console.log("this.props.friends.friends.friends :", this.props.friends.friends.friends);
        const friends = null;//this.props.friends.friends !== undefined ? this.props.friends.friends.friends : null;
        const friend = this.props.navigation.getParam('friend', '') ? this.props.navigation.getParam('friend', '') : null;
        //console.log("Laaaaatiiiiituuuuudeee: ", friend.coords.latitude);
        //console.log("Friends: ",  this.props.friends.friends.friends);
        if (friend != null)
            return <FriendMap friend={friend}/>
        else if (!friend || showAllFriends)
            return <Map friends={this.props.friendsCoords.coords !== null ? this.props.friendsCoords.coords.friends : null}
                        user={this.props.account.account}
                        postCoords={this.props.postCoords}
                        friendList={this.props.friends.friends.friends}
                    />
        else return <View></View>
    }
}

const FriendMap = ({friend}) => {
    showAllFriends = false;
    return (
        <View style={{flex: 1}}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: +friend.coords.latitude,
                    longitude: +friend.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                >
                <Marker coordinate={{ latitude: +friend.coords.latitude, longitude: +friend.coords.longitude }}>
                    <Text style={styles.markerText}>{friend.fullname}</Text>
                    <View style={{flex: 1, flexDirection: "row"}}>
                        <Image source={{uri: friend.image}} style={styles.marker}/>  
                    </View>  
                </Marker>
            </MapView>
            <View
                style={{
                    position: 'absolute',//use absolute position to show button on top of the map
                    top: '50%', //for center align
                    alignSelf: 'flex-end' //for align to right
                }}
                >
                <Button title="All" onPress={() => { showAllFriends = true; console.log("showAllFriends: ", showAllFriends); }}/>
            </View>
        </View>
    );
}

const Tip = ({friend}) => {
    return (
        <View style={styles.tip}>
            <Text style={styles.tipText}>Fullname: {friend.fullname}</Text>
            <Text style={styles.tipText}>Username: {friend.username}</Text>
            <Text style={styles.tipText}>Tel. num: {friend.telnum}</Text>
            <Text style={styles.tipText}>{friend.timestamp ? "Last seen: " + friend.timestamp : null}</Text>
        </View>
    );
}

const Map = ({friends, user, postCoords, friendList}) => {
    const [location, setLocation] = React.useState({latitude: 47.097266, longitude: 37.543203, timestamp: ''});
    navigator.geolocation.getCurrentPosition(position => {
        setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude, timestamp: position.timestamp});
    });

    const [showTip, setShowTip] = React.useState({show: false, id: ''});

    const [currentFriend, setCurrentFriend] = React.useState({latitude: undefined, longitude: undefined});

    const [search, setSearch] = React.useState('');
    const [showList, setShowList] = React.useState(false);

    var filteredFriends = friendList ? friendList.map((friend) => {
        if (friend.fullname.toLowerCase().indexOf(search.toLowerCase()) !== -1)
            return friend;
    }) : [];

    var aFriend = friendList ? friendList.map((friend) => {
        if (friend.coords.latitude === currentFriend.latitude && friend.coords.latitude === currentFriend.longitude)
            return friend;
    }) : null;
    
    const [region, setRegion] = React.useState({latitude: location.latitude, longitude: location.longitude});

    console.log("region: ", region.latitude, " -long: ", region.longitude);

    const markers = friends ? friends.map((friend) => {
        //console.log(coord._id === friend._id, " boolean; coord._id: ", coord._id, " friend._id: ", friend._id);
        if (friend.visible && friend.coords)
            return (
                <Marker style={styles.markerContainer}
                    key={friend._id} 
                    onPress={() => setShowTip({show: !showTip.show, id: friend._id})}
                    coordinate={{ latitude: +friend.coords.latitude,
                                longitude: +friend.coords.longitude}}
                    >
                    <Text style={styles.markerText}>{friend.fullname}</Text>
                    <View style={{flex: 1, flexDirection: "row"}}>
                        <Image source={{uri: friend.image}} style={styles.marker}/>  
                    </View>  
                    {showTip.show && showTip.id == friend._id ? <Tip friend={friend}/> : null} 
                </Marker>
            );
        else return (<View key={friend._id}></View>);
    }) : null;

    //console.log("friends: ", friends);

    //<Marker coordinate={{ latitude: 47.0570365, longitude: 37.4799073}}></Marker>
    //console.log("locaaaatiiiiioooon: ", location);

    setInterval(() => {
        //console.log("Current coords: " + location.latitude + ":" + location.longitude);
        postCoords({"latitude": location.latitude, "longitude": location.longitude, "timestamp": location.timestamp});
    }, 10000);    

    function handleOnPressTO(coords) {
        console.log("coordssssss: ", coords);
        //if (coords.latitude !== currentFriend.latitude && coords.longitude !== currentFriend.longitude)
            setCurrentFriend({latitude: coords.latitude, longitude: coords.longitude});
        console.log("handleOnPressTO: ", currentFriend.latitude);
    }

    const renderFriendsItem = ({item, index}) => {
        //const backgroundColor = 'black';
        return (
            <ListItem key={index} containerStyle={{ backgroundColor: item.visible ? 'white' : '#d4d4d4', borderWidth: 1, borderColor: "black", borderBottomWidth: 1 }}>
               <TouchableOpacity style={{flexDirection: "row"}}
                    disabled={!item.visible ?? false}
                    activeOpacity={0.5}
                    onPress={() => {
                        setCurrentFriend({latitude: item.coords.latitude, longitude: item.coords.longitude});
                        setShowList(false);
                        setRegion({latitude: +item.coords.latitude, longitude: +item.coords.longitude});
                        aFriend = friendList ? friendList.map((friend) => {
                            if (friend.coords.latitude === currentFriend.latitude && friend.coords.latitude === currentFriend.longitude)
                                return friend;
                        }) : null;
                        //console.log("currentFriend: ", currentFriend);
                    }}
                >               
                    <View style={{
                        backgroundColor: getOnlineStatus(item.timestamp ?? new Date()) === 'Online' ? "green" : "grey",
                        borderColor: "black",
                        borderWidth: 1,
                        borderRadius: 5,
                        width: 10,
                        height: 10,
                        marginRight: 5,
                        marginTop: 10
                    }}/>
                    {item.image ? <Avatar rounded avatarStyle={_styles.avatarStyle} source={{uri: item.image}} /> : null}
                    <ListItem.Content style={{marginLeft: 10}}>
                        <ListItem.Title>{item.fullname}</ListItem.Title>
                    </ListItem.Content>
                </TouchableOpacity>
            </ListItem>
        );
    };

    const renderFilteredFriends = filteredFriends.map((friend) => {
        if (friend) {
            return (
                <ListItem key={friend._id} bottomDivider>
                    <TouchableOpacity style={{flexDirection: "row"}}
                        onPress={() => handleOnPressTO(friend.coords)}
                    >
                        <View style={{
                            backgroundColor: getOnlineStatus(friend.timestamp ?? new Date()) === 'Online' ? "green" : "grey",
                            borderColor: "black",
                            borderWidth: 1,
                            borderRadius: 5,
                            width: 10,
                            height: 10,
                            marginRight: 5,
                            marginTop: 10
                        }}>
                        </View>
                        {friend.image ? <Avatar rounded avatarStyle={_styles.avatarStyle} source={{uri: friend.image}} /> : null}
                        <ListItem.Content style={{marginLeft: 10}}>
                            <ListItem.Title>{friend.fullname}</ListItem.Title>
                        </ListItem.Content>
                    </TouchableOpacity>
                </ListItem>
            );
        }
    });



    return (
        <View style={{flex: 1}}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                }}
                onRegionChange={reg => {
                    //console.log("Latitude 1: ", reg.latitude);
                    setTimeout(() => {
                        setRegion({latitude: reg.latitude, longitude: reg.longitude});
                    }, 5000);
                }}
                
                >
                {   location.latitude !== 47.097266 ? 
                    <Marker
                        coordinate = {{ 
                            latitude: location.latitude !== 47.097266 ? location.latitude : +user.coords.latitude, 
                            longitude: location.longitude !== 37.543203 ? location.longitude : +user.coords.longitude
                        }}>
                        { user ?
                            <View style={styles.markerContainer}>
                                <Text style={styles.markerText}>{user.fullname} (You)</Text>
                                <Image style={styles.marker} source={{uri: user.image}}/>
                            </View>
                            : null
                        }
                    </Marker>
                    : null
                }
                {markers ? markers : null}
            </MapView>
            <View
                style={{
                    position: 'absolute',//use absolute position to show button on top of the map
                    top: '0%', //for center align
                    alignSelf: 'center', //for align to right
                    width: 375,
                    opacity: 0.75,
                    flexDirection: "row"
                }}
                >
                <TextInput
                    placeholder="Searching friends"
                    onTouchStart={() => setShowList(true)}
                    onBlur={() => { /*setShowList(false);*/ console.log("on Blur showList", showList); }}
                    placeholderTextColor="grey"
                    style={_styles.searchMapInput}
                    onChangeText={(text) => setSearch(text)}
                />
                <TouchableOpacity style={{width: 85, backgroundColor: "orange", height: 55, marginTop: 10, borderWidth: 1, borderColor: "black", borderRadius: 10}}
                    onPress={() => setShowList(false)}
                >
                    <Text style={{alignSelf: "center", marginTop: 13, fontWeight: "bold", fontSize: 20}}>OK</Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    position: 'absolute',//use absolute position to show button on top of the map
                    top: '10%', //for center align
                    alignSelf: 'center', //for align to right
                    width: 350,
                }}
            >
                <ScrollView>
                    {   showList ?
                        search === '' ?
                            <View style={{height: 300}}>
                                <FlatList
                                    data={friendList}
                                    renderItem={(renderFriendsItem)}
                                    keyExtractor={item => item._id}
                                />
                            </View>
                        : 
                            renderFilteredFriends
                        :
                            null
                    }       
                </ScrollView>
            </View>
            {   currentFriend.latitude ?
                <View
                    style={{
                        position: 'absolute',//use absolute position to show button on top of the map
                        top: '30%', //for center align
                        alignSelf: "flex-end", //for align to 
                        borderWidth: 1,
                        borderColor: "black",
                        borderRadius: 5
                    }}
                >
                    <MapView style={{
                        height: Dimensions.get('window').height/5, 
                        width: Dimensions.get('window').width/2.5,
                        }}
                        region={{
                            latitude: currentFriend.latitude ? +currentFriend.latitude : 0,
                            longitude: currentFriend.longitude ? +currentFriend.longitude : 0,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05
                        }}
                    >
                        <Marker style={styles.markerContainer}
                            coordinate={{latitude: +currentFriend.latitude, longitude: +currentFriend.longitude}}
                        >
                            <Image source={{uri: aFriend.image}} style={styles.marker}/>  
                        </Marker>
                    </MapView>
                    <View style={{
                            width: 30,
                            height: 30,
                            borderColor: "black",
                            borderWidth: 1,
                            position: 'absolute',//use absolute position to show button on top of the map
                            //for center align
                            alignSelf: 'flex-end', 
                        }}>
                        <TouchableOpacity style={{marginTop: 5, alignItems: "center"}} onPress={() => setCurrentFriend({latitude: undefined, longitude: undefined})}>
                            <Text>X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                :
                null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    markerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    marker: {
        //backgroundColor: "blue",
        borderRadius: 20,
        //borderColor: "green",
        width: 40,
        height: 40,
    },
    markerText: {
        fontWeight: "bold",
        fontSize: 14
    },
    tip: {
        //flex: 1,
        width: 200,
        height: 75,
        backgroundColor: "white",
        borderRadius: 10,
        //color: "white",
        //borderColor: "black",
        //fontSize: 12
    },
    tipText: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);