import _ from 'lodash';
import type { ThunkAction } from 'redux-thunk';
import type { AnyAction } from 'redux';
import { push } from 'connected-react-router';
import type { PayloadAction } from './types';
import { ActionType } from './types';
import type { PageDefinition } from './page';
import type { PageMenuItem } from './pageMenu';
import { createPagesFromTemplate } from './pageMenu';
import { setAppLoading, setAppError } from './app';
import Internal from '../utils/Internal';
import Consts from '../utils/consts';
import UserAppDataAutoSaver from '../utils/UserAppDataAutoSaver';
import type {
    GetUserAppResponse,
    PostUserAppRequestBody,
    PostUserAppResponse
} from '../../backend/routes/UserApp.types';
import type { AppDataPage, AppDataPageGroup } from '../../backend/db/models/UserAppsModel.types';
import type { ReduxState } from '../reducers';

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

export function resetPages(): ThunkAction<void, ReduxState, never, AnyAction> {
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

export function resetPagesForTenant(
    tenant: string
): ThunkAction<void | Promise<GetUserAppResponse>, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const { manager } = getState();
        if (_.get(manager, 'tenants.selected', Consts.DEFAULT_ALL) === tenant) {
            return dispatch(resetPages());
        }
        const internal = new Internal(getState().manager);
        return internal.doGet<GetUserAppResponse>('ua/clear-pages', { params: { tenant } });
    };
}

export function loadOrCreateUserAppData(): ThunkAction<Promise<SetPagesAction | void>, ReduxState, never, AnyAction> {
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

export function reloadUserAppData(): ThunkAction<Promise<SetPagesAction | void>, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        dispatch(setAppLoading(true));

        return dispatch(loadOrCreateUserAppData()).then(() => {
            const getPageById = (pages: PageMenuItem[], pageId?: string | null) => {
                // TODO(RD-5591): I suspect a bug here. We should probably take into account Page Groups as well
                return _.find(pages, { id: pageId }) as PageDefinition | undefined;
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

export function saveUserAppData(): ThunkAction<Promise<PostUserAppResponse>, ReduxState, never, AnyAction> {
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
