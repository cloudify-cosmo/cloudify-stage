import log from 'loglevel';
import type { ThunkAction } from 'redux-thunk';
import type { AnyAction } from 'redux';
import { loadTemplates } from './templates';
import { loadWidgetDefinitions } from './widgets';

import { loadOrCreateUserAppData } from './userApp';
import { getIdentityProviders } from './manager/auth';
import { getClusterStatus } from './manager/clusterStatus';
import type { ReduxState } from '../reducers';
import { setAppError, setAppLoading } from './app';

export default function intialPageLoad(): ThunkAction<Promise<void>, ReduxState, never, AnyAction> {
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
