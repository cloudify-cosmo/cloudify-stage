import * as types from './types';

export function setPluginUploading(pluginUrl: string) {
    return {
        type: types.SET_PLUGIN_UPLOADING,
        pluginUrl
    } as const;
}

export function unsetPluginUploading(pluginUrl: string) {
    return {
        type: types.UNSET_PLUGIN_UPLOADING,
        pluginUrl
    } as const;
}
