import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

const columnStyle = { color: '#666', width: '25%', paddingLeft: '10px' }
// const tableStyle = { border: '1px solid #ccc', borderCollapse: 'collapse', width: '100%' }
const tableStyle = { width: '100%' }

const PendingInvitationsModal = ({ invitations, onClose, show }) => {
  const baseUrl = window.location.origin

  return (
    <Modal bsSize="large" show={show} onHide={onClose} className="element-modal">
      <Modal.Header closeButton>
        <h2 className="modal-title">{gettext('Pending invitations')}</h2>
      </Modal.Header>
      <Modal.Body>
        { <table style={tableStyle}>
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
      </table> }
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-default" onClick={onClose}>
          {gettext('Close')}
        </button>
      </Modal.Footer>
    </Modal>
  )
  // return (
  //   <div className="mb-20">
  //     <table style={tableStyle}>
  //       <tbody>
  //       <td style={columnStyle} colSpan="4"><h5>{gettext('Pending invitations')}</h5></td>
  //         {invitations.map(item => (
  //           <tr key={item.id}>
  //             <td style={columnStyle}>
  //               <b>{item.project_title}</b>
  //               {/* <a href={`${baseUrl}/projects/${item.project}`} target="_blank" rel="noopener noreferrer">{item.project_title}</a>
  //               {' '.repeat(maxProjectTitleLength - item.project_title.length)} */}
  //               {/* <a href={`${baseUrl}/projects/join/${item.project}`} target="_blank" rel="noopener noreferrer"><b>{item.project_title}</b></a> */}
  //             </td>
  //             {/* <td style={columnStyle}>{gettext(item.role)}</td> */}
  //             <td style={columnStyle}>{gettext(item.role).charAt(0).toUpperCase() + gettext(item.role).slice(1)}</td>
  //             <td style={columnStyle}>
  //               <button className="btn btn-link" onClick={() => { window.location.href = `${baseUrl}/projects/join/${item.project}` }}>{gettext('Accept')}</button>
  //             </td>
  //             <td style={columnStyle}>
  //               <button className="btn btn-link" onClick={() => { window.location.href = `${baseUrl}/projects/cancel/${item.project}` }}>{gettext('Decline')}</button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // )
}

PendingInvitationsModal.propTypes = {
  invitations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    project_title: PropTypes.string.isRequired,
    project: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
  })),
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
}

export default PendingInvitationsModal
