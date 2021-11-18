// @ts-nocheck File not migrated fully to TS
/**
 * Created by pposel on 14/08/2017.
 */

import * as types from './types';
import doLoadTemplates from '../utils/templatesLoader';

export function storeTemplates(templates) {
    return {
        type: types.STORE_TEMPLATES,
        templates
    };
}

export function loadTemplates() {
    return (dispatch, getState) => doLoadTemplates(getState().manager).then(result => dispatch(storeTemplates(result)));
}
