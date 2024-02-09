import React from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'

const FileUploadButton = ({ acceptedTypes, buttonText, onFileDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedTypes,
    onDrop: (acceptedFiles) => {
      if (onFileDrop) {
        onFileDrop(acceptedFiles)
      }
    },
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button className="btn btn-link">
        <i className="fa fa-download" aria-hidden="true"></i> {buttonText}
      </button>
    </div>
  )
}

FileUploadButton.propTypes = {
  acceptedTypes: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onFileDrop: PropTypes.func,
}

export default FileUploadButton
