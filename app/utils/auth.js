/**
 * Created by kinneretzin on 10/11/2016.
 */

import fetch from 'isomorphic-fetch';
import Manager from './Manager';
import Consts from './consts';

export default class Auth {

    static login(managerIp,username,password) {

        return this._getApiVersion(managerIp,username,password)
                    .then(version => this._getLoginToken(managerIp,username,password,version));

    }

    static _getApiVersion(managerIp,username,password) {

        return fetch(new Manager({ip:managerIp}).getManagerUrl("/version"),
            {
                method: 'GET',
                headers: {
                    'authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
                    tenant: Consts.DEFAULT_TENANT
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                return response.json();
            })
            .then((data)=> {
                if (data.error_code) {
                    return Promise.reject(data);
                }

                return Promise.resolve(data.version);
            })
            .then((version)=> {
                /*
                    (0 - 3.2.1] -> v1
                    (3.2.1 - 3.3.1] -> v2
                    (3.3.1 - 3.4.x] -> v2.1
                    (3.4.x - 4.0.x] -> v3
                */

                const mapping = [
                    {left: "0.0.0", right: "3.2.1", version: "v1"},
                    {left: "3.2.1", right: "3.3.1", version: "v2"},
                    {left: "3.3.1", right: "3.4.100", version: "v2.1"},
                    {left: "3.4.100", right: "4.0.100", version: "v3"},
                ];

                function _fill(v) {
                    return _.padEnd(_.defaultTo(v, '0'), 3, '0');
                }

                function _number(value) {
                    let v = _.words(value);
                    return _.toNumber(_fill(v[0]) + _fill(v[1]) + _fill(v[2]));
                }

                let verNum = _number(version);
                let apiVer = null;
                _.each(mapping,m=>{
                    let leftNum = _number(m.left);
                    let rightNum = _number(m.right);
                    if (verNum > leftNum && verNum <= rightNum) {
                        apiVer = m.version;
                        return false;
                    }
                })

                if (apiVer) {
                    return Promise.resolve(apiVer);
                } else {
                    throw Error(`Cannot determine API version from server version ${version}`);
                }
            })
            .catch((e)=>{
                console.error(e);
                return Promise.reject(e.message);
            });
    }

    static _getLoginToken(managerIp,username,password,version) {

        return fetch(new Manager({ip:managerIp, version}).getManagerUrl("/tokens"),
            {
                method: 'GET',
                headers: {
                    'authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
                    tenant: Consts.DEFAULT_TENANT
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                return response.json();
            })
            .then((data)=> {
                if (data.error_code) {
                    return Promise.reject(data);
                }

                return Promise.resolve({token:data.value, version});
            })
            .catch((e)=>{
                console.error(e);
                return Promise.reject(e.message);
            });

    }

}
