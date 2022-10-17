/* eslint no-underscore-dangle: ["error", { "allow": ["_size", "_offset"] }] */

import _ from 'lodash';

import type { QueryStringParams } from '../../backend/sharedUtils';
import { getUrlWithQueryString } from '../../backend/sharedUtils';
import Internal from './Internal';
import StageUtils from './stageUtils';
import Consts from './consts';
import type { ManagerData } from '../reducers/managerReducer';
import type { PaginatedResponse } from '../../backend/types';

export default class Manager extends Internal {
    constructor(private managerData: ManagerData) {
        super();
    }

    getCurrentUsername() {
        return this.managerData.auth.username;
    }

    getCurrentUserRole() {
        return this.managerData.auth.role;
    }

    getDistributionName() {
        return this.managerData.version.distribution;
    }

    getDistributionRelease() {
        return this.managerData.version.distro_release;
    }

    isCommunityEdition() {
        return this.managerData.version.edition === Consts.EDITION.COMMUNITY;
    }

    getManagerUrl(url: string, data?: QueryStringParams) {
        return this.buildActualUrl(url, data);
    }

    getSelectedTenant() {
        return this.managerData.tenants.selected;
    }

    getSystemRoles() {
        const roles = this.managerData?.roles ?? null;
        return _.filter(roles, role => role.type === 'system_role');
    }

    // eslint-disable-next-line class-methods-use-this
    buildActualUrl(url: string, data?: QueryStringParams) {
        const path = `/sp${getUrlWithQueryString(url, data)}`;
        return StageUtils.Url.url(path);
    }

    doFetchFull<ResponseBodyItem>(
        fetcher: (params: QueryStringParams) => Promise<PaginatedResponse<ResponseBodyItem>>,
        params: QueryStringParams = {},
        fullData: PaginatedResponse<ResponseBodyItem> = {
            items: [],
            metadata: {
                pagination: {
                    offset: 0,
                    size: 0,
                    total: 0
                }
            }
        },
        size = 0
    ): Promise<PaginatedResponse<ResponseBodyItem>> {
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
            fullData.metadata.pagination.total = totalSize;

            if (totalSize > cumulativeSize) {
                return this.doFetchFull(fetcher, fetchParams, fullData, cumulativeSize);
            }
            return fullData;
        });
    }

    doPostFull<ResponseBody, RequestQueryParams extends QueryStringParams>(
        url: string,
        body: ResponseBody,
        params?: RequestQueryParams
    ) {
        return this.doFetchFull(currentParams => this.doPost(url, { params: currentParams, body }), params);
    }

    doGetFull<RequestQueryParams extends QueryStringParams>(url: string, params?: RequestQueryParams) {
        return this.doFetchFull(currentParams => this.doGet(url, { params: currentParams }), params);
    }
}
