/**
 * Created by pawelposel on 09/11/2016.
 */

export default class CommonUtils {

    static createManagerUrl(managerIp, queryString) {
        let su = encodeURIComponent(`http://${managerIp}${queryString?queryString:''}`);
        return `http://${window.location.hostname}:8088/sp/?su=${su}`;
    }
}