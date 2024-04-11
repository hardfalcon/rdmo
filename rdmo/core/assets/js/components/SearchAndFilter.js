import React from 'react'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'

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
  return (
    <div className="form-group mb-0">
      <select className="form-control" onChange={e => onChange(e.target.value)} value={value}>
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option value={option.value} key={index}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

Select.propTypes = {
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
}

export { SearchField, Select }
