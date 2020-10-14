/* eslint no-underscore-dangle: ["error", { "allow": ["_size", "_offset"] }] */

import _ from 'lodash';
import Internal from './Internal';
import StageUtils from './stageUtils';
import Consts from './consts';

export default class Manager extends Internal {
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

    // eslint-disable-next-line class-methods-use-this
    buildActualUrl(url, data) {
        const index = url.indexOf('[manager]');
        if (index >= 0) {
            const managerUrl = url.substring(index + '[manager]'.length);
            const urlInServer = encodeURIComponent(managerUrl);
            const urlWithoutWildcard = url.substring(0, index);
            const params = { ...data, su: urlInServer };

            let queryString = '';
            if (urlWithoutWildcard.indexOf('?') > 0) {
                if (!_.endsWith(urlWithoutWildcard, '?')) {
                    queryString += '&';
                }
            } else {
                queryString += '?';
            }
            queryString += $.param(params, true);
            return urlWithoutWildcard + queryString;
        }
        const queryString = data ? (url.indexOf('?') > 0 ? '&' : '?') + $.param(data, true) : '';
        const urlInServer = encodeURIComponent(url + queryString);

        return StageUtils.Url.url(`/sp?su=${urlInServer}`);
    }

    doGetFull(url, params = {}, parseResponse = true, fullData = { items: [] }, size = 0) {
        params._size = 1000;
        params._offset = size;

        const pr = this.doGet(url, params, parseResponse);

        return pr.then(data => {
            const cumulativeSize = size + data.items.length;
            const totalSize = _.get(data, 'metadata.pagination.total');

            fullData.items = _.concat(fullData.items, data.items);

            if (totalSize > cumulativeSize) {
                return this.doGetFull(url, params, parseResponse, fullData, cumulativeSize);
            }
            return fullData;
        });
    }
}
