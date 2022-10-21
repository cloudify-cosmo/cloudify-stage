// @ts-nocheck File not migrated fully to TS
import { push } from 'connected-react-router';
import _ from 'lodash';
import type { ThunkAction } from 'redux-thunk';
import type { AnyAction } from 'redux';
import { ActionType } from '../types';
import type { SimpleWidgetObj } from '../page';
import { forEachWidget } from '../page';
import Internal from '../../utils/Internal';
import type { ReduxState } from '../../reducers';

type Page = ReduxState['templates']['pagesDef'][string] & { id: string; oldId?: string };

export function createPageId(name: string, pageDefs: ReduxState['templates']['pagesDef']) {
    const ids = _.keysIn(pageDefs);

    // Add suffix to make URL unique if same page name already exists
    let newPageId = _.snakeCase(name.trim());

    let suffix = 1;
    _.each(ids, id => {
        if (id.startsWith(newPageId)) {
            const index = parseInt(id.substring(newPageId.length), 10) || suffix;
            suffix = Math.max(index + 1, suffix + 1);
        }
    });

    if (suffix > 1) {
        newPageId += suffix;
    }

    return newPageId;
}

export function addPage(page: Page) {
    return {
        type: ActionType.ADD_TEMPLATE_PAGE,
        page
    };
}

export function savePage(page: Page): ThunkAction<Promise<any>, ReduxState, never, AnyAction> {
    return dispatch => dispatch(persistPage(page)).then(() => dispatch(push('/template_management')));
}

export function persistPage(page: Page): ThunkAction<Promise<any>, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        function prepareWidgetData(widget: SimpleWidgetObj) {
            return _.pick(widget, 'name', 'width', 'height', 'x', 'y', 'configuration', 'definition');
        }

        const body = _(page).pick('id', 'oldId', 'name', 'icon', 'layout').cloneDeep();
        forEachWidget(body, prepareWidgetData);

        const internal = new Internal(getState().manager);
        return internal
            .doPut('/templates/pages', { body })
            .then(() => {
                dispatch(removePage(page.id));
                if (page.oldId && page.oldId !== page.id) {
                    dispatch(removePage(page.oldId));
                }
            })
            .then(() => dispatch(addPage(_.omit(body, 'oldId'))));
    };
}

export function removePage(pageId: string) {
    return {
        type: ActionType.REMOVE_TEMPLATE_PAGE,
        pageId
    };
}

export function setDrillDownWarningActive(show: boolean) {
    return {
        type: ActionType.PAGE_MANAGEMENT_DRILLDOWN_WARN,
        show
    };
}

export function setPageEditMode(isPageEditMode: boolean) {
    return { type: ActionType.PAGE_MANAGEMENT_SET_EDIT_MODE, isPageEditMode };
}
