import _ from 'lodash';
import { useSelector } from 'react-redux';
import type { SimpleWidgetObj } from '../actions/page';
import { getWidgetDefinitionById } from '../actions/page';

import type { ReduxState } from '../reducers';
import stageUtils from '../utils/stageUtils';

export default function useWidgetsFilter() {
    const { manager, widgetDefinitions } = useSelector((state: ReduxState) =>
        _.pick(state, 'manager', 'widgetDefinitions')
    );

    return (widgets: SimpleWidgetObj[]) =>
        _.filter(widgets, widget => {
            if (!widget.definition) {
                return false;
            }
            const resolvedDefinition = getWidgetDefinitionById(widget.definition, widgetDefinitions);

            return (
                resolvedDefinition &&
                stageUtils.isUserAuthorized(resolvedDefinition.permission, manager) &&
                stageUtils.isWidgetPermitted(resolvedDefinition.supportedEditions, manager)
            );
        });
}
