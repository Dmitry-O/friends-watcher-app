import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, FlatList, Image, ScrollView, SafeAreaView, LogBox } from 'react-native';
import { ListItem, Avatar, Button } from 'react-native-elements';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import {fetchRequests, postRequests} from '../redux/ActionCreators';
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        requests: state.requests
    }
}

const mapDispatchToProps = dispatch => ({
    fetchRequests: () => {dispatch(fetchRequests())},
    postRequests: (requestId) => {dispatch(postRequests(requestId))}
});

class RequestsScreen extends React.Component {
    componentDidMount() {
        this.props.fetchRequests();
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }

    constructor(props) {
        super(props);

        this.handlePost = this.handlePost.bind(this);
    }

    handlePost(id) {
        //console.log("Did post requests: ", id);
        this.props.postRequests(id);
    }

    render() {
        const renderFriendItem = ({item, index}) => {
            return (
                <ListItem key={index} bottomDivider>
                    <Avatar source={{uri: item.image}} />
                    <ListItem.Content>
                        <ListItem.Title>{item.fullname}</ListItem.Title>
                        <ListItem.Subtitle>{item.username}</ListItem.Subtitle>
                    </ListItem.Content>
                    <Button title="Add friend" onPress={() => this.handlePost(item._id)}/>
                </ListItem>
            );
       };

       var data = this.props.requests.requests.requests;       
       
        return (
            <View style={{ flex: 1, padding: 24 }}>
                { this.props.requests.requests !== null ? this.props.requests.requests.length !== undefined ? 
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
                        <Text style={{fontSize: 30, fontWeight: "bold"}}>Request list is empty...</Text>
                        <Button style={{marginTop: 50}} title="Find friends" onPress={() => this.props.navigation.navigate('Search')}/>
                    </View>
                :   <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: 30, fontWeight: "bold"}}>Request list is empty...</Text>
                        <Button style={{marginTop: 50}} title="Find friends" onPress={() => this.props.navigation.navigate('Search')}/>
                    </View>
                }
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestsScreen);