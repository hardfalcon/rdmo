import React from 'react'
import PropTypes from 'prop-types'

const columnStyle = { color: '#666', width: '25%', paddingLeft: '10px' }
const tableStyle = { border: '1px solid #ccc', borderCollapse: 'collapse', width: '100%' }

const PendingInvitations = ({ invitations }) => {
  const baseUrl = window.location.origin

  return (
    <div className="mb-20">
      <table style={tableStyle}>
        <tbody>
        <td style={columnStyle} colSpan="4"><h5>{gettext('Pending invitations')}</h5></td>
          {invitations.map(item => (
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
    </div>
  )
}

PendingInvitations.propTypes = {
  invitations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    project_title: PropTypes.string.isRequired,
    project: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
  })).isRequired,
}

export default PendingInvitations


// import React from 'react'
// import PropTypes from 'prop-types'

// const PendingInvitations = ({ invitations }) => {
//   const baseUrl = window.location.origin
//   return (
//     <div>
//       <h4>{gettext('Pending invitations')}</h4>
//         {invitations.map(item => (
//         <div key={item.id}>
//           <span>
//             <a href={`${baseUrl}/projects/${item.project}`} target="_blank" rel="noopener noreferrer">{item.project_title}</a> - {item.role} - {item.timestamp}
//           </span>
//         </div>
//         ))}
//     </div>
//   )
// }

// PendingInvitations.propTypes = {
//   invitations: PropTypes.arrayOf(PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     project_title: PropTypes.string.isRequired,
//     project: PropTypes.number.isRequired,
//     role: PropTypes.string.isRequired,
//     timestamp: PropTypes.string.isRequired,
//   })).isRequired,
// }

// export default PendingInvitations
