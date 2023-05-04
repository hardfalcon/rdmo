from collections import defaultdict

from rdmo.conditions.imports import import_condition
from rdmo.core.constants import PERMISSIONS
from rdmo.domain.imports import import_attribute
from rdmo.options.imports import import_option, import_optionset
from rdmo.questions.imports import (import_catalog, import_page,
                                    import_question, import_questionset,
                                    import_section)
from rdmo.tasks.imports import import_task
from rdmo.views.imports import import_view


def check_permissions(elements, user):
    model_names = set([element.get('model') for element in elements])

    permissions = []
    for model_name in model_names:
        permissions += PERMISSIONS[model_name]

    return user.has_perms(permissions)


def import_elements(elements, save=True):
    for element in elements:
        model_name = element.get('model')

        element.update({
            'warnings': defaultdict(list),
            'errors': [],
            'created': False,
            'updated': False
        })

        if model_name == 'condition':
            import_condition(element, save)

        elif model_name == 'attribute':
            import_attribute(element, save)

        elif model_name == 'optionset':
            import_optionset(element, save)

        elif model_name == 'option':
            import_option(element, save)

        elif model_name == 'catalog':
            import_catalog(element, save)

        elif model_name == 'section':
            import_section(element, save)

        elif model_name == 'page':
            import_page(element, save)

        elif model_name == 'questionset':
            import_questionset(element, save)

        elif model_name == 'question':
            import_question(element, save)

        elif model_name == 'task':
            import_task(element, save)

        elif model_name == 'view':
            import_view(element, save)

        element = filter_warnings(element, elements)


def filter_warnings(element, elements):
    # remove warnings regarding elements which are in the elements list
    warnings = []
    for uri, messages in element['warnings'].items():
        if not next(filter(lambda e: e['uri'] == uri, elements), None):
            warnings += messages

    element['warnings'] = warnings
    return element
