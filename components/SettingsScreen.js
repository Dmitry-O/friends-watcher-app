import React, { Component } from 'react';
import { StyleSheet, Text, View, Switch, Button } from 'react-native';
import { fetchAccount, putAccount, logoutUser } from '../redux/ActionCreators';
import { connect } from 'react-redux';
import { Avatar } from 'react-native-elements';

var stopTimer = false;

const mapStateToProps = state => {
    return {
        account: state.account
    }
};

const mapDispatchToProps = dispatch => ({
    fetchAccount: () => {dispatch(fetchAccount())},
    putAccount: (info) => {dispatch(putAccount(info))},
    logoutUser: () => {dispatch(logoutUser())}
});

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      marginTop: 70
    },
    title: {
        fontSize: 30,
        fontWeight: "bold"
    },
    textContnet: {
        fontSize: 18
    }
});

class SettingsScreen extends Component {
    componentDidMount() {
        this.props.fetchAccount();
    }

    render() {
        var account = this.props.account.account;

        return (
            <View style={styles.centeredView}>
                <Settings account={account}
                    putAccount={this.props.putAccount}
                    logoutUser={this.props.logoutUser}
                />
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
    //console.log(info);
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
                <Avatar style={{width: 100, height: 100}} source={{uri: account.image}}/>
                <View>
                    <Text style={styles.title}>{account.fullname}</Text>
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.textContent}>@{account.username}</Text>
                        <Text style={styles.textContent}>Telephone number: {account.telnum}</Text>
                    </View>
                </View>
            </View>
            <View style={{flexDirection: "row"}}>
                <Text>Visible: </Text>
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
            <Button style={{width: 50}} title="Save changes" onPress={() => putAccount(info)}/>
            <Button title="Log out" onPress={() => logoutUser()}/>
        </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);