import React from 'react'
import PropTypes from 'prop-types'
import language from 'rdmo/core/assets/js/utils/language'

const columnStyle = { width: '25%', paddingRight: '10px' }
const PendingInvitations = ({ dateOptions, invitations }) => {
  const baseUrl = window.location.origin

  // Calculate the maximum length of project_title
  const maxProjectTitleLength = invitations.reduce((max, item) => Math.max(max, item.project_title.length), 0)
console.log('maxProjectTitleLength %o', maxProjectTitleLength)
  return (
    <div className="mb-20">
      <b>{gettext('Pending invitations')}</b>
      <table>
        <tbody>
          {invitations.map(item => (
            <tr key={item.id}>
              <td style={columnStyle}>
                {/* <a href={`${baseUrl}/projects/${item.project}`} target="_blank" rel="noopener noreferrer">{item.project_title}</a>
                {' '.repeat(maxProjectTitleLength - item.project_title.length)} */}
                <a href={`${baseUrl}/projects/join/${item.project}`} target="_blank" rel="noopener noreferrer"><b>{item.project_title}</b></a>
              </td>
              <td style={columnStyle}>{item.role}</td>
              <td style={columnStyle}>{new Date(item.timestamp).toLocaleString(language, dateOptions)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

PendingInvitations.propTypes = {
  dateOptions: PropTypes.object.isRequired,
  invitations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    project_title: PropTypes.string.isRequired,
    project: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
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
