import {createStore, combineReducers, applyMiddleware} from 'redux';
//import {createForms} from 'react-redux-form';
import {Friends} from './friends';
import {Auth}  from './auth';
import {Requests} from './requests';
import {Users} from './users';
import {account} from './account';
import {FriendsCoords} from './friendsCoords';

/*
import {wishlist} from './wishlist';
import {rentedTools} from './rentedTools';
import {InitialAccount} from './forms';
*/
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            friends: Friends,
            auth: Auth,
            requests: Requests,
            users: Users,
            account,
            friendsCoords: FriendsCoords
            /*wishlist,
            rentedTools,
            account,
            ...createForms({
                accountForm: InitialAccount
            })*/
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}