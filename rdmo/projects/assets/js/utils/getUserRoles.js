export const getUserRoles = (row, currentUserId, arraysToSearch) => {
  if (!arraysToSearch || !arraysToSearch.length) {
    arraysToSearch = ['authors', 'guests', 'managers', 'owners']
  }

  const roleDefinitions = {
    authors: { roleLabel: 'Author', roleBoolean: 'isProjectAuthor' },
    guests: { roleLabel: 'Guest', roleBoolean: 'isProjectGuest' },
    managers: { roleLabel: 'Manager', roleBoolean: 'isProjectManager' },
    owners: { roleLabel: 'Owner', roleBoolean: 'isProjectOwner' }
  }

  let rolesFound = []
  let roleBooleans = {
    isProjectAuthor: false,
    isProjectGuest: false,
    isProjectManager: false,
    isProjectOwner: false
  }

  arraysToSearch.forEach(arrayName => {
    if (row[arrayName].some(item => item.id === currentUserId)) {
      const { roleLabel, roleBoolean } = roleDefinitions[arrayName]
      rolesFound.push(gettext(roleLabel))
      roleBooleans[roleBoolean] = true
    }
  })

  return {
    rolesString: rolesFound.length > 0 ? rolesFound.join(', ') : null,
    ...roleBooleans
  }
}

export default getUserRoles
