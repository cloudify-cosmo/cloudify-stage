/**
 * Created by kinneretzin on 10/11/2016.
 */

import fetch from 'isomorphic-fetch';
import Manager from './Manager';
import Consts from './consts';
import External from './External';

export default class Auth {

    static login(managerIp,username,password) {

        return this._getApiVersion(managerIp,username,password)
                .then((versions)=> {
                    return this._getLoginToken(managerIp, username, password, versions.apiVersion, versions.serverVersion);
                })
                .then(data=>{
                    return {
                        token: data.token,
                        apiVersion: data.apiVersion,
                        serverVersion: data.serverVersion,
                        role: data.role
                    }
                });

    }

    static _getApiVersion(managerIp,username,password) {

        var external = new External({basicAuth : btoa(`${username}:${password}`)});
        return external.doGet(new Manager({ip:managerIp}).getManagerUrl("/version"))
            .then((data)=> {
                if (data.error_code) {
                    return Promise.reject(data);
                }

                return Promise.resolve(data.version);
            })
            .then((serverVersion)=> {
                /*
                    (0 - 3.2.1] -> v1
                    (3.2.1 - 3.3.1] -> v2
                    (3.3.1 - 3.4.x] -> v2.1
                    (3.4.x - 4.0.x] -> v3
                */

                const mapping = [
                    {left: "0.0.0", right: "3.2.1", apiVersion: "v1"},
                    {left: "3.2.1", right: "3.3.1", apiVersion: "v2"},
                    {left: "3.3.1", right: "3.4.100", apiVersion: "v2.1"},
                    {left: "3.4.100", right: "4.0.100", apiVersion: "v3"},
                ];

                function _fill(v) {
                    return _.padEnd(_.defaultTo(v, '0'), 3, '0');
                }

                function _number(value) {
                    let v = _.words(value);
                    return _.toNumber(_fill(v[0]) + _fill(v[1]) + _fill(v[2]));
                }

                let verNum = _number(serverVersion);
                let apiVer = null;
                _.each(mapping,m=>{
                    let leftNum = _number(m.left);
                    let rightNum = _number(m.right);
                    if (verNum > leftNum && verNum <= rightNum) {
                        apiVer = m.apiVersion;
                        return false;
                    }
                })

                if (apiVer) {
                    return Promise.resolve({apiVersion: apiVer, serverVersion});
                } else {
                    throw Error(`Cannot determine API version from server version ${serverVersion}`);
                }
            })
            .catch((e)=>{
                console.error(e);
                return Promise.reject(e.message);
            });
    }

    static _getLoginToken(managerIp,username,password,apiVersion,serverVersion) {

        var external = new External({basicAuth : btoa(`${username}:${password}`)});
        return external.doGet(new Manager({ip:managerIp}).getManagerUrl("/tokens"))
            .then((data)=> {
                if (data.error_code) {
                    return Promise.reject(data);
                }

                return Promise.resolve({token: data.value, role: data.role, apiVersion, serverVersion});
            })
            .catch((e)=>{
                console.error(e);
                return Promise.reject(e.message);
            });

    }

    static isLoggedIn(managerData) {
        return (managerData && managerData.auth && managerData.auth.token);
    }
}
