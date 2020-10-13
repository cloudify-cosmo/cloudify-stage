/**
 * Created by pposel on 11/09/2017.
 */

import { push } from 'connected-react-router';
import * as types from './types';
import { addPage, removePage } from './templates';
import Internal from '../utils/Internal';

export function createPageId(name, pages) {
    const ids = _.keysIn(pages);

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

export function persistPage(page) {
    return (dispatch, getState) => {
        function prepareWidgetData(widget) {
            return {
                ..._.pick(widget, 'name', 'width', 'height', 'x', 'y', 'configuration'),
                definition: widget.definition.id
            };
        }

        const pageData = {
            ..._.pick(page, 'id', 'oldId', 'name'),
            widgets: page.widgets.map(prepareWidgetData),
            tabs: _.map(page.tabs, tab => ({ ...tab, widgets: _.map(tab.widgets, prepareWidgetData) }))
        };

        const internal = new Internal(getState().manager);
        return internal
            .doPut('/templates/pages', {}, pageData)
            .then(() => {
                dispatch(removePage(page.id));
                if (page.oldId && page.oldId !== page.id) {
                    dispatch(removePage(page.oldId));
                }
            })
            .then(() => dispatch(addPage(_.omit(pageData, 'oldId'))));
    };
}

export function savePage(page) {
    return dispatch => dispatch(persistPage(page)).then(() => dispatch(push('/template_management')));
}

export function drillDownWarning(show) {
    return {
        type: types.PAGE_MANAGEMENT_DRILLDOWN_WARN,
        show
    };
}

export function setActive(isActive) {
    return { type: types.TEMPLATE_MANAGEMENT_ACTIVE, isActive };
}

export function setPageEditMode(isPageEditMode) {
    return { type: types.PAGE_MANAGEMENT_SET_EDIT_MODE, isPageEditMode };
}
