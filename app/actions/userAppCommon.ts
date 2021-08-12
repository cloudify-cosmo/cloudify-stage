// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import Consts from '../utils/consts';
import Internal from '../utils/Internal';

export function saveUserAppData() {
    return (dispatch, getState) => {
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

        const body = { appData, version: Consts.APP_VERSION };

        const internal = new Internal(getState().manager);
        return internal.doPost('/ua', { body });
    };
}
