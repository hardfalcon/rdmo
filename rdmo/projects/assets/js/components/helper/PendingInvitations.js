import React from 'react'
import PropTypes from 'prop-types'

const columnStyle = { color: '#666', width: '25%', paddingLeft: '10px' }
const tableStyle = { width: '100%' }

const PendingInvitations = ({ invitations }) => {
  const baseUrl = window.location.origin

  return (
        <table style={tableStyle}>
           <tbody>
            {invitations?.map(item => (
            <tr key={item.id}>
              <td style={columnStyle}>
                <b>{item.project_title}</b>
                {/* <a href={`${baseUrl}/projects/${item.project}`} target="_blank" rel="noopener noreferrer">{item.project_title}</a>
                {' '.repeat(maxProjectTitleLength - item.project_title.length)} */}
                {/* <a href={`${baseUrl}/projects/join/${item.project}`} target="_blank" rel="noopener noreferrer"><b>{item.project_title}</b></a> */}
              </td>
              {/* <td style={columnStyle}>{gettext(item.role)}</td> */}
              <td style={columnStyle}>{gettext(item.role).charAt(0).toUpperCase() + gettext(item.role).slice(1)}</td>
              <td style={columnStyle}>
                <button className="btn btn-link" onClick={() => { window.location.href = `${baseUrl}/projects/join/${item.project}` }}>{gettext('Accept')}</button>
              </td>
              <td style={columnStyle}>
                <button className="btn btn-link" onClick={() => { window.location.href = `${baseUrl}/projects/cancel/${item.project}` }}>{gettext('Decline')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  )
}

PendingInvitations.propTypes = {
  invitations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    project_title: PropTypes.string.isRequired,
    project: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
  })),
}

export default PendingInvitations
