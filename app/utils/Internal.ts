import _ from 'lodash';
import External from './External';
import Consts from './consts';
import StageUtils from './stageUtils';

export default class Internal extends External {
    buildHeaders(): ReturnType<External['buildHeaders']> {
        if (!this.managerData) {
            return {};
        }

        const headers = {
            tenant: _.get(this.managerData, 'tenants.selected', Consts.DEFAULT_TENANT)
        };

        return headers;
    }

    buildActualUrl(path: string, data: Record<string, any>) {
        return super.buildActualUrl(StageUtils.Url.url(path), data);
    }

    // eslint-disable-next-line class-methods-use-this
    isUnauthorized(response: Response) {
        return response.status === 401;
    }

    // eslint-disable-next-line class-methods-use-this
    isLicenseError(response: Response, body: any) {
        return (
            response.status === 400 &&
            (body.error_code === Consts.NO_LICENSE_ERROR_CODE || body.error_code === Consts.EXPIRED_LICENSE_ERROR_CODE)
        );
    }
}
