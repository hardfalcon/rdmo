import { combineReducers } from 'redux'
import projectsReducer from './projectsReducer'
import userReducer from './userReducer'
// import menubarReducer from './menubarReducer'

const rootReducer = combineReducers({
  currentUser: userReducer,
  projects: projectsReducer,
  // headline: menubarReducer,
})

export default rootReducer
