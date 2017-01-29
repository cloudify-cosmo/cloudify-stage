/**
 * Created by kinneretzin on 11/01/2017.
 */

import fetch from 'isomorphic-fetch';

export default class ConfigLoader {
    static load() {
        return fetch('/config')
            .then(response => response.json())
            .catch((e)=>{
                console.log('Error fetching configuration file',e);
            });
    }
}