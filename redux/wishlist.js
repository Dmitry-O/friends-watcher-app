import * as ActionTypes from './ActionTypes';

export const wishlist = (state = {
        isLoading: true,
        errMess: null,
        wishlist: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_WISHLIST:
            return {...state, isLoading: false, errMess: null, wishlist: action.payload};

        case ActionTypes.WISHLIST_LOADING:
            return {...state, isLoading: true, errMess: null, wishlist: []};

        case ActionTypes.WISHLIST_FAILED:
            return {...state, isLoading: false, errMess: action.payload, wishlist: []};

        default:
            return state;
    }
}