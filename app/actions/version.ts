// @ts-nocheck File not migrated fully to TS

import { ActionType } from './types';

export function setVersion(version) {
    return {
        type: ActionType.SET_MANAGER_VERSION,
        version
    };
}
