import _ from 'lodash';
import { stringify as stringifyQueryString } from 'query-string';
import Const from '../consts';

export default class UrlUtils {
    static appendQueryParam(url: string, data?: Record<string, any>) {
        const prefix = url.includes('?') ? '&' : '?';
        let queryString = '';
        if (data) {
            queryString = prefix + stringifyQueryString(data, { sort: false });
        }
        return `${url}${queryString}`;
    }

    static url(path: string) {
        if (path === Const.PAGE_PATH.HOME) {
            return Const.CONTEXT_PATH;
        }

        return Const.CONTEXT_PATH + (_.startsWith(path, '/') ? '' : '/') + path;
    }

    static isUrl(str: string) {
        // RegEx from: https://stackoverflow.com/questions/1410311/regular-expression-for-url-validation-in-javascript#15734347
        const regexp = /^(ftp|http|https):\/\/[^ "]+$/;

        return regexp.test(str);
    }

    static redirectToPage(url: string) {
        window.open(url, '_blank');
    }

    static widgetResourceUrl(widgetId: string, internalPath: string, isCustom = true, addContextPath = true) {
        return addContextPath
            ? UrlUtils.url(
                  `${isCustom ? Const.USER_DATA_PATH : Const.APP_DATA_PATH}/widgets/${widgetId}${
                      _.startsWith(internalPath, '/') ? '' : '/'
                  }${internalPath}`
              )
            : `${isCustom ? Const.USER_DATA_PATH : Const.APP_DATA_PATH}/widgets/${widgetId}${
                  _.startsWith(internalPath, '/') ? '' : '/'
              }${internalPath}`;
    }
}
