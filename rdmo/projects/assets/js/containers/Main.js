import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import * as projectsActions from '../actions/projectsActions'
import * as userActions from '../actions/userActions'
import Projects from '../components/main/Projects'

const Main = ({ projectsActions, projects, userActions, currentUser }) => {
    if (!isEmpty(projects)) {
      return (
      <Projects
        currentUserObject={currentUser}
        projectsActions={projectsActions}
        projectsObject={projects}
        userActions={userActions}
      />)
    }

    return null
}

Main.propTypes = {
  currentUser: PropTypes.object.isRequired,
  projectsActions: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  userActions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    projects: state.projects,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    projectsActions: bindActionCreators(projectsActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
