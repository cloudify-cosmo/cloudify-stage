import { ActionType } from './types';

export function setPluginUploading(pluginUrl: string) {
    return {
        type: ActionType.SET_PLUGIN_UPLOADING,
        pluginUrl
    } as const;
}

export function unsetPluginUploading(pluginUrl: string) {
    return {
        type: ActionType.UNSET_PLUGIN_UPLOADING,
        pluginUrl
    } as const;
}
