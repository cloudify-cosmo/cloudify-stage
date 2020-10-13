/**
 * Created by jakub.niezgoda on 13/07/2018.
 */

import fetch from 'isomorphic-fetch';

import Consts from './consts';
import StageUtils from './stageUtils';

export default class LoaderUtils {
    static getResourceUrl(path, isUserResource) {
        return `${isUserResource ? Consts.USER_DATA_PATH : Consts.APP_DATA_PATH}/${path}`;
    }

    static fetchResource(path, isUserResource) {
        return fetch(StageUtils.Url.url(LoaderUtils.getResourceUrl(path, isUserResource)), {
            credentials: 'same-origin'
        }).then(response => {
            if (response.status >= 400) {
                log.error(response.statusText);
                // TODO: This probably needs refactoring in the future. Right now resolving as we are using Promise.all
                //       to handle all fetches (templates, widgets) it should not be stopped on single failure.
                return Promise.resolve();
            }
            const contentType = _.toLower(response.headers.get('content-type'));
            return contentType.indexOf('application/json') >= 0 ? response.json() : response.text();
        });
    }
}
