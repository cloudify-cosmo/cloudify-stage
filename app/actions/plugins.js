/**
 * Created by kinneretzin on 08/09/2016.
 */

import * as types from './types';
import PluginsLoader from '../utils/pluginsLoader';

function requestPlugins() {
    return {
        type: types.REQ_PLUGINS
    }
}

function receivePlugins(pluginsData) {
    return {
        type: types.RES_PLUGINS,
        plugins: pluginsData,
        receivedAt: Date.now()
    }
}

function errorsPlugins(err) {
    return {
        type: types.ERR_PLUGINS,
        error: err,
        receivedAt: Date.now()
    }
}

export function fetchPlugins() {
    return function (dispatch) {

        dispatch(requestPlugins());

        return PluginsLoader.load()
            .then(data => dispatch(receivePlugins(data)))
            .catch(err => dispatch(errorsPlugins(err)))
    }
}