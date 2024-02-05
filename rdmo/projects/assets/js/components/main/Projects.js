import React from 'react'
// import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import Table from '../helper/Table'
import Link from 'rdmo/core/assets/js/components/Link'
import { TextField } from 'rdmo/core/assets/js/components/SearchAndFilter'
import language from 'rdmo/core/assets/js/utils/language'
import siteId from 'rdmo/core/assets/js/utils/siteId'
import { get, isNil } from 'lodash'

const Projects = ({ config, configActions, currentUserObject, projectsObject }) => {
  // const history = useHistory()

  const { projects } = projectsObject
  const { currentUser } = currentUserObject
  const { myProjects } = config

  const displayedRows = get(config, 'table.rows')
  const currentUserId = currentUser.id
  const isManager = (currentUser && currentUser.is_superuser) ||
                    (currentUser.role && currentUser.role.manager && currentUser.role.manager.some(manager => manager.id === siteId))

  const findCurrentUsersProjects = ()  => {
    return projects.filter(project => {
      const propertiesToCheck = ['authors', 'guests', 'managers', 'owners']

      for (let prop of propertiesToCheck) {
        if (project[prop].some(user => user.id === currentUserId)) {
          return true
        }
      }

      return false
    })
  }

  const contentData = (isManager && myProjects)
                    // ? projects.filter((project) => project.owners.some((owner) => owner.id === currentUserId))
                    ? findCurrentUsersProjects()
                    : projects

  const searchString = get(config, 'filter.title', '')
  const updateSearchString = (value) => configActions.updateConfig('filter.title', value)

  const baseUrl = window.location.origin
  const langOptions = language == 'de' ?
  { hour12: false } :
  { hour12: true }

  const viewLinkText = myProjects ? gettext('View all projects') : gettext('View my projects')
  const headline = myProjects ? gettext('My projects') : gettext('All projects')

  const filterByTitleSearch = (projects, searchString) => {
    if (searchString) {
      const lowercaseSearch = searchString.toLowerCase()
      return projects.filter((project) =>
        getTitlePath(project.title, project).toLowerCase().includes(lowercaseSearch)
      )
    } else {
      return projects
    }
  }

  const handleViewClick = () => {
    configActions.updateConfig('myProjects', !myProjects)
  }

  const handleNewClick = () => {
    console.log('New button clicked')
    // http://localhost:8000/projects/create/
    // history.push(`${baseUrl}/projects/create`)
    window.location.href = `${baseUrl}/projects/create`
  }

  const handleImportClick = () => {
    console.log('Import button clicked')
  }

  const dateOptions = {
    ...langOptions,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }

  const getParentPath = (parentId, pathArray = []) => {
    const parent = contentData.find((project) => project.id === parentId)
    if (parent) {
      const { title: parentTitle, parent: grandParentId } = parent
      pathArray.unshift(parentTitle)
      if (!isNil(grandParentId) && typeof grandParentId === 'number') {
        return getParentPath(grandParentId, pathArray)
      }
    }
    return pathArray
  }

  const getTitlePath = (title, row) => {
    let parentPath = ''
    if (row.parent) {
      const path = getParentPath(row.parent)
      parentPath = path.join(' / ')
    }

    const pathArray = parentPath ? [parentPath, title] : [title]
    return pathArray.join(' / ')
  }

  const renderTitle = (title, row) => {
    const pathArray = getTitlePath(title, row).split(' / ')
    const lastChild = pathArray.pop()

    return (
      <a href={`${baseUrl}/projects/${row.id}`}>
        {pathArray.map((path, index) => (
          <span key={index}>{path} / </span>
        ))}
        <b>{lastChild}</b>
      </a>
    )
  }

  const sortableColumns = ['created', 'owner', 'role', 'title', 'updated']

  /* order of elements in 'visibleColumns' corresponds to order of columns in table */
  let visibleColumns = ['title', 'progress', 'updated', 'actions']
  let columnWidths

  if (myProjects) {
    visibleColumns.splice(2, 0, 'role')
    columnWidths = ['25%', '20%', '20%', '20%', '5%']
  } else {
    visibleColumns.splice(2, 0, 'created')
    visibleColumns.splice(2, 0, 'owner')
    columnWidths = ['25%', '10%', '20%', '20%', '20%', '5%']
  }

  const headerFormatters = {
    title: {render: () => gettext('Name')},
    role: {render: () => gettext('Role'), sortRawContent: false},
    owner: {render: () =>  gettext('Owner'), sortRawContent: false} ,
    progress: {render: () => gettext('Progress'), sortRawContent: false},
    created: {render: () => gettext('Created')},
    updated: {render: () => gettext('Last changed')},
    actions: {render: () => null},
  }

  const cellFormatters = {
    title: (content, row) => renderTitle(content, row),
    role: (_content, row) => {
      const arraysToSearch = ['authors', 'guests', 'managers', 'owners']
      let foundInArrays = []
      arraysToSearch.forEach(arrayName => {
        if (row[arrayName].some(item => item.id === currentUserId)) {
          let name = arrayName.charAt(0).toUpperCase() + arrayName.slice(1, -1)
          foundInArrays.push(gettext(name))
        }
      })
      return foundInArrays.length > 0 ? gettext(foundInArrays.join(', ')) : null
    },
    owner: (_content, row) => row.owners.map(owner => `${owner.first_name} ${owner.last_name}`).join('; '),
    progress: (_content, row) => {return `${row.progress_count} ${gettext('of')} ${row.progress_total}`},
    created: content => new Date(content).toLocaleString(language, dateOptions),
    updated: content => new Date(content).toLocaleString(language, dateOptions),
    actions: (_content, row) => {
      const rowUrl = `${baseUrl}/projects/${row.id}`
      const path = `?next=${window.location.pathname}`

      return (
        <div className="icon-container">
          <Link
            href={`${rowUrl}/update`}
            className="element-link fa fa-pencil"
            title={row.title}
            onClick={() => window.location.href = `${rowUrl}/update/${path}`}
          />
          <Link
            href={`${rowUrl}/delete`}
            className="element-link fa fa-trash"
            title={row.title}
            onClick={() => window.location.href = `${rowUrl}/delete/${path}`}
          />
        </div>
      )
    }
  }

  const filteredProjects = filterByTitleSearch(contentData, searchString)

  return (
    <>
      <div className="mb-10" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="ml-10 mt-0">{headline}</h2>
        <div className="icon-container ml-auto">
          <button className="element-button mr-10" onClick={handleNewClick}>
            {gettext('New project')}
          </button>
          <button className="element-button" onClick={handleImportClick}>
            {gettext('Import project')}
          </button>
        </div>
      </div>
      {/* {isManager &&
      <div className="mb-10">
        <Link className="element-link mb-20" onClick={handleViewClick}>
            {viewLinkText}
        </Link>
      </div>
      } */}
      <span>{displayedRows>filteredProjects.length ? filteredProjects.length : displayedRows} {gettext('of')} {filteredProjects.length} {gettext('projects are displayed')}</span>
      {/* <div className="input-group mb-20"></div> */}
      <div className="panel-body">
        <div className="row">
          <TextField value={searchString} onChange={updateSearchString}
                        placeholder={gettext('Search projects')} />
        </div>

      </div>
      {/* <div className="input-group mb-20">
        <input
          type="text"
          className="form-control"
          placeholder={gettext('Search projects')}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <span className="input-group-btn">
          <button className="btn btn-default" onClick={() => setSearchString('')}>
            <span className="fa fa-times"></span>
          </button>
        </span>
      </div> */}
      {isManager &&
      <div className="mb-10">
        <Link className="element-link mb-20" onClick={handleViewClick}>
            {viewLinkText}
        </Link>
      </div>
      }
      <Table
        cellFormatters={cellFormatters}
        columnWidths={columnWidths}
        data={filteredProjects}
        headerFormatters={headerFormatters}
        sortableColumns={sortableColumns}
        visibleColumns={visibleColumns}
        configActions={configActions}
        config={config}
      />
    </>
  )
}

Projects.propTypes = {
  config: PropTypes.object.isRequired,
  configActions: PropTypes.object.isRequired,
  currentUserObject: PropTypes.object.isRequired,
  // projectsActions: PropTypes.object.isRequired,
  projectsObject: PropTypes.object.isRequired,
  // userActions: PropTypes.object.isRequired,
}

export default Projects
