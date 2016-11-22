/**
 * Created by pawelposel on 09/11/2016.
 */

export default class StageUtils {

    static createManagerUrl(proxyIp, managerIp, queryString) {
        let su = encodeURIComponent(`http://${managerIp}${queryString?queryString:''}`);
        return `http://${proxyIp}:8000/?su=${su}`;
    }

}