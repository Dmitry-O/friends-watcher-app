import * as ActionTypes from './ActionTypes';

export const rentedTools = (state = {
        isLoading: true,
        errMess: null,
        rentedTools: null
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_RENTEDTOOLS:
            return {...state, isLoading: false, errMess: null, rentedTools: action.payload};

        case ActionTypes.RENTEDTOOLS_LOADING:
            return {...state, isLoading: true, errMess: null, rentedTools: null};

        case ActionTypes.RENTEDTOOLS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, rentedTools: null};

        default:
            return state;
    }
}