import type { PayloadAction } from '../types';
import { ActionType } from '../types';
import type { VersionResponse } from '../../../backend/handler/AuthHandler.types';

export type SetVersionAction = PayloadAction<VersionResponse, ActionType.SET_MANAGER_VERSION>;

export function setVersion(version: VersionResponse): SetVersionAction {
    return {
        type: ActionType.SET_MANAGER_VERSION,
        payload: version
    };
}
