// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import { setDrilldownContext } from './drilldownContext';
import { addLayoutToPage } from './page';
import { createDrilldownPage, selectPage } from './pageMenu';
import { setDrillDownWarningActive } from './templateManagement/pages';
import { ActionType } from './types';

export function addWidgetDrilldownPage(widgetId, drillDownName, drillDownPageId) {
    return {
        type: ActionType.ADD_DRILLDOWN_PAGE,
        widgetId,
        drillDownPageId,
        drillDownName
    };
}

export function drillDownToPage(widget, defaultTemplate, drilldownContext, drilldownPageName) {
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
