import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Table from 'rdmo/core/assets/js/components/Table'
import Link from 'rdmo/core/assets/js/components/Link'
import language from 'rdmo/core/assets/js/utils/language'

const Projects = ({ currentUserObject, projectsObject }) => {
  const { projects } = projectsObject
  const { currentUser } = currentUserObject
  // const newHeadline = () => projectsActions.setProjectsHeadline('All projects');
  // projectsActions.setProjectsHeadline('All projects');
  // console.log(newHeadline);

  // const admin = {
  //   "id": 1,
  //   "groups": [],
  //   "role": {
  //     "id": 1,
  //     "member": [
  //       {
  //         "id": 1,
  //         "name": "example.com",
  //         "domain": "example.com"
  //       }
  //     ],
  //     "manager": [],
  //     "editor": [],
  //     "reviewer": []
  //   },
  //   "memberships": [],
  //   "is_superuser": true,
  //   "is_staff": true,
  //   "username": "admin",
  //   "first_name": "Anna",
  //   "last_name": "Admin",
  //   "email": "admin@example.com",
  //   "last_login": "2023-11-30T16:03:30.093385+01:00",
  //   "date_joined": "2016-12-16T16:52:16+01:00"
  // }

  // const guest = {
  //   "id": 8,
  //   "groups": [],
  //   "role": {
  //     "id": 8,
  //     "member": [
  //       {
  //         "id": 1,
  //         "name": "example.com",
  //         "domain": "example.com"
  //       }
  //     ],
  //     "manager": [],
  //     "editor": [],
  //     "reviewer": []
  //   },
  //   "memberships": [
  //     {
  //       "id": 11,
  //       "project": 3,
  //       "role": "guest"
  //     },
  //     {
  //       "id": 14,
  //       "project": 9,
  //       "role": "guest"
  //     },
  //     {
  //       "id": 4,
  //       "project": 1,
  //       "role": "guest"
  //     }
  //   ],
  //   "is_superuser": false,
  //   "is_staff": false,
  //   "username": "guest",
  //   "first_name": "Garry",
  //   "last_name": "Guest",
  //   "email": "guest@example.com",
  //   "last_login": "2023-11-30T19:36:36.129375+01:00",
  //   "date_joined": "2017-03-01T14:33:48+01:00"
  // };

  // const currentUser = admin;

  console.log('currentUser %o', currentUser)
  const [viewMyProjects, setViewMyProjects] = useState(true)
  const [searchString, setSearchString] = useState('')
  const currentUserId = currentUser.id
  const baseUrl = window.location.origin
  const langOptions = language == 'de' ?
  { hour12: false } :
  { hour12: true }

  const viewLinkText = viewMyProjects ? gettext('View all projects') : gettext('View my projects')
  const headline = viewMyProjects ? gettext('My projects') : gettext('All projects')

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
    if (currentUser.is_superuser && viewMyProjects) {
      return projects.filter((project) =>
      project.owners.some((owner) => owner.id === id))
    } else {
      return projects
    }
  }

  const contentData = filterByOwner(projects, currentUserId)

  const handleViewClick = () => {
    setViewMyProjects((prevState) => !prevState)
  }

  const handleNewClick = () => {
    // Logic for handling 'New' button click
    console.log('New button clicked')
  }

  const handleImportClick = () => {
    // Logic for handling 'Import' button click
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

  const visibleColumns = ['title', 'role', 'progress', 'created', 'updated', 'actions']

  const headerFormatters = {
    title: () => gettext('Name'),
    role: () => gettext('Role'),
    progress: () => gettext('Progress'),
    created: () => gettext('Created'),
    updated: () => gettext('Last changed'),
    actions: () => null,
  }

  const cellFormatters = {
    title: (content, row) => {
      return <a href={`${baseUrl}/projects/${row.id}`}><b>{content}</b></a>
    },
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
    progress: (_content, row) => `${Math.round(row.progress * 100)} %`,
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

  // Filter projects based on the search string
  // const filteredProjects = searchString
  //   ? projects.filter((project) =>
  //       project.title.toLowerCase().includes(searchString.toLowerCase())
  //     )
  //   : projects;
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
        {/* <div className="form-group mb-0">
      <div className="input-group">
        <input type="text" className="form-control" placeholder={placeholder}
               value={ value } onChange={e => onChange(e.target.value)}></input>
        <span className="input-group-btn">
          <button className="btn btn-default" onClick={() => onChange('')}>
            <span className="fa fa-times"></span>
          </button>
        </span>
      </div>
    </div> */}
      {/* <div className="form-group mb-20"> */}
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
      {/* </div> */}
      {currentUser.is_superuser &&
      <Link className="element-link" onClick={handleViewClick}>
          {viewLinkText}
      </Link>
      }
      <Table
        cellFormatters={cellFormatters}
        data={filteredProjects}
        headerFormatters={headerFormatters}
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
