import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

const Table = ({
  cellFormatters,
  columnWidths,
  data,
  headerFormatters,
  initialRows = 3,
  rowsToLoad = 2,
  sortableColumns,
  /* order of elements in 'visibleColumns' corresponds to order of columns in table */
  visibleColumns,
  configActions,
  config
}) => {

  const displayedRows = get(config, 'table.rows')
  console.log('displayedRows at beginning', displayedRows)
  displayedRows == 0 && configActions.updateConfig('table.rows', initialRows)
  const { column: sortColumn, order: sortOrder } = get(config, 'table.sort', '')
  // const sortColumn = get(config, 'table.sort.column', '')
  // const sortOrder = get(config, 'table.sort.order', '')
console.log('sortColumn', sortColumn)
  const loadMore = () => {
    console.log('Load More')
    configActions.updateConfig('table.rows', parseInt(displayedRows) + parseInt(rowsToLoad))
    console.log('AFTER load more table.rows', get(config, 'table.rows'))
  }

  const loadAll = () => {
    console.log('Load All')
    configActions.updateConfig('table.rows', parseInt(data.length))
    console.log('AFTER load all table.rows', get(config, 'table.rows', 0))
  }

  const handleHeaderClick = column=> {
    if (sortableColumns.includes(column)) {
      if (sortColumn === column) {
        // configActions.updateConfig('table.sort', { column: column, order: sortOrder === 'asc' ? 'desc' : 'asc' })
        configActions.updateConfig('table.sort.column', column)
        configActions.updateConfig('table.sort.order', sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        // configActions.updateConfig('table.sort', { column: column, order: 'asc'})
        configActions.updateConfig('table.sort.column', column)
        configActions.updateConfig('table.sort.order', 'asc')
      }
    }
  }

  const sortedData = () => {
    // const slicedData = data //.slice(0, displayedRows)
    const sorted = data
    if (sortColumn) {
      // const sorted = slicedData
      console.log('sorted', sorted)

      sorted.sort((a, b) => {
        let valueA = a[sortColumn]
        let valueB = b[sortColumn]
        const sortRawContent = (
          headerFormatters[sortColumn]?.sortRawContent ?? true
        )

        if (!sortRawContent) {
          valueA = formatCellContent(a, sortColumn, a[sortColumn])
          valueB = formatCellContent(b, sortColumn, b[sortColumn])
        }

        if (sortOrder === 'asc') {
          return valueA.localeCompare ? valueA.localeCompare(valueB) : valueA - valueB
        } else {
          return valueB.localeCompare ? valueB.localeCompare(valueA) : valueB - valueA
        }
      })
    }
    // return sorted.slice(0, displayedRows)
    return sorted
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
    const sortedRows = sortedData().slice(0, displayedRows)
    // const sortedRows = sortedData()
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
  rowsToLoad: PropTypes.number,
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  configActions: PropTypes.object,
  config: PropTypes.object
}

export default Table
