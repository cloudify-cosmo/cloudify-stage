/**
 * Created by kinneretzin on 11/01/2017.
 */

import fetch from 'isomorphic-fetch';

export default class ConfigLoader {
    static load() {
        return fetch('/conf/manager.json')
            .then(response => response.json())
            .then((manager)=>{
                return { manager: manager }
            }).catch((e)=>{
                console.log('Error fetching configuration file',e);
            });
    }
}