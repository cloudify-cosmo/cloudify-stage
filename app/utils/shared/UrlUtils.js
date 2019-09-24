/**
 * Created by jakub.niezgoda on 06/02/2019.
 */

import _ from 'lodash';
import Const from '../consts';

export default class UrlUtils {
    static url(path) {
        if (path === Const.HOME_PAGE_PATH) {
            return Const.CONTEXT_PATH;
        }

        return Const.CONTEXT_PATH + (_.startsWith(path, '/') ? '' : '/') + path;
    }

    static isUrl(str) {
        // RegEx from: https://stackoverflow.com/questions/1410311/regular-expression-for-url-validation-in-javascript#15734347
        const regexp = /^(ftp|http|https):\/\/[^ "]+$/;

        return regexp.test(str);
    }

    static redirectToPage(url) {
        window.open(url, '_blank');
    }

    static widgetResourceUrl(widgetId, internalPath, isCustom = true, addContextPath = true) {
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
