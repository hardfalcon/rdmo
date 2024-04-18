import React from 'react'
import PropTypes from 'prop-types'
import { PendingInvitations, ProjectFilters, Table } from '../helper'
import { FileUploadButton, Link, Modal, SearchField } from 'rdmo/core/assets/js/components'
import { useFormattedDateTime, useModal, useScrollToTop }  from 'rdmo/core/assets/js/hooks'
import useDatePicker from '../../hooks/useDatePicker'
import { language } from 'rdmo/core/assets/js/utils'
import { getTitlePath, getUserRoles, userIsManager, HEADER_FORMATTERS, SORTABLE_COLUMNS } from '../../utils'
import { get, isEmpty } from 'lodash'

const Projects = ({ config, configActions, currentUserObject, projectsActions, projectsObject }) => {
  const { allowedTypes, catalogs, invites, projects } = projectsObject
  const { currentUser } = currentUserObject
  const { myProjects } = config

  const { showTopButton, scrollToTop } = useScrollToTop()
  const { show, open, close } = useModal()
  const modalProps = {title: gettext('Pending invitations'), show: show, onClose: close }

  const { setStartDate, setEndDate } = useDatePicker()

  const baseUrl = window.location.origin
  const displayedRows = get(config, 'tableRows', '')

  const currentUserId = currentUser.id
  const isManager = userIsManager(currentUser)

  const showFilters = get(config, 'showFilters', false)
  const toggleFilters = () => configActions.updateConfig('showFilters', !showFilters)

  const searchString = get(config, 'params.search', '')
  const updateSearchString = (value) => {
    value ? configActions.updateConfig('params.search', value) : configActions.deleteConfig('params.search')
  }

  const viewLinkText = myProjects ? gettext('View all projects') : gettext('View my projects')
  const headline = myProjects ? gettext('My projects') : gettext('All projects')

  const handleView = () => {
    configActions.updateConfig('myProjects', !myProjects)
    myProjects ? configActions.deleteConfig('params.user') : configActions.updateConfig('params.user', currentUserId)
    projectsActions.fetchAllProjects()
  }

  const handleNew = () => {
    window.location.href = `${baseUrl}/projects/create`
  }

  const handleImport = (file) => { projectsActions.uploadProject('/projects/import/', file) }

  const renderTitle = (title, row) => {
    const pathArray = getTitlePath(projects, title, row).split(' / ')
    const lastChild = pathArray.pop()

    const catalog = catalogs.find(c => c.id === row.catalog)

    return (
      <div>
        <a href={`${baseUrl}/projects/${row.id}`}>
          {pathArray.map((path, index) => (
            <span key={index}>{path} / </span>
          ))}
          <b>{lastChild}</b>
        </a>
        <div className='mid-grey'>{catalog ? catalog.title : null}</div>
      </div>
    )
  }

  const resetAllFilters = () => {
    configActions.deleteConfig('params.catalog')
    configActions.deleteConfig('params.created_after')
    setStartDate('created', null)
    configActions.deleteConfig('params.created_before')
    setEndDate('created', null)
    configActions.deleteConfig('params.updated_after')
    setStartDate('updated', null)
    configActions.deleteConfig('params.updated_before')
    setEndDate('updated', null)
    projectsActions.fetchAllProjects()
  }

  /* order of elements in 'visibleColumns' corresponds to order of columns in table */
  let visibleColumns = ['title', 'progress', 'updated', 'actions']
  let columnWidths

  if (myProjects) {
    visibleColumns.splice(2, 0, 'role')
    columnWidths = ['35%', '20%', '20%', '20%', '5%']
  } else {
    visibleColumns.splice(2, 0, 'created')
    visibleColumns.splice(2, 0, 'owner')
    columnWidths = ['35%', '10%', '20%', '20%', '20%', '5%']
  }

  const cellFormatters = {
    title: (content, row) => renderTitle(content, row),
    role: (_content, row) => {
      const { rolesString } = getUserRoles(row, currentUserId)
      return rolesString
    },
    owner: (_content, row) => row.owners.map(owner => `${owner.first_name} ${owner.last_name}`).join('; '),
    progress: (_content, row) => row.progress_total ? `${row.progress_count ?? 0} ${gettext('of')} ${row.progress_total}` : null,
    created: content => useFormattedDateTime(content, language),
    updated: content => useFormattedDateTime(content, language),
    actions: (_content, row) => {
      const rowUrl = `${baseUrl}/projects/${row.id}`
      const path = `?next=${window.location.pathname}`
      const { isProjectManager, isProjectOwner } = getUserRoles(row, currentUserId, ['managers', 'owners'])
      return (
        <div className="icon-container">
          {(isProjectManager || isProjectOwner || isManager) &&
          <Link
            href={`${rowUrl}/update`}
            className="element-link fa fa-pencil"
            title={row.title}
            onClick={() => window.location.href = `${rowUrl}/update/${path}`}
          />
          }
          {(isProjectOwner || isManager) &&
          <Link
            href={`${rowUrl}/delete`}
            className="element-link fa fa-trash"
            title={row.title}
            onClick={() => window.location.href = `${rowUrl}/delete/${path}`}
          />
          }
        </div>
      )
    }
  }

  return (
    <>
      <div className="project-header-container">
        <h2 className="headline mt-0">{headline}</h2>
        <div className="icon-container">
          {!isEmpty(invites) && myProjects &&
          <button className="btn btn-link mr-10" onClick={open}>
            <span className="badge badge-primary">
              {invites.length}
            </span>
            {gettext('Pending invitations')}
          </button>
          }
          {isManager &&
          <button className="btn btn-link mr-10" onClick={handleView}>
            {viewLinkText}
          </button>
          }
          <button className="btn btn-link mr-10" onClick={handleNew}>
            <i className="fa fa-plus" aria-hidden="true"></i> {gettext('New project')}
          </button>
          <FileUploadButton
            acceptedTypes={allowedTypes}
            buttonProps={{'className': 'btn btn-link'}}
            buttonLabel={gettext('Import project')}
            onImportFile={handleImport}
          />
        </div>
      </div>
      <div className="panel">
        <div className="panel-group">
          {parseInt(displayedRows) > projects.length ? projects.length : displayedRows} {gettext('of')} {projects.length} {gettext('projects are displayed')}
        </div>
        <div className="search-container">
          <SearchField
            value={searchString}
            onChange={updateSearchString}
            onSearch={projectsActions.fetchAllProjects}
            placeholder={gettext('Search projects')}
            className="search-field"
          />
        </div>
          <Link className="element-link mb-10" onClick={toggleFilters}>
            {showFilters ? gettext('Hide filters') : gettext('Show filters')}
          </Link>
          {showFilters && (
            <Link className="element-link ml-10 mb-10" onClick={resetAllFilters}>
              {gettext('Reset all filters')}
            </Link>
          )}
        {showFilters && (
        <ProjectFilters
          catalogs={catalogs ?? []}
          config={config}
          configActions={configActions}
          isManager={isManager}
          projectsActions={projectsActions}
        />
        )}
      </div>
      <Table
        cellFormatters={cellFormatters}
        columnWidths={columnWidths}
        config={config}
        configActions={configActions}
        data={projects}
        headerFormatters={HEADER_FORMATTERS}
        projectsActions={projectsActions}
        showTopButton={showTopButton}
        scrollToTop={scrollToTop}
        sortableColumns={SORTABLE_COLUMNS}
        visibleColumns={visibleColumns}
      />
      <Modal {...modalProps}>
        <PendingInvitations invitations={invites} />
      </Modal>
    </>
  )
}

Projects.propTypes = {
  config: PropTypes.object.isRequired,
  configActions: PropTypes.object.isRequired,
  currentUserObject: PropTypes.object.isRequired,
  projectsActions: PropTypes.object.isRequired,
  projectsObject: PropTypes.object.isRequired,
}

export default Projects
