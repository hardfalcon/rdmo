import set from 'lodash/set'
import { FETCH_PROJECTS_ERROR, FETCH_PROJECTS_INIT, FETCH_PROJECTS_SUCCESS } from '../actions/types'

const MY_PROJECTS = 'projects/myProjects'

const initialState = {
  projects: [],
  myProjects: true,
}

export default function projectsReducer(state = initialState, action) {
  let newState
  switch(action.type) {
    // fetch elements
    case FETCH_PROJECTS_INIT:
      return {...state, ...action.projects}
    case FETCH_PROJECTS_SUCCESS:
      return {...state, ...action.projects}
    case FETCH_PROJECTS_ERROR:
      return {...state, errors: action.error.errors}
    case MY_PROJECTS:
      return {...state, myProjects: action.myProjects}
    case 'projects/updateConfig':
        newState = {...state}

        set(newState, action.path, action.value)
        localStorage.setItem(`rdmo.projects.config.${action.path}`, action.value)

        return newState
    default:
       return state
  }
}
