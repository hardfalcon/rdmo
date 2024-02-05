import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

const Table = ({
  cellFormatters,
  columnWidths,
  data,
  headerFormatters,
  initialRows = 20,
  refetchProjects,
  rowsToLoad = 10,
  sortableColumns,
  /* order of elements in 'visibleColumns' corresponds to order of columns in table */
  visibleColumns,
  configActions,
  config
}) => {

  const displayedRows = get(config, 'table.rows', '')
  // console.log('displayedRows %o', displayedRows)
  if (displayedRows === null || displayedRows === undefined) {
    configActions.updateConfig('table.rows', initialRows.toString())
  }
  // console.log('displayedRows %o', displayedRows)

  const extractSortingParams = (params) => {
    const { ordering } = params || {}

    if (!ordering) {
        return { sortOrder: undefined, sortColumn: undefined }
    }

    const sortOrder = ordering.startsWith('-') ? 'desc' : 'asc'
    const sortColumn = sortOrder === 'desc' ? ordering.substring(1) : ordering

    return { sortColumn, sortOrder }
  }

  const params = get(config, 'params', {})
  const { sortColumn, sortOrder } = extractSortingParams(params)

  const loadMore = () => {
    console.log('Load More')
    configActions.updateConfig('table.rows', (parseInt(displayedRows) + parseInt(rowsToLoad)))
    console.log('AFTER load more table.rows', get(config, 'table.rows'))
  }

  const loadAll = () => {
    console.log('Load All')
    configActions.updateConfig('table.rows', data.length)
    console.log('AFTER load all table.rows', get(config, 'table.rows'))
  }

  const handleHeaderClick = (column) => {
    if (sortableColumns.includes(column)) {
      if (sortColumn === column) {
        configActions.updateConfig('params.ordering', sortOrder === 'asc' ? `-${column}` : column)
      } else {
        configActions.updateConfig('params.ordering', column)

      }
      refetchProjects(params)
    }
  }

  const renderSortIcon = (column) => {
    const isSortColumn = sortColumn === column
    const isAsc = sortOrder === 'asc'

    return (
      <span className="ml-5 sort-icon">
        <i className={`fa fa-sort${isSortColumn ? isAsc ? '-asc' : '-desc' : ''} ${isSortColumn ? '' : 'text-muted'}`} />
      </span>
    )
  }

  const renderHeaders = () => {
    return (
      <thead className="thead-dark">
        <tr>
          {visibleColumns.map((column, index) => {
            const headerFormatter = headerFormatters[column]
            const columnHeaderContent = headerFormatter && headerFormatter.render ? headerFormatter.render(column) : column

            return (
              <th key={column} style={{ width: columnWidths[index] }} onClick={() => handleHeaderClick(column)}>
                {columnHeaderContent}
                {sortableColumns.includes(column) && renderSortIcon(column)}
              </th>
            )
          })}
        </tr>
      </thead>
    )
  }

  const formatCellContent = (row, column, content) => {
    if (cellFormatters && cellFormatters[column] && typeof cellFormatters[column] === 'function') {
      return cellFormatters[column](content, row)
    }
    return content
  }

  const renderRows = () => {
    const sortedRows = data.slice(0, displayedRows)
    return (
      <tbody>
        {sortedRows.map((row, index) => (
          <tr key={index}>
            {visibleColumns.map((column, index) => (
              <td key={column}style={{ width: columnWidths[index] }}>
                {formatCellContent(row, column, row[column])}
                </td>
            ))}
          </tr>
        ))}
      </tbody>
    )
  }

  return (
    <div className="table-container">
      <table className="table table-borderless">
        {renderHeaders()}
        {renderRows()}
      </table>
      {displayedRows < data.length && (
        <div className="icon-container ml-auto">
          <button onClick={loadMore} className="load-more-btn">
            {gettext('Load More')}
          </button><button onClick={loadAll} className="load-more-btn">
            {gettext('Load All')}
          </button>
        </div>
      )}
    </div>
  )
}

Table.propTypes = {
  cellFormatters: PropTypes.object,
  columnWidths: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  headerFormatters: PropTypes.object,
  initialRows: PropTypes.number,
  refetchProjects: PropTypes.func,
  rowsToLoad: PropTypes.number,
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  configActions: PropTypes.object,
  config: PropTypes.object
}

export default Table
