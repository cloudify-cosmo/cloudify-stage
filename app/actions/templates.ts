// @ts-nocheck File not migrated fully to TS

import { ActionType } from './types';
import doLoadTemplates from '../utils/templatesLoader';

export function storeTemplates(templates) {
    return {
        type: ActionType.STORE_TEMPLATES,
        templates
    };
}

export function loadTemplates() {
    return (dispatch, getState) => doLoadTemplates(getState().manager).then(result => dispatch(storeTemplates(result)));
}
