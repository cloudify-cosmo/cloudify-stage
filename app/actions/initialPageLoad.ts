import log from 'loglevel';
import { loadTemplates } from './templates';
import { loadWidgetDefinitions } from './widgets';

import { loadOrCreateUserAppData } from './userApp';
import type { SetIdentityProvidersAction } from './manager/auth';
import { getIdentityProviders } from './manager/auth';
import { getClusterStatus } from './manager/clusterStatus';
import type { SetAppErrorAction, SetAppLoadingAction } from './app';
import { setAppError, setAppLoading } from './app';
import type { ReduxThunkAction } from './types';

export default function intialPageLoad(): ReduxThunkAction<
    Promise<void>,
    SetAppLoadingAction | SetIdentityProvidersAction | SetAppErrorAction
> {
    return dispatch => {
        dispatch(setAppLoading(true));

        return Promise.all([
            dispatch(loadTemplates()),
            dispatch(loadWidgetDefinitions()),
            dispatch(getClusterStatus()),
            dispatch(getIdentityProviders())
        ])
            .then(() => dispatch(loadOrCreateUserAppData()))
            .then(() => {
                dispatch(setAppLoading(false));
                dispatch(setAppError(null));
            })
            .catch(e => {
                log.error('Error initializing user data. Cannot load page', e);
                dispatch(setAppLoading(false));
                return Promise.reject(e);
            });
    };
}
