// @ts-nocheck File not migrated fully to TS

import { ActionType } from './types';

export function setLicense(license) {
    return {
        type: ActionType.SET_MANAGER_LICENSE,
        license
    };
}

export function setLicenseRequired(isRequired) {
    return {
        type: ActionType.SET_LICENSE_REQUIRED,
        isRequired
    };
}
