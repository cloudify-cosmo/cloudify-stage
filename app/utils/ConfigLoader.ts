import log from 'loglevel';
import fetch from 'isomorphic-fetch';

import StageUtils from './stageUtils';

export interface ClientConfig {
    app: {
        maintenancePollingInterval: number;
        maps: any;
        saml: any;
        singleManager: boolean;
        whiteLabel: any;
    };
    manager: {
        ip: string;
    };
    mode: string;
}

export default class ConfigLoader {
    static load(): Promise<ClientConfig> {
        return fetch(StageUtils.Url.url('/config'))
            .then(response => response.json())
            .catch(e => {
                log.debug('Error fetching configuration file', e);
            });
    }
}
