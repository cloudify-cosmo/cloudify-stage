/**
 * Created by kinneretzin on 08/09/2016.
 */

import * as types from './types';
import TemplatesLoader from '../utils/templatesLoader';

function requestTemplates() {
    return {
        type: types.REQ_TEMPLATES
    }
}

function receiveTemplates(templates) {
    return {
        type: types.RES_TEMPLATES,
        templates: templates,
        receivedAt: Date.now()
    }
}

function errorsTemplates(err) {
    return {
        type: types.ERR_TEMPLATES,
        error: err,
        receivedAt: Date.now()
    }
}

export function fetchTemplates() {
    return function (dispatch) {

        dispatch(requestTemplates());

        return TemplatesLoader.load()
            .then(data => dispatch(receiveTemplates(data)))
            .catch(err => dispatch(errorsTemplates(err)))
    }
}