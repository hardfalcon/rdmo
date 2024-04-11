import { FETCH_PROJECTS_ERROR, FETCH_PROJECTS_INIT, FETCH_PROJECTS_SUCCESS,
         FETCH_INVITATIONS_ERROR, FETCH_INVITATIONS_INIT, FETCH_INVITATIONS_SUCCESS,
         FETCH_CATALOGS_ERROR, FETCH_CATALOGS_INIT, FETCH_CATALOGS_SUCCESS
        } from '../actions/types'

const initialState = {
  projects: []
}

export default function projectsReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_PROJECTS_INIT:
      return {...state, ...action.projects}
    case FETCH_PROJECTS_SUCCESS:
      return {...state, ...action.projects}
    case FETCH_PROJECTS_ERROR:
      return {...state, errors: action.error.errors}
    case FETCH_INVITATIONS_INIT:
      return {...state, ...action.invites}
    case FETCH_INVITATIONS_SUCCESS:
      return {...state, ...action.invites}
    case FETCH_INVITATIONS_ERROR:
      return {...state, errors: action.error.errors}
    case FETCH_CATALOGS_INIT:
      return {...state, ...action.catalogs}
    case FETCH_CATALOGS_SUCCESS:
      return {...state, ...action.catalogs}
    case FETCH_CATALOGS_ERROR:
      return {...state, errors: action.error.errors}
    default:
       return state
  }
}
