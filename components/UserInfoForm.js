import React from 'react';
import { View, Button, Text, Image, Switch, ActivityIndicator, Modal, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Header, Icon } from 'react-native-elements';
import {signupUser} from '../redux/ActionCreators';
import {connect} from 'react-redux';
import Main from './Main';
//import SigninForm from './SigninForm';

//var first = 'https://media.wired.com/photos/5f5fdba8af1c7b1f76a6a86b/master/pass/Culture_Pokemane_vtuber.jpg';
//var second = 'https://dt2sdf0db8zob.cloudfront.net/wp-content/uploads/2019/12/9-Best-Online-Avatars-and-How-to-Make-Your-Own-for-Free-image1-5.png';

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
    //loginUser: (creds) => dispatch(loginUser(creds)),
    signupUser: (creds) => dispatch(signupUser(creds))
});

const UserInfo = ({handleSignup, creds, auth}) => {
    const [userinfo, setUserinfo] = React.useState(creds);
    
    return (
        <View style={{flex: 1}}>
            <View style={styles.container}>
                <Text style={{fontSize: 24, fontWeight: "300"}}>
                    {creds.username} + {creds.password}
                </Text>
                <View style={{flexDirection: "row"}}>
                    <Text>Full name:</Text>
                    <TextInput style={styles.input}
                        value={userinfo.fullname}
                        onChangeText={text => setUserinfo({
                            fullname: text,
                            telnum: userinfo.telnum,
                            visible: userinfo.visible,
                            image: userinfo.image,
                            username: userinfo.username,
                            password: userinfo.password
                        })}
                        placeholder="Full name"
                    />
                </View>
                <View style={{flexDirection: "row"}}>
                    <Text>Tel. number:</Text>
                    <TextInput style={styles.input}
                        value={userinfo.telnum}
                        onChangeText={text => setUserinfo({
                            fullname: userinfo.fullname,
                            telnum: text,
                            visible: userinfo.visible,
                            image: userinfo.image,
                            username: userinfo.username,
                            password: userinfo.password
                        })}
                        placeholder="Telephone number"
                    />
                </View>
                <View style={{flexDirection: "row"}}>
                    <Text>Would you like to be visible to your friends? </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={userinfo.visible ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setUserinfo({
                            fullname: userinfo.fullname,
                            telnum: userinfo.telnum,
                            visible: !userinfo.visible,
                            image: userinfo.image,
                            username: userinfo.username
                        })}
                        value={userinfo.visible}
                    />
                </View>
                <Button title="Sign up" onPress={() => handleSignup(userinfo)}/>
                { auth.isLoading ?
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}> 
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text style={{color: "blue", fontSize: 40, fontWeight: "bold"}}>Loading...</Text>            
                </View>
                : null
                }
            </View>
        </View>
    );
}

const getLoggedout = async() => {
    try {
        return await AsyncStorage.getItem('loggedout');
    }
    catch (err) {
        console.log(err);
    }
}

class UserInfoForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleSignup = this.handleSignup.bind(this);
    }

    handleSignup(creds) {
        console.log("Auth 1: ", this.props.auth.isAuthenticated);
        console.log("Signing up the user with next creds:\n", creds)
        this.props.signupUser(creds);
        console.log("Auth 2: ", this.props.auth.isAuthenticated);
    }

    //<TextInput onChangeText={text => this.handleInputChange({username: text, password: this.state.password})} style={styles.input} placeholder="Username"></TextInput>
    //<TextInput onChangeText={text => this.handleInputChange({username: this.state.username, password: text})} style={styles.input} placeholder="Password"></TextInput>
                    
    render() {
        var creds = this.props.creds;
        return (
            <View style={{flex: 1}}>
                {this.props.auth.isAuthenticated ? <Main/> : 
                    <View>
                        <Header containerStyle={{height: 70, backgroundColor: 'black'}}>
                            <View/>
                            <View>
                                <Text style={{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>
                                    Additional info
                                </Text>
                            </View>
                            <Icon 
                                name="info-circle"
                                type="font-awesome-5"
                                color="#fff"
                                style={{marginTop: 10}}
                            />
                        </Header>
                        <UserInfo handleSignup={this.handleSignup}
                            creds={creds}
                            auth={this.props.auth.isAuthenticated}
                        />
                    </View>
                }
            </View>
        )
    }
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    input: {
        borderWidth: 1,
        borderColor: "#575DD9",
        alignSelf: "stretch",
        margin: 32,
        width: 200,
        height: 40,
        borderRadius: 6,
        fontSize: 24,
        fontWeight: "300",
        paddingHorizontal: 16
    },
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoForm);