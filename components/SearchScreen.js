import React from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, SafeAreaView, LogBox } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
//import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { ListItem, Avatar, Button } from 'react-native-elements';
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

        return <Search data={data} postRequests={this.props.postRequests}/>
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
        paddingHorizontal: 16
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
        return (
            <ListItem key={index} bottomDivider>
                {item.image ? <Avatar source={{uri: item.image}} /> : null}
                <ListItem.Content>
                    <ListItem.Title>{item.fullname}</ListItem.Title>
                    <ListItem.Subtitle>{item.username}</ListItem.Subtitle>
                </ListItem.Content>
                
                <Button title={item.friend ? 'Friend added' : 'Add friend'}
                    disabled={item.friend ? true : false}
                    onPress={() => handlePostRequest(item._id)}/>
                        
            </ListItem>
                
        );
   };

   const renderFilteredUsers = filteredUsers.map((usr) => {
       if (usr)
            return (
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
            );
   });

    return (
        <View style={{flex: 1, padding: 24}}>
            <TextInput style={styles.searchInput} onChangeText={(text) => setSearch(text)}/>
            <ScrollView>
                <SafeAreaView style={{flex: 1}}>
                {   search === '' ?
                    <FlatList
                        data={data}
                        renderItem={(renderUsersItem)}
                        keyExtractor={item => item._id}
                    />
                    : 
                    renderFilteredUsers
                }       
                </SafeAreaView>
            </ScrollView>   
        </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);