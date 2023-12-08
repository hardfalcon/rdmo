import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Table from 'rdmo/core/assets/js/components/Table'
import Link from 'rdmo/core/assets/js/components/Link'
import language from 'rdmo/core/assets/js/utils/language'
import siteId from 'rdmo/core/assets/js/utils/siteId'
import { isNil } from 'lodash'

const Projects = ({ currentUserObject, projectsObject, projectsActions }) => {
  const { myProjects, projects } = projectsObject
  const { currentUser } = currentUserObject

  const isManager = (currentUser && currentUser.is_superuser) ||
                    (currentUser.role && currentUser.role.manager && currentUser.role.manager.some(manager => manager.id === siteId))

  const [searchString, setSearchString] = useState('')
  const currentUserId = currentUser.id
  const baseUrl = window.location.origin
  const langOptions = language == 'de' ?
  { hour12: false } :
  { hour12: true }

  const viewLinkText = myProjects ? gettext('View all projects') : gettext('View my projects')
  const headline = myProjects ? gettext('My projects') : gettext('All projects')

  const filterBySearch = (projects, searchString) => {
    if (searchString) {
      const lowercaseSearch = searchString.toLowerCase()
      return projects.filter((project) =>
        project.title.toLowerCase().includes(lowercaseSearch)
      )
    } else {
      return projects
    }
  }

  const filterByOwner = (projects, id) => {
    if (isManager && myProjects) {
      return projects.filter((project) =>
      project.owners.some((owner) => owner.id === id))
    } else {
      return projects
    }
  }

  const contentData = filterByOwner(projects, currentUserId)

  const handleViewClick = () => {
    projectsActions.updateConfig('myProjects', !myProjects)
  }

  const handleNewClick = () => {
    console.log('New button clicked')
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

  const renderTitle = (title, row) => {
    const getParentPath = (parentId, pathArray = []) => {
      const parent = projects.find(project => project.id === parentId)
      if (parent) {
        const { title: parentTitle, parent: grandParentId } = parent
        pathArray.unshift(parentTitle)
        // if (grandParentId !== null && grandParentId !== undefined && typeof grandParentId === 'number') {
        if (!isNil(grandParentId) && typeof grandParentId === 'number') {
          return getParentPath(grandParentId, pathArray)
        }
      }
      return pathArray
    }

    let parentPath = ''
    if (row.parent) {
      const path = getParentPath(row.parent)
      parentPath = path.join(' / ')
    }

    const pathArray = parentPath ? [parentPath, title] : [title]
    const pathLength = pathArray.length

    return (
      <a href={`${baseUrl}/projects/${row.id}`}>
        {pathArray.map((path, index) => {
          const isLastChild = index === pathLength - 1
          return (
            <span key={index}>
              {isLastChild ? <b>{path}</b> : path}
              {index !== pathLength - 1 && ' / '}
            </span>
          )
        })}
      </a>
    )
  }

  const sortableColumns = ['created', 'owner', 'role', 'title', 'updated']

  /* order of elements in 'visibleColumns' corresponds to order of columns in table */
  let visibleColumns = ['title', 'progress', 'updated', 'actions']

  if (myProjects) {
    visibleColumns.splice(2, 0, 'role')
  } else {
    visibleColumns.splice(2, 0, 'created')
    visibleColumns.splice(2, 0, 'owner')
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
    owner: (_content, row) => row.owners.map(owner => `${owner.username}`).join('; '),
    progress: (content) => {return `${content.count} ${gettext('of')} ${content.total}`},
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

  const filteredProjects = filterBySearch(contentData, searchString)

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
      <div className="input-group mb-20">
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
      </div>
      {isManager &&
      <Link className="element-link" onClick={handleViewClick}>
          {viewLinkText}
      </Link>
      }
      <Table
        cellFormatters={cellFormatters}
        data={filteredProjects}
        headerFormatters={headerFormatters}
        sortableColumns={sortableColumns}
        visibleColumns={visibleColumns}
      />
    </>
  )
}

Projects.propTypes = {
  currentUserObject: PropTypes.object.isRequired,
  projectsActions: PropTypes.object.isRequired,
  projectsObject: PropTypes.object.isRequired,
  userActions: PropTypes.object.isRequired,
}

export default Projects
