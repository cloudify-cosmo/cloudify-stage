import log from 'loglevel';
import fetch from 'isomorphic-fetch';

import StageUtils from './stageUtils';
import type { GetConfigResponse } from '../../backend/routes/Config.types';

export default class ConfigLoader {
    static load(): Promise<GetConfigResponse> {
        return fetch(StageUtils.Url.url('/config'))
            .then(response => response.json())
            .catch(e => {
                log.debug('Error fetching configuration file', e);
            });
    }
}
