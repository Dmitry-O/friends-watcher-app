import React from 'react';
import {Button, ActivityIndicator, Text, View, TouchableOpacity } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {loginUser, logoutUser, signupUser} from '../redux/ActionCreators';
import {AsyncStorage} from 'react-native';
import Main from './Main';
import UserInfoForm from './UserInfoForm';

var signupFlag = false;

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
    loginUser: (creds) => dispatch(loginUser(creds)),
    logoutUser: () => dispatch(logoutUser()),
    signupUser: () => dispatch(signupUser(creds))
});

const isAuthStorage = async(isAuthenticated) => {
    try {
        await AsyncStorage.removeItem('isAuthenticated');
        await AsyncStorage.setItem('isAuthenticated', toString(isAuthenticated));
        console.log('Is Auth: ', isAuthenticated);
        return await AsyncStorage.getItem('isAuthenticated');
    }
    catch (err) {
        console.log("Errrrooooooooooooor ", err);
    }
}

var token = null;
const getToken = async() => {
    try {
        //console.log("token is: ", await AsyncStorage.getItem('token'));
        return await AsyncStorage.getItem('token');
        //console.log("setted token is: ", token, " logic: ", token !== null);
    }
    catch (err) {
        console.log(err);
    }
}

const getSignupFlag = async() => {
    try {
        signupFlag = await AsyncStorage.getItem('signup');
        console.log("-----signupFlag: ", signupFlag);
        return await AsyncStorage.getItem('signup');
    }
    catch (err) {
        console.log(err);
    }
}

var handledLogin = false;

class SigninForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            disabledBtn: false
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        //this.fetchFromStorage = this.fetchFromStorage.bind(this);
    }

    handleInputChange(creds) {
        this.setState({username: creds.username, password: creds.password})
    }

    handleLogin() {
        //this.setState({disabledBtn: !this.state.disabledBtn});
        if (this.state.username !== '' && this.state.password !== '') {
            this.props.loginUser({username: this.state.username, password: this.state.password});
            //this.props.loginUser({username: this.state.username, password: this.state.password});
            getSignupFlag();
            
            setTimeout(() => {
                if (this.props.auth.errMess !== '' && !handledLogin) {
                    this.props.loginUser({username: this.state.username, password: this.state.password});
                    getSignupFlag();
                    handledLogin = true;
                    //console.log("this.props.auth.errMess: ", typeof this.props.auth.errMess);
                }
            }, 5000);
            
            //if (this.props.auth.isAuthenticated) {
                //this.setState({disabledBtn: !this.state.disabledBtn});
                isAuthStorage(this.props.auth.isAuthenticated);
            //}
            if (getSignupFlag === 'true') {
                //console.log("\n\nNeed to sign up first!");
                signupFlag = 'true';
                console.log("signupFlag: ", signupFlag);
            }
            //if (getSignupFlag === 'true')
               // signupFlag = false;
        }
    }

    handleLogout() {
        this.props.logoutUser();
        //if (!this.props.auth.isAuthenticated)
            //this.setState({showToastSuccess: false});
    }

    componentDidMount() {
        //getToken();
    }

    render() {
        setInterval(() => {
            if (signupFlag === 'true')
                getSignupFlag();
        }, 1000);

        return (
            <View style={{flex: 1}}>
                {
                signupFlag === 'true' ? <UserInfoForm creds={{
                    fullname: '',
                    telnum: '',
                    visible: true,
                    image: '',
                    username: this.state.username,
                    password: this.state.password
                }}/>
                 :
                 this.props.auth.isAuthenticated ? <Main/> : 
                <View style={{flex: 1}}>
                    <Header containerStyle={{height: 70, backgroundColor: 'black'}}>
                        <View/>
                        <View>
                            <Text style={{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>
                                Sign in
                            </Text>
                        </View>
                        <Icon 
                            name="sign-in-alt"
                            type="font-awesome-5"
                            color="#fff"
                            style={{marginTop: 10}}
                        />
                    </Header>
                    <View style={styles.container}>
                        <Text style={{fontSize: 25, fontWeight: "bold", color: "white"}}>
                            Sign in
                        </Text>
                        <TextInput
                            onChangeText={text => this.handleInputChange({username: text, password: this.state.password})}
                            style={styles.input}
                            placeholder="Username"
                            placeholderTextColor="#7d7d7d"
                        />
                        <TextInput
                            onChangeText={text => this.handleInputChange({username: this.state.username, password: text})}
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#7d7d7d"
                        />
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={this.handleLogin}
                            style={{backgroundColor: "#ffc400", width: 170, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 5}}
                        >
                            <Text style={{color: "black", fontSize: 20, fontWeight: "bold"}}>Sign in/Sign up</Text>
                        </TouchableOpacity>
                        { this.props.auth.isLoading ?
                            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}> 
                                <ActivityIndicator size="large" color="#0000ff"/>
                                <Text style={{color: "blue", fontSize: 40, fontWeight: "bold"}}>Loading...</Text>            
                            </View>
                            : null
                        }
                    </View>
                </View>
                }
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: "black"
    },
    input: {
        borderWidth: 1,
        borderColor: "#575DD9",
        alignSelf: "stretch",
        margin: 32,
        height: 64,
        borderRadius: 6,
        fontSize: 24,
        fontWeight: "300",
        paddingHorizontal: 16,
        color: "white"
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SigninForm);