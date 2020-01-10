import * as types from './types';
import Manager from '../utils/Manager';

export function requestClusterStatus() {
    return {
        type: types.REQ_CLUSTER_STATUS
    };
}

export function setClusterStatus(status, services) {
    return {
        type: types.SET_CLUSTER_STATUS,
        status,
        services
    };
}

export function errorClusterStatus(error) {
    return {
        type: types.ERR_CLUSTER_STATUS,
        error
    };
}

function isClusterStatusWidgetOnPage(pageId, pages) {
    const currentPage = _.find(pages, page => page.id === pageId);
    const clusterStatusWidgetDefinitionName = 'highAvailability';
    const clusterStatusWidgets = _.find(
        _.get(currentPage, 'widgets'),
        widget => widget.definition === clusterStatusWidgetDefinitionName
    );

    return !_.isUndefined(clusterStatusWidgets);
}

export function getClusterStatus(summaryOnly = false) {
    return (dispatch, getState) => {
        const { app, manager, pages } = getState();
        const managerAccessor = new Manager(manager);
        const fetchOnlySummary = summaryOnly && !isClusterStatusWidgetOnPage(app.currentPageId, pages);
        dispatch(requestClusterStatus());
        return managerAccessor
            .doGet(`/cluster-status${fetchOnlySummary ? '?summary=true' : ''}`)
            .then(data => {
                const { services, status } = data;
                dispatch(setClusterStatus(status, fetchOnlySummary ? undefined : services));
            })
            .catch(err => {
                dispatch(errorClusterStatus(err));
            });
    };
}
