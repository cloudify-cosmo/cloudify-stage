import _ from 'lodash';
import type { CallHistoryMethodAction } from 'connected-react-router';
import { push } from 'connected-react-router';
import type { GetUserAppResponse, PostUserAppRequestBody, PostUserAppResponse } from 'backend/routes/UserApp.types';
import type { AppDataPage, AppDataPageGroup } from 'backend/db/models/UserAppsModel.types';
import type { PayloadAction, ReduxThunkAction } from './types';
import { ActionType } from './types';
import { createPagesFromTemplate, createPagesMap } from './pageMenu';
import type { SetAppErrorAction, SetAppLoadingAction } from './app';
import { setAppLoading, showAppError } from './app';
import Internal from '../utils/Internal';
import Consts from '../utils/consts';
import UserAppDataAutoSaver from '../utils/UserAppDataAutoSaver';

type Pages = (AppDataPage | AppDataPageGroup)[];
export type SetPagesAction = PayloadAction<{ pages: Pages; receivedAt: number }, ActionType.SET_PAGES>;

function setPages(pages: Pages): SetPagesAction {
    return {
        type: ActionType.SET_PAGES,
        payload: {
            pages,
            receivedAt: Date.now()
        }
    };
}

export function resetPages(): ReduxThunkAction<
    void,
    SetPagesAction | SetAppLoadingAction | SetAppErrorAction | CallHistoryMethodAction
> {
    return dispatch => {
        const autoSaver = UserAppDataAutoSaver.getAutoSaver();
        autoSaver?.stop();
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
                dispatch(showAppError(err.message));
                throw err;
            })
            .finally(() => {
                if (autoSaver) {
                    autoSaver.initFromStore();
                    autoSaver.start();
                }
            });
    };
}

export function resetPagesForTenant(tenant: string): ReduxThunkAction<void | Promise<GetUserAppResponse>, never> {
    return (dispatch, getState) => {
        const { manager } = getState();
        if (_.get(manager, 'tenants.selected', Consts.DEFAULT_ALL) === tenant) {
            return dispatch(resetPages());
        }
        const internal = new Internal(getState().manager);
        return internal.doGet<GetUserAppResponse>('ua/clear-pages', { params: { tenant } });
    };
}

export function loadOrCreateUserAppData(): ReduxThunkAction<Promise<SetPagesAction | void>, SetPagesAction> {
    return (dispatch, getState) => {
        const { manager } = getState();

        const internal = new Internal(manager);
        return internal.doGet<GetUserAppResponse>('/ua').then(userApp => {
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

export function reloadUserAppData(): ReduxThunkAction<
    Promise<SetPagesAction | void>,
    SetAppLoadingAction | CallHistoryMethodAction
> {
    return (dispatch, getState) => {
        dispatch(setAppLoading(true));

        return dispatch(loadOrCreateUserAppData()).then(() => {
            const state = getState();
            const { currentPageId } = state.app;
            const { pages: pageMenuItems } = state;

            const pagesMap = createPagesMap(pageMenuItems);
            const pagePath =
                currentPageId && pagesMap[currentPageId] ? `/page/${currentPageId}` : Consts.PAGE_PATH.HOME;

            dispatch(push(pagePath));
            dispatch(setAppLoading(false));
        });
    };
}

export function saveUserAppData(): ReduxThunkAction<Promise<PostUserAppResponse>, never> {
    return (_dispatch, getState) => {
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
