import * as types from './types';
import { drillDownWarning } from './templateManagement';
import { createDrilldownPage, selectPage } from './page';
import { addWidget } from './widgets';

export function addWidgetDrilldownPage(widgetId, drillDownName, drillDownPageId) {
    return {
        type: types.ADD_DRILLDOWN_PAGE,
        widgetId,
        drillDownPageId,
        drillDownName
    };
}

export function drillDownToPage(widget, defaultTemplate, widgetDefinitions, drilldownContext, drilldownPageName) {
    return (dispatch, getState) => {
        const isPageEditMode = _.get(getState().templateManagement, 'isPageEditMode');
        if (!_.isUndefined(isPageEditMode)) {
            return dispatch(drillDownWarning(true));
        }

        let pageId = widget.drillDownPages[defaultTemplate.name];
        if (!pageId) {
            const currentPage = _.replace(window.location.pathname, /.*\/page\//, '');
            const newPageId = _.snakeCase(`${currentPage} ${defaultTemplate.name}`);
            const isDrilldownPagePresent = !!_.find(getState().pages, { id: newPageId });

            if (!isDrilldownPagePresent) {
                dispatch(createDrilldownPage(newPageId, defaultTemplate.name));
                _.each(defaultTemplate.widgets, widget => {
                    const widgetDefinition = _.find(widgetDefinitions, { id: widget.definition });
                    dispatch(
                        addWidget(
                            newPageId,
                            widget.name,
                            widgetDefinition,
                            widget.width,
                            widget.height,
                            widget.x,
                            widget.y,
                            widget.configuration
                        )
                    );
                });
            }

            dispatch(addWidgetDrilldownPage(widget.id, defaultTemplate.name, newPageId));
            pageId = newPageId;
        }

        dispatch(selectPage(pageId, true, drilldownContext, drilldownPageName));
    };
}
