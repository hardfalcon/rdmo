import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Table = ({
  cellFormatters,
  data,
  headerFormatters,
  initialRows = 25,
  rowsToLoad = 10,
  sortableColumns,
  /* order of elements in 'visibleColumns' corresponds to order of columns in table */
  visibleColumns,
}) => {
  const [displayedRows, setDisplayedRows] = useState(initialRows)
  const [sortColumn, setSortColumn] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')

  const loadMore = () => {
    setDisplayedRows(prev => prev + rowsToLoad)
  }

  const handleHeaderClick = column => {
    if (sortableColumns.includes(column)) {
      if (sortColumn === column) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        setSortColumn(column)
        setSortOrder('asc')
      }
    }
  }

  const sortedData = () => {
    if (sortColumn) {
      const sorted = [...data]

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

      return sorted
    }
    return data
  }

  const renderHeaders = () => {
    return (
      <thead className="thead-dark">
        <tr>
          {visibleColumns.map(column => {
            const headerFormatter = headerFormatters[column]
            const columnHeaderContent = headerFormatter && headerFormatter.render ? headerFormatter.render(column) : column

            return (
              <th key={column} onClick={() => handleHeaderClick(column)}>
                {columnHeaderContent}
                {sortColumn === column && (
                  <span className="sort-icon">
                    {sortOrder === 'asc' ? <i className="fa fa-sort-asc" /> : <i className="fa fa-sort-desc" />}
                  </span>
                )}
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

    return (
      <tbody>
        {sortedRows.map((row, index) => (
          <tr key={index}>
            {visibleColumns.map(column => (
              <td key={column}>{formatCellContent(row, column, row[column])}</td>
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
        <button onClick={loadMore} className="load-more-btn">
          {gettext('Load More')}
        </button>
      )}
    </div>
  )
}

Table.propTypes = {
  cellFormatters: PropTypes.object,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  headerFormatters: PropTypes.object,
  initialRows: PropTypes.number,
  rowsToLoad: PropTypes.number,
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
}

export default Table
