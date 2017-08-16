/**
 * Created by kinneretzin on 10/11/2016.
 */

import StageUtils from './stageUtils';
import External from './External';
import Internal from './Internal';
import Cookies from 'js-cookie';

export default class Auth {

    static login(username,password) {
        var external = new External({basicAuth: btoa(`${username}:${password}`)});
        return external.doPost(StageUtils.url('/auth/login'), null, {username, password}, true, null, true);
    }

    static logout(managerData) {
        var internal = new Internal(managerData);
        return internal.doPost('/auth/logout', null, null, true, null, true);
    }

    static isLoggedIn(managerData){
        return !!managerData && !!managerData.auth && !!Cookies.get('XSRF-TOKEN');
    }
}
