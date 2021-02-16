import * as ActionTypes from './ActionTypes';

export const account = (state = {
        isLoading: true,
        errMess: null,
        account: {}
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_ACCOUNT:
            return {...state, isLoading: false, errMess: null, account: action.payload};

        case ActionTypes.ACCOUNT_LOADING:
            return {...state, isLoading: true, errMess: null, account: {}};

        case ActionTypes.ACCOUNT_FAILED:
            return {...state, isLoading: false, errMess: action.payload, account: {}};

        default:
            return state;
    }
}