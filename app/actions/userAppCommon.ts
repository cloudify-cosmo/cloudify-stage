import _ from 'lodash';
import type { Dispatch, Store } from 'redux';
import type { ReduxState } from '../reducers';
import Consts from '../utils/consts';
import Internal from '../utils/Internal';
import type { PostUserAppRequestBody, PostUserAppResponse } from '../../backend/routes/UserApp.types';

export function saveUserAppData() {
    return (_dispatch: Dispatch, getState: Store<ReduxState>['getState']) => {
        const appData = _(getState()).pick('pages').cloneDeep();

        // Don't save maximized state for widgets in non-default tabs
        _(appData.pages)
            .flatMap('layout')
            .filter({ type: 'tabs' })
            .flatMap('content')
            .reject({ isDefault: true })
            .flatMap('widgets')
            .each(widget => {
                widget.maximized = false;
            });

        const body: PostUserAppRequestBody = { appData, version: Consts.APP_VERSION };

        const internal = new Internal(getState().manager);
        return internal.doPost<PostUserAppResponse, PostUserAppRequestBody>('/ua', { body });
    };
}
