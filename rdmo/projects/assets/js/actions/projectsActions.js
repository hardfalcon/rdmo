
// import AccountsApi from '../api/AccountsApi';
import ProjectsApi from '../api/ProjectsApi'
import { FETCH_PROJECTS_ERROR, FETCH_PROJECTS_INIT, FETCH_PROJECTS_SUCCESS }
         from './types'
// const MY_PROJECTS = 'projects/myProjects'

// export function fetchAllProjects() {
//   return function(dispatch) {
//     dispatch(fetchProjectsInit())
//     const action = (dispatch) => ProjectsApi.fetchProjects(true)
//           .then(projects => {
//             dispatch(fetchProjectsSuccess({ projects }))})

//     return dispatch(action)
//       .catch(error => dispatch(fetchProjectsError(error)))
//   }
// }

export function fetchAllProjects() {
  return function(dispatch) {
    dispatch(fetchProjectsInit())
    const action = (dispatch) =>
      ProjectsApi.fetchProjects(true)
        .then(projects => {
          const fetchProgressPromises = projects.map(project =>
            ProjectsApi.fetchProgress(project.id)
              .then(progress => ({ ...project, progress: {count: progress.count, total: progress.total} }))
          )

          return Promise.all(fetchProgressPromises)
            .then(updatedProjects => {
              dispatch(fetchProjectsSuccess({ projects: updatedProjects }))
            })
        })

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

// export function fetchProgress(id) {
//   return function(dispatch) {
//     return ProjectsApi.fetchProgress(id)
//       .then(progress => progress.ratio )
//       .catch(error => {
//         // Handle error if needed
//         console.error('Error fetching progress:', error);
//         return null; // Returning null ratio in case of an error
//       });
//   }
// }

// export function fetchCurrentUser() {
//   return function(dispatch) {
//     dispatch(fetchCurrentUserInit())
//     const action = (dispatch) => AccountsApi.fetchCurrentUser(true)
//     // .then(currentUser => currentUser)
//           .then(currentUser => {
//             dispatch(fetchCurrentUserSuccess({ currentUser }))})

//     return dispatch(action)
//       .catch(error => dispatch(fetchCurrentUserError(error)))
//   }
// }

// export function fetchCurrentUserInit() {
//   return {type: FETCH_CURRENT_USER_INIT}
// }

// export function fetchCurrentUserSuccess(currentUser) {
//   return {type: FETCH_CURRENT_USER_SUCCESS, currentUser}
// }

// export function fetchCurrentUserError(error) {
//   return {type: FETCH_CURRENT_USER_ERROR, error}
// }

// export function setViewMyProjects(myProjects) {
//   return {type: MY_PROJECTS, myProjects: myProjects}
// }

export function updateConfig(path, value) {
  return {type: 'config/updateConfig', path, value}
}
