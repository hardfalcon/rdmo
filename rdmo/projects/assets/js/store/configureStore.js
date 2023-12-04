import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers/rootReducer'
import * as userActions from '../actions/userActions'
import * as projectsActions from '../actions/projectsActions'

export default function configureStore() {
  const middlewares = [thunk]

  if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger')
    middlewares.push(logger)
  }

  const store = createStore(
    rootReducer,
    applyMiddleware(...middlewares)
  )

  window.addEventListener('load', () => {
    console.log('event listener')
    store.dispatch(userActions.fetchCurrentUser())
    store.dispatch(projectsActions.fetchAllProjects())
    store.dispatch(projectsActions.setViewMyProjects(false))
  })

  return store
}
