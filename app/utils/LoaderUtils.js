/**
 * Created by jakub.niezgoda on 13/07/2018.
 */

import Consts from './consts';
import StageUtils from './stageUtils';

export default class LoaderUtils {
    static getResourceUrl(path, isUserResource) {
        return `${isUserResource ? Consts.USER_DATA_PATH : Consts.APP_DATA_PATH}/${path}`;
    }

    static fetchResource(path, isUserResource, parseResponse = true) {
        return fetch(StageUtils.Url.url(LoaderUtils.getResourceUrl(path, isUserResource)), {
            credentials: 'same-origin'
        }).then(response => {
            if (response.status >= 400) {
                console.error(response.statusText);
                return;
            }
            if (parseResponse) {
                const contentType = _.toLower(response.headers.get('content-type'));
                return contentType.indexOf('application/json') >= 0 ? response.json() : response.text();
            }
            return response;
        });
    }
}
