/**
 * Created by kinneretzin on 11/01/2017.
 */

import fetch from 'isomorphic-fetch';

import StageUtils from './stageUtils';

export default class ConfigLoader {
    static load() {
        return fetch(StageUtils.Url.url('/config'))
            .then(response => response.json())
            .catch(e => {
                log.log('Error fetching configuration file', e);
            });
    }
}
