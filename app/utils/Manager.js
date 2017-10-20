/**
 * Created by kinneretzin on 22/11/2016.
 */

import Internal from './Internal';
import StageUtils from './stageUtils';

export default class Manager extends Internal {

    constructor(managerData) {
        super(managerData);
    }

    getIp() {
        return _.get(this,'_data.ip', null);
    }

    getCurrentUsername() {
        return _.get(this,'_data.username', null);
    }

    getManagerUrl(url,data) {
        return this._buildActualUrl(url,data);
    }

    getSelectedTenant() {
        return _.get(this,'_data.tenants.selected', null);
    }

    getSystemRoles() {
        var roles = _.get(this,'_data.roles', null);
        return _.filter(roles, (role) => role.type === 'system_role');
    }

    _buildActualUrl(url,data) {
        let index = url.indexOf('[manager]');
        if (index >= 0) {
            let managerUrl = url.substring(index + '[manager]'.length);
            var urlInServer = encodeURIComponent(managerUrl);

            url = url.substring(0, index);

            data = Object.assign({}, data, {su:urlInServer});
            var queryString =  (url.indexOf('?') > 0?(_.endsWith(url, '?')?'':'&'):'?') + $.param(data, true);

            return url + queryString;
        } else {
            var queryString =  data ? (url.indexOf('?') > 0?'&':'?') + $.param(data, true) : '';
            var urlInServer = encodeURIComponent(url + queryString);

            return StageUtils.url(`/sp/?su=${urlInServer}`);
        }
    }

    doGetFull(url,params={},parseResponse=true,fullData = {items:[]}, size = 0) {
        params._size = 1000;
        params._offset = size;

        var pr = this.doGet(url,params,parseResponse);

        return pr.then(data=>{
            size += data.items.length;
            fullData.items = _.concat(fullData.items,data.items);
            var total = _.get(data, 'metadata.pagination.total');

            if (total > size) {
                return this.doGetFull(url,params,parseResponse,fullData,size);
            } else {
                return fullData;
            }
        });

    }
}
