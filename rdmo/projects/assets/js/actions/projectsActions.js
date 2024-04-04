import ProjectsApi from '../api/ProjectsApi'
import { FETCH_PROJECTS_ERROR, FETCH_PROJECTS_INIT, FETCH_PROJECTS_SUCCESS,
         FETCH_INVITATIONS_ERROR, FETCH_INVITATIONS_INIT, FETCH_INVITATIONS_SUCCESS,
         UPLOAD_PROJECT_ERROR, UPLOAD_PROJECT_INIT, UPLOAD_PROJECT_SUCCESS }
         from './types'

export function fetchAllProjects() {
  return function(dispatch, getState) {
    const params = getState().config.params
    dispatch(fetchProjectsInit())
    const action = (dispatch) => ProjectsApi.fetchProjects(params || {})
          .then(projects => {
            dispatch(fetchProjectsSuccess({ projects }))})

    return dispatch(action)
      .catch(error => dispatch(fetchProjectsError(error)))
  }
}

export function fetchProjectsInit() {
  return {type: FETCH_PROJECTS_INIT}
}

export function fetchProjectsSuccess(projects) {
  return {type: FETCH_PROJECTS_SUCCESS, projects}
}

export function fetchProjectsError(error) {
  return {type: FETCH_PROJECTS_ERROR, error}
}

export function fetchInvitations(userId) {
  return function(dispatch) {
    dispatch(fetchInvitationsInit())
    const action = (dispatch) => ProjectsApi.fetchInvites(userId)
          .then(invites => {
            dispatch(fetchInvitationsSuccess({ invites }))})

    return dispatch(action)
      .catch(error => dispatch(fetchInvitationsError(error)))
  }
}

export function fetchInvitationsInit() {
  return {type: FETCH_INVITATIONS_INIT}
}

export function fetchInvitationsSuccess(invites) {
  return {type: FETCH_INVITATIONS_SUCCESS, invites}
}

export function fetchInvitationsError(error) {
  return {type: FETCH_INVITATIONS_ERROR, error}
}

export function uploadProject(url, file) {
  return function(dispatch) {
    dispatch(uploadProjectInit())

    return ProjectsApi.uploadProject(url, file)
      .then(project => dispatch(uploadProjectSuccess(project)))
      .catch(error => {
        dispatch(uploadProjectError(error))
      })
  }
}

export function uploadProjectInit() {
  return {type: UPLOAD_PROJECT_INIT}
}

export function uploadProjectSuccess(project) {
  return {type: UPLOAD_PROJECT_SUCCESS, project}
}

export function uploadProjectError(error) {
  return {type: UPLOAD_PROJECT_ERROR, error}
}
