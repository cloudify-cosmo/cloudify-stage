/**
 * Created by kinneretzin on 11/01/2017.
 */

import fetch from 'isomorphic-fetch';

import StageUtils from './stageUtils';

export default class ConfigLoader {
    static load() {
        return fetch(StageUtils.url('/config'))
            .then(response => response.json())
            .catch((e)=>{
                console.log('Error fetching configuration file',e);
            });
    }
}