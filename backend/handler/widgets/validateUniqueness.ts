import _ from 'lodash';
import { getBuiltInWidgets, getUserWidgets } from './WidgetsHandler';

function getAllWidgets() {
    return _.concat(getBuiltInWidgets(), getUserWidgets());
}

export default function validateUniqueness(widgetId: string) {
    const widgets = getAllWidgets();
    if (_.indexOf(widgets, widgetId) >= 0) {
        return Promise.reject({ status: 422, message: `Widget ${widgetId} is already installed` });
    }

    return Promise.resolve();
}
