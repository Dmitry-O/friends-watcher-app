import * as ActionTypes from './ActionTypes';
import {AsyncStorage} from 'react-native';

const load = async () => {
    try {
        return {token: await AsyncStorage.getItem('token'), creds: await AsyncStorage.getItem('creds')};
    }
    catch (err) {
        console.log(err);
    }
}

export const Auth = (state = {
        isLoading: false,
        isAuthenticated: load.token ? true : false,
        token: load.token,
        user: load.creds ? JSON.parse(load.creds) : null,
        errMess: null
    }, action) => {

    switch (action.type) {
        case ActionTypes.LOGIN_REQUEST:
            return {...state,
                isLoading: true,
                isAuthenticated: false,
                user: action.creds
            };
        case ActionTypes.LOGIN_SUCCESS:
            return {...state,
                isLoading: false,
                isAuthenticated: true,
                errMess: '',
                token: action.token
            };
        case ActionTypes.LOGIN_FAILURE:
            return {...state,
                isLoading: false,
                isAuthenticated: false,
                errMess: action.message
            };
        case ActionTypes.LOGOUT_REQUEST:
            return {...state,
                isLoading: true,
                isAuthenticated: true
            };
        case ActionTypes.LOGOUT_SUCCESS:
            return {...state,
                isLoading: false,
                isAuthenticated: false,
                token: '',
                user: null
            };
        default:
            return state
    }
}