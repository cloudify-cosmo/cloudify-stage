/* eslint no-underscore-dangle: ["error", { "allow": ["_size", "_offset"] }] */

import Internal from './Internal';
import StageUtils from './stageUtils';
import Consts from './consts';

export default class Manager extends Internal {
    constructor(managerData) {
        super(managerData);
    }

    getIp() {
        return _.get(this, 'data.ip', null);
    }

    getCurrentUsername() {
        return _.get(this, 'data.username', null);
    }

    getCurrentUserRole() {
        return _.get(this, 'data.auth.role', null);
    }

    getDistributionName() {
        return _.get(this, 'data.version.distribution', null);
    }

    getDistributionRelease() {
        return _.get(this, 'data.version.distro_release', null);
    }

    isCommunityEdition() {
        return _.get(this.data, 'version.edition') === Consts.EDITION.COMMUNITY;
    }

    getManagerUrl(url, data) {
        return this.buildActualUrl(url, data);
    }

    getSelectedTenant() {
        return _.get(this, 'data.tenants.selected', null);
    }

    getSystemRoles() {
        const roles = _.get(this, 'data.roles', null);
        return _.filter(roles, role => role.type === 'system_role');
    }

    buildActualUrl(url, data) {
        const index = url.indexOf('[manager]');
        if (index >= 0) {
            const managerUrl = url.substring(index + '[manager]'.length);
            const urlInServer = encodeURIComponent(managerUrl);

            url = url.substring(0, index);

            data = { ...data, su: urlInServer };
            const queryString = (url.indexOf('?') > 0 ? (_.endsWith(url, '?') ? '' : '&') : '?') + $.param(data, true);

            return url + queryString;
        }
        const queryString = data ? (url.indexOf('?') > 0 ? '&' : '?') + $.param(data, true) : '';
        const urlInServer = encodeURIComponent(url + queryString);

        return StageUtils.Url.url(`/sp/?su=${urlInServer}`);
    }

    doGetFull(url, params = {}, parseResponse = true, fullData = { items: [] }, size = 0) {
        params._size = 1000;
        params._offset = size;

        const pr = this.doGet(url, params, parseResponse);

        return pr.then(data => {
            size += data.items.length;
            fullData.items = _.concat(fullData.items, data.items);
            const total = _.get(data, 'metadata.pagination.total');

            if (total > size) {
                return this.doGetFull(url, params, parseResponse, fullData, size);
            }
            return fullData;
        });
    }
}
