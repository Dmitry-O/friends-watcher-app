import React from 'react';
import { StyleSheet, ActivityIndicator, Text, View, FlatList, ScrollView, SafeAreaView, LogBox } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
//import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { ListItem, Avatar, Button, Header, Icon } from 'react-native-elements';
import {fetchUsers, postRequests} from '../redux/ActionCreators';
import {connect} from 'react-redux';

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
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}> 
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text style={{color: "blue", fontSize: 40, fontWeight: "bold"}}>Loading...</Text>            
                </View>
            );
        else return <Search data={data} postRequests={this.props.postRequests}/>
    }
}

const styles = StyleSheet.create({
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
        color: 'black'
    },
    itemSubtitle: {
        color: 'black'
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
            <View style={{backgroundColor: 'transparent'}}>
            <ListItem key={index} bottomDivider>
                {item.image ? <Avatar rounded source={{uri: item.image}} /> : null}
                <ListItem.Content>
                    <ListItem.Title style={styles.itemTitle}>{item.fullname}</ListItem.Title>
                    <ListItem.Subtitle style={styles.itemSubtitle}>{item.username}</ListItem.Subtitle>
                </ListItem.Content>
                
                <Button title={item.friend ? 'Friend added' : 'Add friend'}
                    disabled={item.friend ? true : false}
                    onPress={() => handlePostRequest(item._id)}
                />    
               
            </ListItem>
            </View>  
        );
   };

   const renderFilteredUsers = filteredUsers.map((usr) => {
       if (usr)
            return (
                <View style={{backgroundColor: 'red'}}>
                <ListItem key={usr._id} bottomDivider>
                    {usr.image ? <Avatar source={{uri: usr.image}} /> : null}
                    <ListItem.Content>
                        <ListItem.Title>{usr.fullname}</ListItem.Title>
                        <ListItem.Subtitle>{usr.username}</ListItem.Subtitle>
                    </ListItem.Content>

                    <Button title={usr.friend ? 'Friend added' : 'Add friend'}
                        disabled={usr.friend ? true : false}
                        onPress={() => handlePostRequest(usr._id)}/>
                </ListItem>
                </View>
            );
   });

    return (
        <View style={{flex: 1, backgroundColor: 'black'}}>
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
                <TextInput style={styles.searchInput} onChangeText={(text) => setSearch(text)}/>
                <ScrollView style={{backgroundColor: 'black'}}>
                    {   search === '' ?
                    <View style={{backgroundColor: 'black'}}>
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