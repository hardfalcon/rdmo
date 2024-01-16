
import ProjectsApi from '../api/ProjectsApi'
import { FETCH_PROJECTS_ERROR, FETCH_PROJECTS_INIT, FETCH_PROJECTS_SUCCESS }
         from './types'

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

// export function updateConfig(path, value) {
//   return {type: 'projects/updateConfig', path, value}
// }
