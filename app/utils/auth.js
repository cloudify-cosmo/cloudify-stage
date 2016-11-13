/**
 * Created by kinneretzin on 10/11/2016.
 */

import fetch from 'isomorphic-fetch';
import config from '../config.json';


export default class Auth {
    static login(managerIp,username,password) {

        return fetch(`http://${config.proxyIp}:8000/?su=http://${managerIp}/api/v2.1/tokens`,
             {
                method: 'GET',
                headers: {
                    'authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                }
            })
            .then(response => response.json())
            .catch((e)=>{
                console.error(e);
                return Promise.reject(e.message);
            })
            .then((data)=> {
                if (data.error_code) {
                    return Promise.reject(data.message);
                }

                return Promise.resolve(data.value);
            });

    }

}
