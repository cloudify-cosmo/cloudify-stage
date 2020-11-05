import _ from 'lodash';
import * as types from './types';
import { drillDownWarning } from './templateManagement';
import { createDrilldownPage, selectPage, addLayoutToPage } from './page';

export function addWidgetDrilldownPage(widgetId, drillDownName, drillDownPageId) {
    return {
        type: types.ADD_DRILLDOWN_PAGE,
        widgetId,
        drillDownPageId,
        drillDownName
    };
}

export function drillDownToPage(widget, defaultTemplate, drilldownContext, drilldownPageName) {
    return (dispatch, getState) => {
        const isTemplateManagement = _.get(getState().templateManagement, 'isActive');
        if (isTemplateManagement) {
            return dispatch(drillDownWarning(true));
        }

        let pageId = widget.drillDownPages[defaultTemplate.name];
        if (!pageId) {
            const currentPage = _.replace(window.location.pathname, /.*\/page\//, '');
            const newPageId = _.snakeCase(`${currentPage} ${defaultTemplate.name}`);
            const isDrilldownPagePresent = !!_.find(getState().pages, { id: newPageId });

            if (!isDrilldownPagePresent) {
                dispatch(createDrilldownPage(defaultTemplate, newPageId));
                dispatch(addLayoutToPage(defaultTemplate, newPageId));
            }

            dispatch(addWidgetDrilldownPage(widget.id, defaultTemplate.name, newPageId));
            pageId = newPageId;
        }

        return dispatch(selectPage(pageId, true, drilldownContext, drilldownPageName));
    };
}
