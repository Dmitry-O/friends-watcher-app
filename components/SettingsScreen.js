import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, Text, View, Switch, Button, Image, Modal, AsyncStorage, TouchableOpacity } from 'react-native';
import { fetchAccount, putAccount, logoutUser } from '../redux/ActionCreators';
import { connect } from 'react-redux';
import { Avatar, Header, Icon } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import { FlatGrid } from 'react-native-super-grid';

var stopTimer = false;

const mapStateToProps = state => {
    return {
        account: state.account
    }
};

const getLoggedout = async() => {
    try {
        return await AsyncStorage.getItem('loggedout');
    }
    catch (err) {
        console.log(err);
    }
}

const mapDispatchToProps = dispatch => ({
    fetchAccount: () => {dispatch(fetchAccount())},
    putAccount: (info) => {dispatch(putAccount(info))},
    logoutUser: () => {dispatch(logoutUser())}
});

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      marginTop: 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold"
    },
    textContnet: {
        fontSize: 26,
        paddingTop: 10
    },
    modalContent: {
        flex: 1,
        flexDirection: "row"
    },
    modalView: {
        width: 300,
        height: 300,
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 4
    },
    gridView: {
        marginTop: 10,
        flex: 1,
        marginBottom: 20
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 5,
        height: 150,
    },
    buttons: {
        width: 150,
        paddingTop: 10
    },
    rows: {
        flexDirection: "row",
        paddingTop: 10
    }
});

class SettingsScreen extends Component {
    componentDidMount() {
        this.props.fetchAccount();
    }

    render() {
        var account = this.props.account.account;

        if (this.props.account.isLoading)
            return (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}> 
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text style={{color: "blue", fontSize: 40, fontWeight: "bold"}}>Loading...</Text>            
                </View>
            );
        else return (
            <View style={{flex: 1}}>
                <Header containerStyle={{height: 70, backgroundColor: 'black'}}>
                    <View/>
                    <View>
                        <Text style={{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>
                            Settings
                        </Text>
                    </View>
                    <Icon 
                        name="gear"
                        type="font-awesome"
                        color="#fff"
                        style={{marginTop: 10}}
                    />
                </Header>
                <View style={styles.centeredView}>
                    <Settings account={account}
                        putAccount={this.props.putAccount}
                        logoutUser={this.props.logoutUser}
                    />
                </View>
            </View>
        )
    }
}

const Settings = ({account, putAccount, logoutUser}) => {
    const [info, setInfo] = React.useState({
        fullname: account.fullname,
        telnum: account.telnum,
        visible: account.visible,
        image: account.image,
        username: account.username
    });

    const [modalVisible, setModalVisible] = React.useState(false);

   //console.log(avatars[0]);

   var avatars = [
    {
        id: '0',
        image: 'https://media.wired.com/photos/5f5fdba8af1c7b1f76a6a86b/master/pass/Culture_Pokemane_vtuber.jpg',
    },
    {
        id: '1',
        image: 'https://dt2sdf0db8zob.cloudfront.net/wp-content/uploads/2019/12/9-Best-Online-Avatars-and-How-to-Make-Your-Own-for-Free-image1-5.png',
    },
    {
        id: '2',
        image: 'https://leadslive.io/wp-content/uploads/2017/05/Miniclip-8-Ball-Pool-Avatar-11.png',
    },
    {
        id: '3',
        image: 'https://pickaface.net/gallery/avatar/InspireBuddy5290e4bdc07a4.png',
    },
    {
        id: '4',
        image: 'https://pickaface.net/gallery/avatar/unr_sample_170130_2257_9qgawp.png',
    },
    {
        id: '5',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYy0aPzeWbS_jqj8QHdRvri2F4ZuFsDVTp7Q&usqp=CAU',
    },
    {
        id: '6',
        image: 'https://pickaface.net/gallery/avatar/unr_sample_170124_2254_7ihbitjq.png',
    },
    {
        id: '7',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlWGmABPGYbk2C6We_Ae0lTOj6ccZcX1aabw&usqp=CAU',
    },
    {
        id: '8',
        image: 'https://pickaface.net/gallery/avatar/20151109_144853_2380_sample.png',
    }
];

const renderAvatars = ({item, index}) => {
    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => {
                setModalVisible(false);
                setInfo({
                    fullname: info.fullname,
                    telnum: info.telnum,
                    visible: info.visible,
                    image: item.image,
                    username: info.username
                })
                }
            }>
                <Image key={index} style={{width: 120, height: 120}} source={{uri: item.image}}/>
            </TouchableOpacity>
        </View>
    );
};


    if (!stopTimer)
        setTimeout(() => {
            setInfo({
                fullname: account.fullname,
                telnum: account.telnum,
                visible: account.visible,
                image: account.image,
                username: account.username
            });
            stopTimer = true;
        }, 1000);
    return (
        <View style={{flex: 1}}>
            <View style={{flexDirection: "row"}}>
                <View style={styles.rows}>
                    <View>
                        {info.image ? <Avatar rounded style={{width: 100, height: 100}} source={{uri: info.image}}/> : null}
                        <Button title="View pics" onPress={() => setModalVisible(true)}/>
                    </View>
                    <TextInput style={{fontSize: 30, fontWeight: "bold"}} value={info.fullname} onChangeText={(text) => setInfo({
                        fullname: text,
                        telnum: info.telnum,
                        visible: info.visible,
                        image: info.image,
                        username: info.username
                    })}/>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(false);
                        }}
                    >
                        <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <FlatGrid
                                itemDimension={130}
                                data={avatars}
                                renderItem={(renderAvatars)}
                                style={styles.gridView}
                                keyExtractor={item => item.id}
                            />
                            <Button title="Cancel" onPress={() => setModalVisible(false)}/>
                        </View>
                        </View>
                    </Modal>               
                </View>
            </View>
            <View>
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.textContnet}>Username: </Text>
                        <TextInput style={styles.textContnet} value={info.username} onChangeText={(text) => setInfo({
                            fullname: info.fullname,
                            telnum: info.telnum,
                            visible: info.visible,
                            image: info.image,
                            username: text
                        })}/>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.textContnet}>Tel. number: </Text>
                        <TextInput style={styles.textContnet} value={info.telnum} onChangeText={(text) => setInfo({
                            fullname: info.fullname,
                            telnum: text,
                            visible: info.visible,
                            image: info.image,
                            username: info.username
                        })}/>
                    </View>                    
                </View>
            <View style={{flexDirection: "row"}}>
                <Text style={styles.textContnet}>Visability </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={info.visible ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setInfo({
                        fullname: info.fullname,
                        telnum: info.telnum,
                        visible: !info.visible,
                        image: info.image,
                        username: info.username
                    })}
                    value={info.visible}
                />
            </View>
            <View style={{justifyContent: "center", alignItems: "center"}}>
                <View style={styles.buttons}>
                    <Button style={styles.buttons} title="Save changes" onPress={() => putAccount(info)}/>
                </View>
                <View style={styles.buttons}>
                    <Button style={styles.buttons} title="Log out" onPress={() => logoutUser()}/>
                </View>
            </View>
        </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);