/**
 * Created by kinneretzin on 08/09/2016.
 */

import fetch from 'isomorphic-fetch'

export default class PluginsLoader {

    static load() {
        return fetch('/plugins/plugins.json')
            .then(response => response.json());

        //return new Promise((resolve,reject) => {
        //
        //    $.get( "/plugins/plugins.json")
        //        .done(function(data) {
        //            console.log('plugins: ',data);
        //            resolve(data)
        //        })
        //        .fail(function(e) {
        //            console.error(e);
        //            reject(e);
        //        })
        //        .always(function() {
        //        });
        //});


    }
}
