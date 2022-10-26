import type { CallHistoryMethodAction } from 'connected-react-router';
import { push } from 'connected-react-router';
import _ from 'lodash';
import type { PayloadAction, ReduxThunkAction } from '../types';
import { ActionType } from '../types';
import type { SimpleWidgetObj } from '../page';
import { forEachWidget } from '../page';
import Internal from '../../utils/Internal';
import type { ReduxState } from '../../reducers';
import type { TemplatesState } from '../../reducers/templatesReducer';

type Page = TemplatesState['pagesDef'][string] & { id: string; oldId?: string };

export type AddPageAction = PayloadAction<Page, ActionType.ADD_TEMPLATE_PAGE>;
export type RemovePageAction = PayloadAction<string, ActionType.REMOVE_TEMPLATE_PAGE>;
export type SetDrillDownWarningActiveAction = PayloadAction<boolean, ActionType.PAGE_MANAGEMENT_DRILLDOWN_WARN>;
export type SetPageEditModeAction = PayloadAction<boolean, ActionType.PAGE_MANAGEMENT_SET_EDIT_MODE>;
export type PageAction = AddPageAction | RemovePageAction | SetDrillDownWarningActiveAction | SetPageEditModeAction;

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

export function addPage(page: Page): AddPageAction {
    return {
        type: ActionType.ADD_TEMPLATE_PAGE,
        payload: page
    };
}

export function savePage(page: Page): ReduxThunkAction<Promise<CallHistoryMethodAction>> {
    return dispatch => dispatch(persistPage(page)).then(() => dispatch(push('/template_management')));
}

export function persistPage(page: Page): ReduxThunkAction<Promise<AddPageAction>> {
    return (dispatch, getState) => {
        function prepareWidgetData(widget: SimpleWidgetObj) {
            return _.pick(widget, 'name', 'width', 'height', 'x', 'y', 'configuration', 'definition');
        }

        const body = _(page).pick('id', 'oldId', 'name', 'icon', 'layout').cloneDeep();

        // @ts-ignore TODO: Seems like it's intentional here to end up with non SimpleWidgetObj type
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

export function removePage(pageId: string): RemovePageAction {
    return {
        type: ActionType.REMOVE_TEMPLATE_PAGE,
        payload: pageId
    };
}

export function setDrillDownWarningActive(show: boolean): SetDrillDownWarningActiveAction {
    return {
        type: ActionType.PAGE_MANAGEMENT_DRILLDOWN_WARN,
        payload: show
    };
}

export function setPageEditMode(isPageEditMode: boolean): SetPageEditModeAction {
    return {
        type: ActionType.PAGE_MANAGEMENT_SET_EDIT_MODE,
        payload: isPageEditMode
    };
}
