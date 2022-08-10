// @ts-nocheck File not migrated fully to TS
/* eslint no-underscore-dangle: ["error", { "allow": ["_size", "_offset"] }] */

import _ from 'lodash';

import { getUrlWithQueryString } from '../../backend/sharedUtils';
import Internal from './Internal';
import StageUtils from './stageUtils';
import Consts from './consts';

export default class Manager extends Internal {
    getCurrentUsername() {
        return this.managerData?.auth?.username ?? null;
    }

    getCurrentUserRole() {
        return this.managerData?.auth?.role ?? null;
    }

    getDistributionName() {
        return this.managerData?.version?.distribution ?? null;
    }

    getDistributionRelease() {
        return this.managerData?.version?.distro_release ?? null;
    }

    isCommunityEdition() {
        return this.managerData?.version?.edition === Consts.EDITION.COMMUNITY;
    }

    getManagerUrl(url, data?) {
        return this.buildActualUrl(url, data);
    }

    getSelectedTenant() {
        return this.managerData?.tenants?.selected ?? null;
    }

    getSystemRoles() {
        const roles = this.managerData?.roles ?? null;
        return _.filter(roles, role => role.type === 'system_role');
    }

    // eslint-disable-next-line class-methods-use-this
    buildActualUrl(url, data?) {
        const path = `/sp${getUrlWithQueryString(url, data)}`;
        return StageUtils.Url.url(path);
    }

    doFetchFull(fetcher, params = {}, fullData = { items: [] }, size = 0) {
        const fetchParams = {
            ...params,
            _size: 1000,
            _offset: size
        };

        const pr = fetcher(fetchParams);

        return pr.then(data => {
            const cumulativeSize = size + data.items.length;
            const totalSize = _.get(data, 'metadata.pagination.total');

            fullData.items = _.concat(fullData.items, data.items);

            if (totalSize > cumulativeSize) {
                return this.doFetchFull(fetcher, fetchParams, fullData, cumulativeSize);
            }
            return fullData;
        });
    }

    doPostFull(url, params, body) {
        return this.doFetchFull(currentParams => this.doPost(url, { params: currentParams, body }), params);
    }

    doGetFull(url, params) {
        return this.doFetchFull(currentParams => this.doGet(url, { params: currentParams }), params);
    }
}
