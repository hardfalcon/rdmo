import React from 'react'
import PropTypes from 'prop-types'

const Table = ({ data, visibleColumns, headerFormatters, cellFormatters }) => {
  const renderHeaders = () => {
    return (
      <thead className="thead-dark">
        <tr>
          {visibleColumns.map(column => (
            <th key={column}>{headerFormatters && headerFormatters[column] ? headerFormatters[column](column) : column}</th>
          ))}
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
    return (
      <tbody>
        {data.map((row, index) => (
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
    <table className="table table-borderless">
      {renderHeaders()}
      {renderRows()}
    </table>
  )
}

Table.propTypes = {
  cellFormatters: PropTypes.object,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  headerFormatters: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
}

export default Table
