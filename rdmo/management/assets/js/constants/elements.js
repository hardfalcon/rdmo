const elementTypes = [
  'catalogs',
  'sections',
  'pages',
  'questionsets',
  'questions',
  'attributes',
  'optionsets',
  'options',
  'conditions',
  'tasks',
  'views'
]

const elementModules = {
  'catalogs': 'questions',
  'sections': 'questions',
  'pages': 'questions',
  'questionsets': 'questions',
  'questions': 'questions',
  'attributes': 'domain',
  'optionsets': 'options',
  'options': 'options',
  'conditions': 'conditions',
  'tasks': 'tasks',
  'views': 'views'
}

const codeClass = {
  'catalogs': 'code-questions',
  'sections': 'code-questions',
  'pages': 'code-questions',
  'questionsets': 'code-questions',
  'questions': 'code-questions',
  'attributes': 'code-domain',
  'optionsets': 'code-options',
  'options': 'code-options',
  'conditions': 'code-conditions',
  'tasks': 'code-tasks',
  'views': 'code-views'
}

const verboseNames = {
  'catalogs': gettext('Catalogs'),
  'sections': gettext('Section'),
  'pages': gettext('Page'),
  'questionsets': gettext('Question set'),
  'questions': gettext('Question'),
  'attributes': gettext('Attribute'),
  'optionsets': gettext('Option set'),
  'options': gettext('Option'),
  'conditions': gettext('Condition'),
  'tasks': gettext('Task'),
  'views': gettext('View')
}

export { elementTypes, elementModules, codeClass, verboseNames }
