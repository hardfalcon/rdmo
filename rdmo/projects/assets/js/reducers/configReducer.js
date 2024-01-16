import set from 'lodash/set'
import { UPDATE_CONFIG } from '../actions/types'

const initialState = {
  filter: {},
  myProjects: true,
  table: {}
}

export default function configReducer(state = initialState, action) {
  let newState
  switch(action.type) {
    case UPDATE_CONFIG:
        newState = {...state}

        set(newState, action.path, action.value)
        localStorage.setItem(`rdmo.projects.config.${action.path}`, action.value)

        return newState
    default:
       return state
  }
}
