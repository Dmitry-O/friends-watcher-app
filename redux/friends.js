import * as ActionTypes from './ActionTypes';

export const Friends = (state = {
        isLoading: true, errMess: null, friends: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_FRIENDS:
            return {...state, isLoading: false, errMess: null, friends: action.payload};
        case ActionTypes.FRIENDS_LOADING:
            return {...state, isLoading: true, errMess: null, friends: []};
        case ActionTypes.FRIENDS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, friends: []};
        default: return state;
    }
}