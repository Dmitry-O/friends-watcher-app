import * as ActionTypes from './ActionTypes';

export const FriendsCoords = (state = {
        isLoading: true, errMess: null, coords: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_FRIENDS_COORDS:
            return {...state, isLoading: false, errMess: null, coords: action.payload};
        case ActionTypes.FRIENDS_COORDS_LOADING:
            return {...state, isLoading: true, errMess: null, coords: []};
        case ActionTypes.FRIENDS_COORDS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, coords: []};
        default: return state;
    }
}