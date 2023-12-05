import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import Cookies from 'js-cookie'
import isEmpty from 'lodash/isEmpty'
import rootReducer from '../reducers/rootReducer'
import * as userActions from '../actions/userActions'
import * as projectsActions from '../actions/projectsActions'

export default function configureStore() {
  const middlewares = [thunk]

  const currentStoreId = Cookies.get('storeid')
  const localStoreId = localStorage.getItem('rdmo.storeid')

  if (isEmpty(localStoreId) || localStoreId !== currentStoreId) {
    localStorage.clear()
    localStorage.setItem('rdmo.storeid', currentStoreId)
  }

  if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger')
    middlewares.push(logger)
  }

  const store = createStore(
    rootReducer,
    applyMiddleware(...middlewares)
  )

    // load: restore the config from the local storage
    const updateConfigFromLocalStorage = () => {
      const ls = {...localStorage}

      Object.entries(ls).forEach(([lsPath, lsValue]) => {
        if (lsPath.startsWith('rdmo.projects.config.')) {
          const path = lsPath.replace('rdmo.projects.config.', '')
          let value
          switch(lsValue) {
            case 'true':
              value = true
              break
            case 'false':
              value = false
              break
            default:
              value = lsValue
          }
          store.dispatch(projectsActions.updateConfig(path, value))
        }
      })
    }

  window.addEventListener('load', () => {
    console.log('event listener')
    updateConfigFromLocalStorage()
    store.dispatch(userActions.fetchCurrentUser())
    store.dispatch(projectsActions.fetchAllProjects())
    // store.dispatch(projectsActions.setViewMyProjects(false))
  })

  return store
}
