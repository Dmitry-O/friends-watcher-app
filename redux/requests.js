import * as ActionTypes from './ActionTypes';

export const Requests = (state = {
        isLoading: true, errMess: null, requests: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_REQUESTS:
            return {...state, isLoading: false, errMess: null, requests: action.payload};
        case ActionTypes.REQUESTS_LOADING:
            return {...state, isLoading: true, errMess: null, requests: []};
        case ActionTypes.REQUESTS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, requests: []};
        default: return state;
    }
}