import React from 'react'
import PropTypes from 'prop-types'

const PendingInvitations = ({ invitations }) => {
  const baseUrl = window.location.origin

  return (
      invitations?.map(item => (
        <div key={item.id} className="row-container">
          <div className="w-100 mb-5">
            <b>{item.title}</b>
          </div>
          <div className="w-50">
            {gettext(item.role).charAt(0).toUpperCase() + gettext(item.role).slice(1)}
          </div>
          <div className="w-25 align-right">
            <button className="btn btn-xs btn-success ml-10" onClick={() => { window.location.href = `${baseUrl}/projects/join/${item.token}` }}>{gettext('Accept')}</button>
            <button className="btn btn-xs btn-danger ml-10" onClick={() => { window.location.href = `${baseUrl}/projects/cancel/${item.token}` }}>{gettext('Decline')}</button>
          </div>
        </div>
      ))
  )
}

PendingInvitations.propTypes = {
  invitations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    project: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired
  })),
}

export default PendingInvitations
