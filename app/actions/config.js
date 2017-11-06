/**
 * Created by addihorowitz on 19/09/2016.
 */

import * as types from './types';

export function setEditMode(isEditMode) {
    return {
        type : types.SET_CONFIG_EDIT_MODE,
        isEditMode
    }
}