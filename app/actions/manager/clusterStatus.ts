import _ from 'lodash';
import type { Action } from 'redux';
import type { PayloadAction, ReduxThunkAction } from '../types';
import { ActionType } from '../types';
import Manager from '../../utils/Manager';
import { forEachWidget } from '../page';
import type { PageMenuItem } from '../pageMenu';

export type RequestClusterStatusAction = Action<ActionType.REQ_CLUSTER_STATUS>;
// TODO(RD-5591/RD-5755): Add proper typings once Cluster Status API is typed properly
export type SetClusterStatusAction = PayloadAction<{ status: any; services: any }, ActionType.SET_CLUSTER_STATUS>;
// TODO(RD-5591/RD-5755): Add proper typings once Cluster Status API is typed properly / Change action name?
export type ErrorClusterStatusAction = PayloadAction<any, ActionType.ERR_CLUSTER_STATUS>;
export type ClusterStatusAction = RequestClusterStatusAction | SetClusterStatusAction | ErrorClusterStatusAction;

export function requestClusterStatus(): RequestClusterStatusAction {
    return {
        type: ActionType.REQ_CLUSTER_STATUS
    };
}

// TODO(RD-5591/RD-5755): Add proper typings once Cluster Status API is typed properly
export function setClusterStatus(status: any, services: any): SetClusterStatusAction {
    return {
        type: ActionType.SET_CLUSTER_STATUS,
        payload: { status, services }
    };
}

export function errorClusterStatus(error: any): ErrorClusterStatusAction {
    return {
        type: ActionType.ERR_CLUSTER_STATUS,
        payload: error
    };
}

function isClusterStatusWidgetOnPage(pageId: string | null, pages: PageMenuItem[]) {
    const currentPage = pages.find(page => page.id === pageId);
    const clusterStatusWidgetDefinitionName = 'highAvailability';

    let widgetPresent = false;
    if (currentPage) {
        // @ts-ignore: TODO(RD-5591) Iterate not only over widgets, but also over page groups
        forEachWidget(currentPage, widget => {
            if (widget.definition === clusterStatusWidgetDefinitionName) widgetPresent = true;
            return widget;
        });
    }

    return widgetPresent;
}

export function getClusterStatus(summaryOnly = false): ReduxThunkAction {
    return (dispatch, getState) => {
        const { app, manager, pages } = getState();
        const managerAccessor = new Manager(manager);
        const fetchOnlySummary = summaryOnly && !isClusterStatusWidgetOnPage(app.currentPageId, pages);
        dispatch(requestClusterStatus());
        return managerAccessor
            .doGet(`/cluster-status?summary=${fetchOnlySummary}`)
            .then(data => {
                const { services, status } = data;
                dispatch(setClusterStatus(status, fetchOnlySummary ? undefined : services));
            })
            .catch(err => {
                dispatch(errorClusterStatus(err));
            });
    };
}
