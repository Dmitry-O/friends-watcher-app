import React from 'react';
import {Button, Text, View} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {loginUser, logoutUser} from '../redux/ActionCreators';
import {AsyncStorage} from 'react-native';
import Main from './Main';

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
    loginUser: (creds) => dispatch(loginUser(creds)),
    logoutUser: () => dispatch(logoutUser())
});

const fetchFromStorage = async(isAuthenticated) => {
    try {
        await AsyncStorage.setItem('isAuthenticated', toString(isAuthenticated));
        //console.log("!!!!!!!!!!!!!!!! Is Auth: ", isAuthenticated);
    }
    catch (err) {
        console.log("Errrrooooooooooooor ", err);
    }
}

class SigninForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'admin',
            password: 'adminp',
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
        this.setState({disabledBtn: !this.state.disabledBtn});
        this.props.loginUser({username: this.state.username, password: this.state.password});
        if (this.props.auth.isAuthenticated)
            this.setState({disabledBtn: !this.state.disabledBtn});
        fetchFromStorage(this.props.auth.isAuthenticated);
    }

    handleLogout() {
        this.props.logoutUser();
        //if (!this.props.auth.isAuthenticated)
            //this.setState({showToastSuccess: false});
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.props.auth.isAuthenticated ? <Main/> : 
                <View style={styles.container}>
                    <Text style={{fontSize: 24, fontWeight: "300"}}>
                        Sign in
                    </Text>
                    <TextInput onChangeText={text => this.handleInputChange({username: text, password: this.state.password})} style={styles.input} placeholder="Username"></TextInput>
                    <TextInput onChangeText={text => this.handleInputChange({username: this.state.username, password: text})} style={styles.input} placeholder="Password"></TextInput>
                    <Button disabled={this.state.disabledBtn} title="Sign in" onPress={this.handleLogin}/>
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
        padding: 10
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
        paddingHorizontal: 16
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SigninForm);