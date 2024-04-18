import React from 'react'
import PropTypes from 'prop-types'

import { UploadDropZone } from 'rdmo/core/assets/js/components'

const ProjectImport = ({ allowedTypes, handleImport}) => {
  return (
    <>
    <UploadDropZone
      acceptedTypes={allowedTypes}
      onImportFile={handleImport} />
      <hr />
      <h2>{gettext('Direct import')}</h2>
      to do: display links
      </>
  )
}

ProjectImport.propTypes = {
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  handleImport: PropTypes.func.isRequired,
}

export default ProjectImport
