/**
 * Created by addihorowitz on 19/09/2016.
 */

import * as types from './types';

export function setManager(name,ip) {
    return {
        type : types.SET_MANAGER,
        name,
        ip
    }

}
