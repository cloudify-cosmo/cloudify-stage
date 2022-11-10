import _ from 'lodash';
import type { Action } from 'redux';
import type { PayloadAction, ReduxThunkAction } from '../types';
import { ActionType } from '../types';
import Manager from '../../utils/Manager';
import { forEachWidget } from '../page';
import type { PageMenuItem } from '../pageMenu';
import { createPagesMap } from '../pageMenu';

export type FetchClusterStatusRequestAction = Action<ActionType.FETCH_CLUSTER_STATUS_REQUEST>;
// TODO(RD-5591/RD-5755): Add proper typings once Cluster Status API is typed properly
export type FetchClusterStatusSuccessAction = PayloadAction<
    { status: any; services: any },
    ActionType.FETCH_CLUSTER_STATUS_SUCCESS
>;
// TODO(RD-5591/RD-5755): Add proper typings once Cluster Status API is typed properly / Change action name?
export type FetchClusterStatusFailureAction = PayloadAction<any, ActionType.FETCH_CLUSTER_STATUS_FAILURE>;
export type ClusterStatusAction =
    | FetchClusterStatusRequestAction
    | FetchClusterStatusSuccessAction
    | FetchClusterStatusFailureAction;

function fetchClusterStatusRequest(): FetchClusterStatusRequestAction {
    return {
        type: ActionType.FETCH_CLUSTER_STATUS_REQUEST
    };
}

// TODO(RD-5591/RD-5755): Add proper typings once Cluster Status API is typed properly
function fetchClusterStatusSuccess(status: any, services: any): FetchClusterStatusSuccessAction {
    return {
        type: ActionType.FETCH_CLUSTER_STATUS_SUCCESS,
        payload: { status, services }
    };
}

function fetchClusterStatusFailure(error: any): FetchClusterStatusFailureAction {
    return {
        type: ActionType.FETCH_CLUSTER_STATUS_FAILURE,
        payload: error
    };
}

function isClusterStatusWidgetOnPage(pageId: string | null, pageMenuItems: PageMenuItem[]) {
    const pagesMap = createPagesMap(pageMenuItems);
    const clusterStatusWidgetDefinitionName = 'highAvailability';
    let currentPage;
    let widgetPresent = false;

    if (pageId) currentPage = pagesMap[pageId];
    if (currentPage) {
        forEachWidget(currentPage, widget => {
            if (widget.definition === clusterStatusWidgetDefinitionName) widgetPresent = true;
            return widget;
        });
    }

    return widgetPresent;
}

export function getClusterStatus(
    summaryOnly = false
): ReduxThunkAction<
    Promise<void>,
    FetchClusterStatusRequestAction | FetchClusterStatusFailureAction | FetchClusterStatusSuccessAction
> {
    return (dispatch, getState) => {
        const { app, manager, pages } = getState();
        const managerAccessor = new Manager(manager);
        const fetchOnlySummary = summaryOnly && !isClusterStatusWidgetOnPage(app.currentPageId, pages);
        dispatch(fetchClusterStatusRequest());
        return managerAccessor
            .doGet(`/cluster-status?summary=${fetchOnlySummary}`)
            .then(data => {
                const { services, status } = data;
                dispatch(fetchClusterStatusSuccess(status, fetchOnlySummary ? undefined : services));
            })
            .catch(err => {
                dispatch(fetchClusterStatusFailure(err));
            });
    };
}
