import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'

const SearchField = ({ value, onChange, onSearch, placeholder }) => {

  const handleSearch = () => {
    onSearch(value)
  }

  const handleChange = (newValue) => {
    onChange(newValue)
  }

  const handleButtonClick = () => {
    onChange('')
    handleSearch()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="form-group mb-0">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span className="input-group-btn">
          <button className="btn btn-default" onClick={handleButtonClick}>
            <span className="fa fa-times"></span>
          </button>
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </span>
      </div>
    </div>
  )
}

SearchField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
}

const Select = ({ options, onChange, placeholder, value }) => {
  const selectedOption = options.find(option => option.value === value) || null
  const handleChange = (selected) => {
    console.log('Handle Change:', selected)
    onChange(selected ? selected.value : null)
  }

  return (
    <div className="form-group mb-0">
      <ReactSelect
        className="react-select"
        classNamePrefix="react-select"
        options={options}
        onChange={handleChange}
        value={selectedOption}
        isClearable
        placeholder={placeholder}
      />
    </div>
  )
}

Select.propTypes = {
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
}

export { SearchField, Select }
