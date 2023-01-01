import { concat, filter, get } from 'lodash';

import type { QueryStringParams } from 'backend/sharedUtils';
import type { PaginatedResponse } from 'backend/types';
import { getUrlWithQueryString } from '../../backend/sharedUtils';
import Internal from './Internal';
import StageUtils from './stageUtils';
import Consts from './consts';

const emptyPaginatedResponse: PaginatedResponse<any> = {
    items: [],
    metadata: {
        pagination: {
            offset: 0,
            size: 0,
            total: 0
        }
    }
};

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

    getDistribution() {
        return `${this.getDistributionName().toLowerCase()} ${this.getDistributionRelease().toLowerCase()}`;
    }

    isCommunityEdition() {
        return this.managerData?.version?.edition === Consts.EDITION.COMMUNITY;
    }

    getManagerUrl: Manager['buildActualUrl'] = (url, params) => {
        return this.buildActualUrl(url, params);
    };

    getSelectedTenant() {
        return this.managerData?.tenants?.selected ?? null;
    }

    getSystemRoles() {
        const roles = this.managerData?.roles ?? null;
        return filter(roles, role => role.type === 'system_role');
    }

    buildActualUrl: typeof getUrlWithQueryString = (url, params) => {
        const path = `/sp${getUrlWithQueryString(url, params)}`;
        return StageUtils.Url.url(path);
    };

    doFetchFull<ResponseBodyItem>(
        fetcher: (params: QueryStringParams) => Promise<PaginatedResponse<ResponseBodyItem>>,
        params: QueryStringParams = {},
        fullData: PaginatedResponse<ResponseBodyItem> = { ...emptyPaginatedResponse },
        size = 0
    ): Promise<PaginatedResponse<ResponseBodyItem>> {
        const fetchParams = {
            ...params,
            _size: 1000,
            _offset: size
        };

        return fetcher(fetchParams).then(data => {
            const cumulativeSize = size + data.items.length;
            const totalSize: number = get(data, 'metadata.pagination.total');

            fullData.items = concat(fullData.items, data.items);

            if (totalSize > cumulativeSize) {
                return this.doFetchFull(fetcher, fetchParams, fullData, cumulativeSize);
            }

            return fullData;
        });
    }

    doPostFull<ResponseBodyItem>(url: string, body: any, params?: QueryStringParams) {
        return this.doFetchFull<ResponseBodyItem>(
            currentParams => this.doPost(url, { params: currentParams, body }),
            params
        );
    }

    doGetFull<ResponseBodyItem>(url: string, params?: QueryStringParams) {
        return this.doFetchFull<ResponseBodyItem>(currentParams => this.doGet(url, { params: currentParams }), params);
    }
}
