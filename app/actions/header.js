/**
 * Created by addihorowitz on 19/09/2016.
 */

import * as types from './types';

export function setDashboardEditMode(isEditMode) {
    return {
        type : types.SET_DASHBOARD_EDIT_MODE,
        isEditMode
    }

}

/*export function toggleDashboardEditMode(isEditMode) {
    return function (dispatch) {
        dispatch(toggleDashboardEditMode(isEditMode));
        }
}*/
