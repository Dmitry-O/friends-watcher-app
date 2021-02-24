import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../shared/baseUrl';
import {AsyncStorage} from 'react-native';
import React from 'react';

var token = 'null';

const loadToken = async() => {
    try {
        token = await AsyncStorage.getItem('token');
        await AsyncStorage.setItem('signup', 'false');
        console.log("Siign uuuup: ", await AsyncStorage.getItem('signup'));
        console.log("Tooookeeeen: ", token);
    }
    catch (err) {
        console.log("Error loadToken(): ", err);
    }
}

loadToken();


export const deleteFriend = (friendId) => (dispatch) => {
    const bearer = 'Bearer ' + token;

    return fetch(baseUrl + 'friends/' + friendId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(friends => { 
        console.log('Friend deleted: ', req);
        dispatch(addFriends(friends)); 
    })
    .catch(error => dispatch(friendsFailed(error.message)));
}

export const fetchFriends = () => (dispatch) => {
    //console.log("2222222 Toooken: ", token);
    dispatch(friendsLoading(true));
    const bearer = 'Bearer ' + token;

    return fetch(baseUrl + 'friends', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.ok)
                return response;
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(friends => dispatch(addFriends(friends)))
        .catch(error => dispatch(friendsFailed(error.message)));
}

export const friendsLoading = () => ({
    type: ActionTypes.FRIENDS_LOADING
});

export const friendsFailed = (errmess) => ({
    type: ActionTypes.FRIENDS_FAILED,
    payload: errmess
});

export const addFriends = (friends) => ({
    type: ActionTypes.ADD_FRIENDS,
    payload: friends
});


export const fetchRequests = () => (dispatch) => {
    //console.log("2222222 Toooken: ", token);
    dispatch(requestsLoading(true));
    const bearer = 'Bearer ' + token;

    return fetch(baseUrl + 'requests', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.ok)
                return response;
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(requests => dispatch(addRequests(requests)))
        .catch(error => dispatch(requestsFailed(error.message)));
}

export const requestsLoading = () => ({
    type: ActionTypes.REQUESTS_LOADING
});

export const requestsFailed = (errmess) => ({
    type: ActionTypes.REQUESTS_FAILED,
    payload: errmess
});

export const addRequests = (requests) => ({
    type: ActionTypes.ADD_REQUESTS,
    payload: requests
});

export const postRequests = (requestId) => (dispatch) => {
    const bearer = 'Bearer ' + token;

    return fetch(baseUrl + 'requests/' + requestId, {
        method: "POST",
        //body: JSON.stringify({"_id": requestId}),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(requests => { 
        console.log('Request Added', req);
        dispatch(addRequests(requests)); 
    })
    .catch(error => dispatch(requestsFailed(error.message)));
}

export const postCoords = (coords) => (dispatch) => {
    const bearer = 'Bearer ' + token;
    //console.log(coords);
    return fetch(baseUrl + 'users/coords', {
        method: "POST",
        body: JSON.stringify(coords),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .catch(error => dispatch(usersFailed(error.message)));
}

export const fetchAccount = () => (dispatch) => {
    dispatch(accountLoading(true));
    const bearer = 'Bearer ' + token;

    return fetch(baseUrl + 'users/account', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.ok)
                return response;
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(account => dispatch(addAccount(account)))
        .catch(error => dispatch(accountFailed(error.message)));
}

export const accountLoading = () => ({
    type: ActionTypes.ACCOUNT_LOADING
});

export const accountFailed = (errmess) => ({
    type: ActionTypes.ACCOUNT_FAILED,
    payload: errmess
});

export const addAccount = (account) => ({
    type: ActionTypes.ADD_ACCOUNT,
    payload: account
});

export const putAccount = (info) => (dispatch) => {
    const bearer = 'Bearer ' + token;

    console.log("!!!!!!!!!!put account info:\n", info);

    return fetch(baseUrl + 'users/account', {
        method: "PUT",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(info => { console.log('Account info changed!\n', info); dispatch(addAccount(info)); })
    .catch(error => dispatch(accountFailed(error.message)));
}



export const fetchUsers = () => (dispatch) => {
    dispatch(usersLoading(true));
    const bearer = 'Bearer ' + token;

    return fetch(baseUrl + 'users/basic', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.ok)
                return response;
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(users => dispatch(addUsers(users)))
        .catch(error => dispatch(usersFailed(error.message)));
}

export const usersLoading = () => ({
    type: ActionTypes.USERS_LOADING
});

export const usersFailed = (errmess) => ({
    type: ActionTypes.USERS_FAILED,
    payload: errmess
});

export const addUsers = (users) => ({
    type: ActionTypes.ADD_USERS,
    payload: users
});



const save = async({token, creds}) => {
    try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('creds', creds);
        await AsyncStorage.removeItem('loggedout');
    }
    catch (err) {
        console.log(err);
    }
}

const setSignFlag = async(flag) => {
    try {
        //await AsyncStorage.removeItem('signup');
        await AsyncStorage.setItem('signup', flag);
        console.log("Flag set: ", await AsyncStorage.getItem('signup'));
    }
    catch (err) {
        console.log(err);
    }
}

const remove = async() => {
    try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('creds');
        await AsyncStorage.removeItem('signup');
        await AsyncStorage.removeItem('isAuthenticated');
        await AsyncStorage.setItem('loggedout', 'true');
    }
    catch (err) {
        console.log(err);
    }
}

export const requestLogin = (creds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    }
}
  
export const receiveLogin = (response) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.token
    }
}
  
export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
}

export const loginUser = (creds) => (dispatch) => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds));

    return fetch(baseUrl + 'users/login', {
        method: 'POST',
        headers: { 
            'Content-Type':'application/json' 
        },
        body: JSON.stringify(creds)
    })
    .then(response => {
        if (response.ok) {
            //console.log('Suuuuuuussssceees');
            //setSignFlag('false');
            return response;
        } else {
            //setSignFlag('true');
            if (response.status === 401) {
                return response;
            }
                
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        }
        },
        error => {
            throw error;
        })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            setSignFlag('false');
            remove();
            save({token: response.token, creds: JSON.stringify(creds)});
            // If login was successful, set the token in local storage
            //localStorage.setItem('token', response.token);
            //localStorage.setItem('creds', JSON.stringify(creds));
            // Dispatch the success action
            //dispatch(fetchFavorites());
            dispatch(receiveLogin(response));
            console.log(receiveLogin(response).token);
        }
        else {
            if (response.err.name === 'IncorrectUsernameError') {
                setSignFlag('true');
                //console.log("---Yes, this is this problem");
            }
            var error = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => dispatch(loginError(error.message)))
};

export const signupUser = (creds) => (dispatch) => {
    return fetch(baseUrl + 'users/signup', {
        method: 'POST',
        headers: { 
            'Content-Type':'application/json' 
        },
        body: JSON.stringify(creds)
    })
    .then(response => {
        if (response.ok) {
            dispatch(loginUser(creds))
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => { throw error; }
    )
    .catch(error => dispatch(loginError(error.message)))
}

export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
}
  
export const receiveLogout = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
}

// Logs the user out
export const logoutUser = () => (dispatch) => {
    remove();
    dispatch(requestLogout());
    //localStorage.removeItem('token');
    //localStorage.removeItem('creds');
    //dispatch(favoritesFailed("Error 401: Unauthorized"));
    dispatch(receiveLogout())
}



/*
export const postWishlist = (toolId) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'wishlist/' + toolId, {
        method: "POST",
        body: JSON.stringify({"_id": toolId}),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(wishlist => { console.log('Wishlist Added', wishlist); dispatch(addWishlist(wishlist)); })
    .catch(error => dispatch(wishlistFailed(error.message)));
}

export const deleteWishlist = (toolId) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'wishlist/' + toolId, {
        method: "DELETE",
        headers: {
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(wishlist => { console.log('Wishlist Deleted', wishlist); dispatch(addWishlist(wishlist)); })
    .catch(error => dispatch(wishlistFailed(error.message)));
};

export const fetchWishlist = () => (dispatch) => {
    dispatch(wishlistLoading(true));

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'wishlist', {
        headers: {
            'Authorization': bearer
        },
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(wishlist => dispatch(addWishlist(wishlist)))
    .catch(error => dispatch(wishlistFailed(error.message)));
}

export const wishlistLoading = () => ({
    type: ActionTypes.WISHLIST_LOADING
});

export const wishlistFailed = (errmess) => ({
    type: ActionTypes.WISHLIST_FAILED,
    payload: errmess
});

export const addWishlist = (wishlist) => ({
    type: ActionTypes.ADD_WISHLIST,
    payload: wishlist
});


export const postRentedTools = (rentedTool) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'rentedTools', {
        method: "POST",
        body: JSON.stringify(rentedTool),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(rentedTools => { console.log('RentedTools Added', rentedTools); dispatch(addRentedTools(rentedTools)); })
    .catch(error => dispatch(rentedToolsFailed(error.message)));
}

export const fetchRentedTools = () => (dispatch) => {
    dispatch(rentedToolsLoading(true));

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'rentedTools', {
        headers: {
            'Authorization': bearer
        },
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(rentedTools => dispatch(addRentedTools(rentedTools)))
    .catch(error => dispatch(rentedToolsFailed(error.message)));
}

export const rentedToolsLoading = () => ({
    type: ActionTypes.RENTEDTOOLS_LOADING
});

export const rentedToolsFailed = (errmess) => ({
    type: ActionTypes.RENTEDTOOLS_FAILED,
    payload: errmess
});

export const addRentedTools = (rentedTools) => ({
    type: ActionTypes.ADD_RENTEDTOOLS,
    payload: rentedTools
});

export const putAccount = (info) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'users/account', {
        method: "PUT",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(info => { console.log('Account info Changed!', info); dispatch(addAccount(info)); })
    .catch(error => dispatch(accountFailed(error.message)));
}

export const fetchAccount = () => (dispatch) => {
    dispatch(accountLoading(true));

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'users/account', {
        headers: {
            'Authorization': bearer
        },
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => response.json())
    .then(account => dispatch(addAccount(account)))
    .catch(error => dispatch(accountFailed(error.message)));
}

export const returnAccount = () => (dispatch) => {
    //dispatch(accountLoading(true));

    const bearer = 'Bearer ' + localStorage.getItem('token');

    var resp; 

    fetch(baseUrl + 'users/account', {
        headers: {
            'Authorization': bearer
        },
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => { 
        response.json();
        resp = response.json();  
    })
    .catch(err => console.log("Error! " + err));

    return resp;
}

export const accountLoading = () => ({
    type: ActionTypes.ACCOUNT_LOADING
});

export const accountFailed = (errmess) => ({
    type: ActionTypes.ACCOUNT_FAILED,
    payload: errmess
});

export const addAccount = (account) => ({
    type: ActionTypes.ADD_ACCOUNT,
    payload: account
});*/