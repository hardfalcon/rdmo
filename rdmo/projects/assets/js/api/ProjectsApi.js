import BaseApi from 'rdmo/core/assets/js/api/BaseApi'
import { encodeParams } from 'rdmo/core/assets/js/utils/api'

class ProjectsApi extends BaseApi {

  static fetchProjects(params, fetchParams = {}) {
    return fetch('/api/v1/projects/projects/?' + encodeParams(params), fetchParams).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
  }
}

export default ProjectsApi
