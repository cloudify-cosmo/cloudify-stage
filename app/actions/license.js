/**
 * Created by jakub.niezgoda on 07/03/2019.
 */

import * as types from './types';

export function setLicense(license) {
    return {
        type: types.SET_MANAGER_LICENSE,
        license
    }
}