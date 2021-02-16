import React from 'react';
import {View, Text, StyleSheet, Image, Button} from 'react-native';
//import Tips from 'react-native-tips'
import MapView, {Marker} from "react-native-maps";
import {fetchFriends, postCoords, fetchAccount} from '../redux/ActionCreators';
import {connect} from 'react-redux';

var showAllFriends = true;

const mapStateToProps = state => {
    return {
        friends: state.friends,
        account: state.account
    }
}

const mapDispatchToProps = dispatch => ({
    fetchFriends: () => {dispatch(fetchFriends())},
    postCoords: (coords) => {dispatch(postCoords(coords))},
    fetchAccount: () => {dispatch(fetchAccount())}
});

class MapScreen extends React.Component {
    componentDidMount() {
        this.props.fetchFriends();
        this.props.fetchAccount();
    }

    render() {
        //console.log("this.props.friends.friends: ", this.props.friends.friends);
        //console.log("this.props.friends.friends.friends :", this.props.friends.friends.friends);
        const friends = null;//this.props.friends.friends !== undefined ? this.props.friends.friends.friends : null;
        const friend = this.props.navigation.getParam('friend', '') ? this.props.navigation.getParam('friend', '') : null;
        //console.log("Laaaaatiiiiituuuuudeee: ", friend.coords.latitude);
        //console.log("Friends: ",  this.props.friends.friends.friends);
        if (friend != null)
            return <FriendMap friend={friend}/>
        if (!friend || showAllFriends)
            return <Map friends={this.props.friends.friends !== null ? this.props.friends.friends.friends : null}
                        user={this.props.account.account}
                        postCoords={this.props.postCoords}
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
                <Button title="All" onPress={() => showAllFriends = true}/>
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

const Map = ({friends, user, postCoords}) => {
    const [location, setLocation] = React.useState({latitude: 0, longitude: 0, timestamp: ''});
    navigator.geolocation.getCurrentPosition(position => {
        setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude, timestamp: position.timestamp});
    });

    const [showTip, setShowTip] = React.useState({show: false, id: ''});

    const markers = friends ? friends.map((friend) => {
        if (friend.visible)
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

    if (location.latitude !== 0 && location.longitude !== 0) {
        setInterval(() => {
            //console.log("Current coords: " + location.latitude + ":" + location.longitude);
            postCoords({"latitude": location.latitude, "longitude": location.longitude, "timestamp": location.timestamp});
        }, 10000);
        return (
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                >
                <Marker
                    coordinate={{ latitude: location.latitude, longitude: location.longitude}}>
                    { user ?
                        <View style={styles.markerContainer}>
                            <Text style={styles.markerText}>{user.fullname} (You)</Text>
                            <Image style={styles.marker} source={{uri: user.image}}/>
                        </View>
                        : null
                    }
                </Marker>
                {markers ? markers : null}
            </MapView>
        );
    }
    else return (
            <View style={{flex: 1, top: "50%"}}>
                <Text style={{color: "blue", fontSize: 32, fontWeight: "bold", alignSelf: "center"}}>Loading coordinates...</Text>
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