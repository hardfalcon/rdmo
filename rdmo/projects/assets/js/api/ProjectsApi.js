import BaseApi from 'rdmo/core/assets/js/api/BaseApi'

class ProjectsApi extends BaseApi {

  static fetchProjects() {
    return this.get('/api/v1/projects/projects/')
  }

  static fetchProgress(id) {
    return this.get(`/api/v1/projects/projects/${id}/progress/`)
  }

}

export default ProjectsApi
