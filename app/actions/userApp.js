/**
 * Created by kinneretzin on 21/02/2017.
 */

import { push } from 'connected-react-router';
import * as types from './types';
import { createPagesFromTemplate } from './page';
import { setAppLoading, setAppError } from './app';
import Internal from '../utils/Internal';
import Consts from '../utils/consts';

const CURRENT_APP_DATA_VERSION = 4;

function setPages(pages) {
    return {
        type: types.SET_PAGES,
        pages,
        receivedAt: Date.now()
    };
}

export function resetPagesForTenant(tenant) {
    return function(dispatch, getState) {
        const { manager } = getState();
        if (_.get(manager, 'tenants.selected', Consts.DEFAULT_ALL) === tenant) {
            dispatch(resetPages());
        } else {
            const internal = new Internal(getState().manager);
            return internal.doGet('ua/clear-pages', { tenant });
        }
    };
}

export function saveUserAppData(manager, appData) {
    return function() {
        const data = { appData, version: CURRENT_APP_DATA_VERSION };

        const internal = new Internal(manager);
        return internal.doPost('/ua', null, data);
    };
}

export function resetPages() {
    return function(dispatch) {
        // First clear the pages
        dispatch(setAppLoading(true));
        dispatch(setPages([]));
        return dispatch(createPagesFromTemplate())
            .then(() => {
                dispatch(setAppLoading(false));
                dispatch(push(Consts.HOME_PAGE_PATH));
            })
            .catch(err => {
                dispatch(setAppError(err.message));
                dispatch(push(Consts.ERROR_PAGE_PATH));
                throw err;
            });
    };
}

export function loadOrCreateUserAppData() {
    return function(dispatch, getState) {
        const { manager } = getState();

        const internal = new Internal(manager);
        return internal.doGet('/ua').then(userApp => {
            if (
                userApp &&
                userApp.appDataVersion === CURRENT_APP_DATA_VERSION &&
                userApp.appData.pages &&
                userApp.appData.pages.length > 0
            ) {
                return dispatch(setPages(userApp.appData.pages));
            }
            return dispatch(resetPages());
        });
    };
}

export function reloadUserAppData() {
    return function(dispatch, getState) {
        dispatch(setAppLoading(true));

        return dispatch(loadOrCreateUserAppData()).then(() => {
            const getPageById = (pages, pageId) => {
                return _.find(pages, { id: pageId });
            };

            const state = getState();
            const { currentPageId } = state.app;
            const { pages } = state;
            const page = getPageById(pages, currentPageId);
            if (!page) {
                dispatch(push(Consts.HOME_PAGE_PATH));
            } else if (page.isDrillDown) {
                const parent = getPageById(pages, page.parent);
                if (!parent) {
                    dispatch(push(Consts.HOME_PAGE_PATH));
                } else {
                    dispatch(push(`/page/${parent.id}`));
                }
            }

            dispatch(setAppLoading(false));
        });
    };
}
