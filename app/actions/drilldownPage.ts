import _ from 'lodash';
import type { AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import { setDrilldownContext } from './drilldownContext';
import { addLayoutToPage } from './page';
import { createDrilldownPage, selectPage } from './pageMenu';
import { setDrillDownWarningActive } from './templateManagement/pages';
import type { PayloadAction } from './types';
import { ActionType } from './types';
import type { ReduxState } from '../reducers';
import type { TemplatePageDefinition } from '../reducers/templatesReducer';
import type { Widget } from '../utils/StageAPI';

export type AddDrilldownPageAction = PayloadAction<
    { widgetId: string; drillDownName: string; drillDownPageId: string },
    ActionType.ADD_DRILLDOWN_PAGE
>;

export function addWidgetDrilldownPage(
    widgetId: string,
    drillDownName: string,
    drillDownPageId: string
): AddDrilldownPageAction {
    return {
        type: ActionType.ADD_DRILLDOWN_PAGE,
        payload: {
            widgetId,
            drillDownPageId,
            drillDownName
        }
    };
}

export function drillDownToPage(
    widget: Widget<unknown>,
    defaultTemplate: TemplatePageDefinition,
    drilldownContext: Record<string, any>,
    drilldownPageName: string
): ThunkAction<void, ReduxState, never, AnyAction> {
    return async (dispatch, getState) => {
        const isTemplateManagement = _.get(getState().templateManagement, 'isActive');
        if (isTemplateManagement) {
            return dispatch(setDrillDownWarningActive(true));
        }

        let pageId = widget.drillDownPages[defaultTemplate.name];
        if (!pageId) {
            const currentPage = _.replace(window.location.pathname, /.*\/page\//, '');
            const newPageId = _.snakeCase(`${currentPage} ${defaultTemplate.name}`);
            const isDrilldownPagePresent = !!_.find(getState().pages, { id: newPageId });

            if (!isDrilldownPagePresent) {
                // @ts-ignore TODO(RD-5591) Fix in the next PR
                dispatch(createDrilldownPage(defaultTemplate, newPageId));
                await dispatch(addLayoutToPage(defaultTemplate, newPageId));
            }

            dispatch(addWidgetDrilldownPage(widget.id, defaultTemplate.name, newPageId));
            pageId = newPageId;
        }

        // Refresh the drilldown context for the current page
        const updatedDrilldownContext = getState().drilldownContext.slice();
        const currentPageDrilldownContext = updatedDrilldownContext.pop() || {};
        updatedDrilldownContext.push({
            ...currentPageDrilldownContext,
            context: getState().context
        });
        dispatch(setDrilldownContext(updatedDrilldownContext));

        return dispatch(selectPage(pageId, true, drilldownContext, drilldownPageName));
    };
}
