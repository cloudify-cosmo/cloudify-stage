import type { LicenseResponse } from 'backend/handler/AuthHandler.types';
import type { PayloadAction } from '../types';
import { ActionType } from '../types';

export type SetLicenseAction = PayloadAction<LicenseResponse | null, ActionType.SET_MANAGER_LICENSE>;
export type SetLicenseRequiredAction = PayloadAction<boolean, ActionType.SET_LICENSE_REQUIRED>;
export type LicenseAction = SetLicenseAction | SetLicenseRequiredAction;

export function setLicense(license: LicenseResponse | null): SetLicenseAction {
    return {
        type: ActionType.SET_MANAGER_LICENSE,
        payload: license
    };
}

export function setLicenseRequired(isRequired: boolean): SetLicenseRequiredAction {
    return {
        type: ActionType.SET_LICENSE_REQUIRED,
        payload: isRequired
    };
}
