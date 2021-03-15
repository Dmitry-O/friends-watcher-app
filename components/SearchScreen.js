import React from 'react';
import { StyleSheet, ActivityIndicator, Text, View, FlatList, ScrollView, SafeAreaView, TouchableOpacity, LogBox } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
//import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { ListItem, Avatar, Button, Header, Icon } from 'react-native-elements';
import {fetchUsers, postRequests} from '../redux/ActionCreators';
import {connect} from 'react-redux';
import { _styles } from '../shared/styles';

const mapStateToProps = state => {
    return {
        users: state.users
    }
}

const mapDispatchToProps = dispatch => ({
    fetchUsers: () => {dispatch(fetchUsers())},
    postRequests: (requestId) => {dispatch(postRequests(requestId))}
});

class SearchScreen extends React.Component {
    componentDidMount() {
        this.props.fetchUsers();
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }

    render() {
        var data = this.props.users.users.filter((user) => user !== null);
        
        if (this.props.users.isLoading)
            return (
                <View style={_styles.loadingContainer}> 
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text style={{color: "blue", fontSize: 40, fontWeight: "bold"}}>Loading...</Text>            
                </View>
            );
        else return <Search data={data} postRequests={this.props.postRequests}/>
    }
}

const style = StyleSheet.create({
    searchInput: {
        borderWidth: 1,
        borderColor: "#575DD9",
        alignSelf: "stretch",
        margin: 32,
        height: 64,
        borderRadius: 6,
        fontSize: 24,
        fontWeight: "300",
        paddingHorizontal: 16,
        color: 'white'
    },
    itemTitle: {
        color: 'white'
    },
    itemSubtitle: {
        color: 'white'
    }
});

const Search = ({data, postRequests}) => {
    const [search, setSearch] = React.useState('');

    var filteredUsers = data.map((usr) => {
        if (usr.username.toLowerCase().indexOf(search.toLowerCase()) !== -1)
            return usr;
    });

    function handlePostRequest(id) {
        postRequests(id);
        console.log(id, " user was posted");
    }

    const renderUsersItem = ({item, index}) => {
        //const backgroundColor = 'black';
        return (
            <ListItem key={index} bottomDivider containerStyle={{backgroundColor: 'black', color: 'white'}}>
                {item.image ? <Avatar rounded size="medium" avatarStyle={_styles.avatarStyle} source={{uri: item.image}} /> : null}
                <ListItem.Content>
                    <ListItem.Title style={_styles.itemTitle}>{item.fullname}</ListItem.Title>
                    <ListItem.Subtitle style={_styles.itemSubtitle}>{item.username}</ListItem.Subtitle>
                </ListItem.Content>
                <TouchableOpacity
                    activeOpacity={0.75}
                    style={{backgroundColor: "#ffc400", opacity: item.friend ? 0.5 : 1, width: 100, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 5}}
                    disabled={item.friend ? true : false}
                    onPress={() => handlePostRequest(item._id)}
                >
                    <Text style={{color: "black", fontSize: 14, fontWeight: 'bold'}}>{item.friend ? 'Friend added' : 'Add friend'}</Text>
                </TouchableOpacity>               
            </ListItem>
        );
   };

   const renderFilteredUsers = filteredUsers.map((usr) => {
       if (usr)
            return (
                <ListItem key={usr._id} bottomDivider containerStyle={{backgroundColor: 'black'}}>
                    {usr.image ? <Avatar size="medium" avatarStyle={_styles.avatarStyle} source={{uri: usr.image}} /> : null}
                    <ListItem.Content>
                        <ListItem.Title style={_styles.itemTitle}>{usr.fullname}</ListItem.Title>
                        <ListItem.Subtitle style={_styles.itemSubtitle}>{usr.username}</ListItem.Subtitle>
                    </ListItem.Content>

                    <TouchableOpacity
                        activeOpacity={0.75}
                        style={{backgroundColor: "#ffc400", opacity: usr.friend ? 0.5 : 1, width: 100, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 5}}
                        disabled={usr.friend ? true : false}
                        onPress={() => handlePostRequest(usr._id)}
                    >
                        <Text style={{color: "black", fontSize: 14, fontWeight: 'bold'}}>{usr.friend ? 'Friend added' : 'Add friend'}</Text>
                    </TouchableOpacity>
                </ListItem>
            );
   });

    return (
        <View style={_styles.container}>
            <Header containerStyle={{height: 70, backgroundColor: 'black'}}>
                <View/>
                <View>
                    <Text style={{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>
                        Search
                    </Text>
                </View>
                <Icon 
                    name="search"
                    type="font-awesome-5"
                    color="#fff"
                    style={{marginTop: 10}}
                />
            </Header>
            <View style={{padding: 24, backgroundColor: 'black'}}>
                <TextInput placeholder="Users searching" placeholderTextColor="#7d7d7d" style={_styles.searchInput} onChangeText={(text) => setSearch(text)}/>
                <ScrollView>
                    {   search === '' ?
                        <View style={{height: 500}}>
                            <FlatList
                                data={data}
                                renderItem={(renderUsersItem)}
                                keyExtractor={item => item._id}
                            />
                        </View>
                        : 
                        renderFilteredUsers
                    }       
                 
                </ScrollView>   
            </View>
        </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);