
import AccountsApi from '../api/AccountsApi'
import {
  FETCH_CURRENT_USER_ERROR,
  FETCH_CURRENT_USER_INIT,
  FETCH_CURRENT_USER_SUCCESS }
  from './types'


  // export function fetchConfig() {
  //   return (dispatch) => Promise.all([
  //     AccountsApi.fetchCurrentUser()
  //   ]).then(([currentUser]) => dispatch(fetchConfigSuccess({
  //     currentUser
  //   })))
  // }

  // export function fetchConfigSuccess(config) {
  //   return {type: 'config/fetchConfigSuccess', config}
  // }

export function fetchCurrentUser() {
  return function(dispatch) {
    dispatch(fetchCurrentUserInit())
    const action = (dispatch) => AccountsApi.fetchCurrentUser(true)
    // .then(currentUser => currentUser)
          .then(currentUser => {
            dispatch(fetchCurrentUserSuccess({ currentUser }))})

    return dispatch(action)
      .catch(error => dispatch(fetchCurrentUserError(error)))
  }
}

export function fetchCurrentUserInit() {
  return {type: FETCH_CURRENT_USER_INIT}
}

export function fetchCurrentUserSuccess(currentUser) {
  return {type: FETCH_CURRENT_USER_SUCCESS, currentUser}
}

export function fetchCurrentUserError(error) {
  return {type: FETCH_CURRENT_USER_ERROR, error}
}
