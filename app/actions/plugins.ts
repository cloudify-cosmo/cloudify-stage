import type { PayloadAction } from './types';
import { ActionType } from './types';

export type SetPluginUploadingAction = PayloadAction<string, ActionType.SET_PLUGIN_UPLOADING>;
export type UnsetPluginUploadingAction = PayloadAction<string, ActionType.UNSET_PLUGIN_UPLOADING>;
export type PluginAction = SetPluginUploadingAction | UnsetPluginUploadingAction;

export function setPluginUploading(pluginUrl: string): SetPluginUploadingAction {
    return {
        type: ActionType.SET_PLUGIN_UPLOADING,
        payload: pluginUrl
    } as const;
}

export function unsetPluginUploading(pluginUrl: string): UnsetPluginUploadingAction {
    return {
        type: ActionType.UNSET_PLUGIN_UPLOADING,
        payload: pluginUrl
    } as const;
}
