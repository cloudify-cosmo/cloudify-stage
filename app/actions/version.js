/**
 * Created by edenp on 03/12/2017.
 */

import * as types from './types';

export function setVersion(version) {
    return {
        type: types.SET_MANAGER_VERSION,
        version
    };
}
