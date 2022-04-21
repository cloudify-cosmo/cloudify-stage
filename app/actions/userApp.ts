// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import { push } from 'connected-react-router';
import * as types from './types';
import { createPagesFromTemplate } from './pageMenu';
import { setAppLoading, setAppError } from './appState';
import { saveUserAppData } from './userAppCommon';
import Internal from '../utils/Internal';
import Consts from '../utils/consts';
import UserAppDataAutoSaver from '../utils/UserAppDataAutoSaver';

function setPages(pages) {
    return {
        type: types.SET_PAGES,
        pages,
        receivedAt: Date.now()
    };
}

export function resetPages() {
    return dispatch => {
        const autoSaver = UserAppDataAutoSaver.getAutoSaver();
        autoSaver.stop();
        // First clear the pages
        dispatch(setAppLoading(true));
        dispatch(setPages([]));
        return dispatch(createPagesFromTemplate())
            .then(() => {
                dispatch(saveUserAppData()).then(() => {
                    dispatch(setAppLoading(false));
                    dispatch(push(Consts.PAGE_PATH.HOME));
                });
            })
            .catch(err => {
                dispatch(setAppError(err.message));
                dispatch(push(Consts.PAGE_PATH.ERROR));
                throw err;
            })
            .finally(() => {
                autoSaver.initFromStore();
                autoSaver.start();
            });
    };
}

export function resetPagesForTenant(tenant) {
    return (dispatch, getState) => {
        const { manager } = getState();
        if (_.get(manager, 'tenants.selected', Consts.DEFAULT_ALL) === tenant) {
            return dispatch(resetPages());
        }
        const internal = new Internal(getState().manager);
        return internal.doGet('ua/clear-pages', { params: { tenant } });
    };
}

export function loadOrCreateUserAppData() {
    return (dispatch, getState) => {
        const { manager } = getState();

        const internal = new Internal(manager);
        return internal.doGet('/ua').then(userApp => {
            if (
                userApp &&
                userApp.appDataVersion === Consts.APP_VERSION &&
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
    return (dispatch, getState) => {
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
                dispatch(push(Consts.PAGE_PATH.HOME));
            } else if (page.isDrillDown) {
                const parent = getPageById(pages, page.parent);
                if (!parent) {
                    dispatch(push(Consts.PAGE_PATH.HOME));
                } else {
                    dispatch(push(`/page/${parent.id}`));
                }
            }

            dispatch(setAppLoading(false));
        });
    };
}
