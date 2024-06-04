import copy
import logging
from collections import defaultdict
from dataclasses import asdict
from typing import AbstractSet, Dict, List, Optional

from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpRequest

from rdmo.conditions.imports import import_helper_condition
from rdmo.core.imports import (
    ELEMENT_DIFF_FIELD_NAME,
    check_permissions,
    get_or_return_instance,
    make_import_info_msg,
    set_extra_field,
    set_foreign_field,
    set_lang_field,
    set_m2m_instances,
    set_m2m_through_instances,
    set_reverse_m2m_through_instance,
    track_changes_on_element,
    validate_instance,
)
from rdmo.domain.imports import import_helper_attribute
from rdmo.options.imports import import_helper_option, import_helper_optionset
from rdmo.questions.imports import (
    import_helper_catalog,
    import_helper_page,
    import_helper_question,
    import_helper_questionset,
    import_helper_section,
)
from rdmo.tasks.imports import import_helper_task
from rdmo.views.imports import import_helper_view

logger = logging.getLogger(__name__)


ELEMENT_IMPORT_HELPERS = {
    "conditions.condition": import_helper_condition,
    "domain.attribute": import_helper_attribute,
    "options.optionset": import_helper_optionset,
    "options.option": import_helper_option,
    "questions.catalog": import_helper_catalog,
    "questions.section": import_helper_section,
    "questions.page": import_helper_page,
    "questions.questionset": import_helper_questionset,
    "questions.question": import_helper_question,
    "tasks.task": import_helper_task,
    "views.view": import_helper_view
}

IMPORT_ELEMENT_INIT_DICT = {
        'warnings': lambda: defaultdict(list),
        'errors': list,
        'created': bool,
        'updated': bool,
        ELEMENT_DIFF_FIELD_NAME: dict,
    }


def import_elements(uploaded_elements: Dict, save: bool = True, request: Optional[HttpRequest] = None) -> List[Dict]:
    imported_elements = []
    uploaded_uris = set(uploaded_elements.keys())
    current_site = get_current_site(request)
    for _uri, uploaded_element in uploaded_elements.items():
        element = import_element(element=uploaded_element, save=save,
                                  uploaded_uris=uploaded_uris,
                                    request=request, current_site=current_site)
        element['warnings'] = {k: val for k, val in element['warnings'].items() if k not in uploaded_uris}
        imported_elements.append(element)
    return imported_elements

def _initialize_import_element_dict(element: Dict) -> None:
    # initialize element dict with default values
    for _k,_val in IMPORT_ELEMENT_INIT_DICT.items():
        element[_k] = _val()


def import_element(
        element: Optional[Dict] = None,
        save: bool = True,
        request: Optional[HttpRequest] = None,
        uploaded_uris: Optional[AbstractSet[str]] = None,
        current_site = None
    ) -> Dict:

    if element is None:
        return {}

    model_path = element.get('model')
    if model_path is None:
        return element

    _initialize_import_element_dict(element)

    user = request.user if request is not None else None
    import_helper = ELEMENT_IMPORT_HELPERS[model_path]
    if import_helper.model_path != model_path:
        raise ValueError(f'Invalid import helper model path: {import_helper.model_path}. Expected {model_path}.')
    model = import_helper.model
    validators = import_helper.validators
    common_fields = import_helper.common_fields
    lang_field_names = import_helper.lang_fields
    foreign_field_names = import_helper.foreign_fields
    extra_field_helpers = import_helper.extra_fields

    uri = element.get('uri')
    # get or create instance from uri and model_path
    instance, created = get_or_return_instance(model, uri=uri)

    # keep a copy of the original
    # when the element is updated
    # needs to be created here, else the changes will be overwritten
    original = copy.deepcopy(instance) if not created else None

    # prepare a log message
    msg = make_import_info_msg(model._meta.verbose_name, created, uri=uri)

    # check the change or add permissions for the user on the instance
    perms_error_msg = check_permissions(instance, uri, user)
    if perms_error_msg:
        # when there is an error msg, the import can be stopped and return
        element["errors"].append(perms_error_msg)
        return element

    updated = not created
    element['created'] = created
    element['updated'] = updated
    # the dict element[ELEMENT_DIFF_FIELD_NAME] is filled by tracking changes

    element = strip_uri_prefix_endswith_slash(element)
    # start to set values on the instance
    # set common field values from element on instance
    for common_field in common_fields:
        common_value = element.get(common_field) or ''
        setattr(instance, common_field, common_value)
        if updated and original:
            # track changes for common fields
            track_changes_on_element(element, common_field, new_value=common_value, original=original)
    # set language fields
    for lang_field_name in lang_field_names:
        set_lang_field(instance, lang_field_name, element, original=original)
    # set foreign fields
    for foreign_field in foreign_field_names:
        set_foreign_field(instance, foreign_field, element, uploaded_uris=uploaded_uris, original=original)
    # set extra fields
    for extra_field_helper in extra_field_helpers:
        set_extra_field(instance, extra_field_helper.field_name, element,
                        extra_field_helper=extra_field_helper, original=original)
    # call the validators on the instance
    validate_instance(instance, element, *validators)

    if element.get('errors'):
        # when there is an error msg, the import can be stopped and return
        return element
    if save:
        logger.info(msg)
        instance.save()
    if save or updated:
        # this part updates the related fields of the instance
        for m2m_field in import_helper.m2m_instance_fields:
            set_m2m_instances(instance, element, m2m_field, original=original, save=save)
        for m2m_through_fields in import_helper.m2m_through_instance_fields:
            set_m2m_through_instances(instance, element, **asdict(m2m_through_fields),
                                      original=original, save=save)
        for reverse_m2m_fields in import_helper.reverse_m2m_through_instance_fields:
            set_reverse_m2m_through_instance(instance, element, **asdict(reverse_m2m_fields),
                                             original=original, save=save)

    if save and settings.MULTISITE:
        if import_helper.add_current_site_editors:
            instance.editors.add(current_site)
        if import_helper.add_current_site_sites:
            instance.sites.add(current_site)

    return element


def strip_uri_prefix_endswith_slash(element: dict) -> dict:
    # handle URI Prefix ending with slash
    if 'uri_prefix' not in element:
        return element
    if element['uri_prefix'].endswith('/'):
        element['uri_prefix'] = element['uri_prefix'].rstrip('/')
    return element

def _set_element_diff_field_meta_info(element: dict) -> None:
    changed_fields = {k: val for k, val in element[ELEMENT_DIFF_FIELD_NAME].items() if val['changed']}
    element['changed'] = bool(changed_fields)
    element['changed_fields'] = list(changed_fields.keys())
