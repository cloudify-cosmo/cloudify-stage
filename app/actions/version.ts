// @ts-nocheck File not migrated fully to TS

import * as types from './types';

export function setVersion(version) {
    return {
        type: types.SET_MANAGER_VERSION,
        version
    };
}
