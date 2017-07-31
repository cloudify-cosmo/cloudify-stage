/**
 * Created by kinneretzin on 10/11/2016.
 */

import Manager from './Manager';
import External from './External';

export default class Auth {

    static login(managerIp,username,password) {
        return this._getApiVersion(managerIp,username,password)
                .then((versions)=> {
                    return Promise.all([
                        this._getLoginToken(managerIp, username, password, versions.apiVersion),
                        this._getTenants(managerIp, username, password, versions.apiVersion),
                        versions.serverVersion
                    ]);
                })
                .then(results =>{
                    var tenants = results[1].tenants;
                    /* validate user has at least 1 tenant */
                    if(!tenants.items || tenants.items.length < 1) {
                        return Promise.reject('User has no tenants');
                    }
                    return {
                        token: results[0].token,
                        apiVersion: results[0].apiVersion,
                        serverVersion: results[2],
                        role: results[0].role,
                        tenants: tenants
                    }
                });
    }

    static isLoggedIn(managerData){
        return !!(managerData && managerData.auth && managerData.auth.token);
    }

    static _doExternalGet(username, password, managerIp, url, apiVersion){
        var external = new External({basicAuth: btoa(`${username}:${password}`)});
        return external.doGet(new Manager({ip:managerIp, apiVersion}).getManagerUrl(url));
    }

    static _getApiVersion(managerIp,username,password) {
        return this._doExternalGet(username, password, managerIp, '/version')
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
                    (3.4.x - ...] -> v3
                */

                const mapping = [
                    {startServerVersion: '3.4.0', apiVersion: 'v2.1'},
                    {startServerVersion: '4.0.0', apiVersion: 'v3'},
                    {startServerVersion: '4.1.0', apiVersion: 'v3.1'}
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
                _.eachRight(mapping,m=>{
                    let startNum = _number(m.startServerVersion);
                    if (verNum >= startNum) {
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

    static _getLoginToken(managerIp, username, password, apiVersion){
        return this._doExternalGet(username, password, managerIp, '/tokens', apiVersion)
            .then((data)=> {
                if (data.error_code) {
                    return Promise.reject(data);
                }

                return Promise.resolve({token: data.value, role: data.role, apiVersion});
            })
            .catch((e)=>{
                console.error(e);
                return Promise.reject(e.message);
            });

    }

    static _getTenants(managerIp, username, password, apiVersion){
        return this._doExternalGet(username, password, managerIp, '/tenants', apiVersion)
            .then((data)=> {
                if (data.error_code) {
                    return Promise.reject(data);
                }

                return Promise.resolve({tenants: data});
            })
            .catch((e)=>{
                console.error(e);
                return Promise.reject(e.message);
            });
    }
}
