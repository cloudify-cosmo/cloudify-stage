import React, { FunctionComponent, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import SplitPane from 'react-split-pane';

import {
    getParentPageContext,
    i18nMessagesPrefix,
    isTopLevelPage,
    mapOpenContextKey,
    parentDeploymentLabelKey
} from './common';
import type { SharedDeploymentsViewWidgetConfiguration } from './configuration';
import DetailsPane from './detailsPane';
import { DeploymentsTable } from './table';
import { FilterRule, FilterRuleOperators, FilterRuleType } from '../filters/types';
import {
    DeploymentDetailsContainer,
    DeploymentsMapLayoutContainer,
    DeploymentsMasterDetailViewContainer,
    DeploymentsTableContainer,
    DeploymentsViewContainer,
    DeploymentsViewHeaderContainer
} from './layout';
import DeploymentsViewHeader from './header';
import DeploymentsMapContainer from './map';
import SearchActions from '../SearchActions';
import getSelectedDeployment from './getSelectedDeployment';
import useFilterQuery from './useFilterQuery';

export interface DeploymentsViewProps {
    widget: Stage.Types.Widget<SharedDeploymentsViewWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;

    filterByParentDeployment: boolean;
    defaultFilterId?: string;
    /**
     * Rules that will be always appended to the rules from `defaultFilterId` or from the filter chosen by the user
     */
    additionalFilterRules?: Stage.Common.Filters.Rule[];
}

const minPaneWidth = 100;

export const DeploymentsView: FunctionComponent<DeploymentsViewProps> = ({
    toolbox,
    widget,
    filterByParentDeployment,
    additionalFilterRules = [],
    defaultFilterId
}) => {
    const searchActions = new SearchActions(toolbox);
    const [gridParams, setGridParams] = useState<Stage.Types.ManagerGridParams>(() =>
        Stage.Utils.mapGridParamsToManagerGridParams({
            sortColumn: widget.configuration.sortColumn,
            sortAscending: widget.configuration.sortAscending,
            pageSize: widget.configuration.pageSize
        })
    );
    const [userFilterRules, setUserFilterRules] = useState<FilterRule[] | undefined>(undefined);

    const defaultFilterRulesResult = useFilterQuery(toolbox, userFilterRules ? undefined : defaultFilterId);

    const filterRules = userFilterRules ?? defaultFilterRulesResult.data?.value ?? [];
    const filteringByParentDeploymentResult = useFilteringByParentDeployment({ filterByParentDeployment });
    const finalFilterRules = useMemo(() => {
        if (!filteringByParentDeploymentResult.parentDeploymentRule) {
            return [...filterRules, ...additionalFilterRules];
        }

        return [...filterRules, ...additionalFilterRules, filteringByParentDeploymentResult.parentDeploymentRule];
    }, [filterRules, filteringByParentDeploymentResult.parentDeploymentRule, additionalFilterRules]);

    const deploymentsUrl = '/searches/deployments';
    const deploymentsResult = useQuery(
        [deploymentsUrl, gridParams, finalFilterRules],
        (): Promise<Stage.Common.DeploymentsView.Types.DeploymentsResponse> =>
            searchActions.doListDeployments(finalFilterRules, gridParams),
        {
            enabled: filteringByParentDeploymentResult.filterable,
            refetchInterval: widget.configuration.customPollingTime * 1000,
            keepPreviousData: true
        }
    );

    Stage.Hooks.useEventListener(toolbox, 'deployments:refresh', deploymentsResult.refetch);

    const widgetDimensions = Stage.Common.Map.useWidgetDimensions(widget);

    const { Loading, ErrorMessage } = Stage.Basic;
    const { i18n } = Stage;

    if (defaultFilterRulesResult.isLoading) {
        return <Loading message={i18n.t(`${i18nMessagesPrefix}.loadingFilterRules`)} />;
    }
    if (defaultFilterRulesResult.isError) {
        return (
            <ErrorMessage
                header={i18n.t(`${i18nMessagesPrefix}.errorLoadingFilterRules`)}
                error={defaultFilterRulesResult.error as { message: string }}
            />
        );
    }

    if (filteringByParentDeploymentResult.missingParentDeploymentId) {
        const i18nMissingParentDeploymentPrefix = `${i18nMessagesPrefix}.missingParentDeploymentId`;

        return (
            <ErrorMessage
                header={i18n.t(`${i18nMissingParentDeploymentPrefix}.header`)}
                error={i18n.t(`${i18nMissingParentDeploymentPrefix}.message`)}
            />
        );
    }

    if (deploymentsResult.isLoading || deploymentsResult.isIdle) {
        return <Loading message={i18n.t(`${i18nMessagesPrefix}.loadingDeployments`)} />;
    }
    if (deploymentsResult.isError) {
        return (
            <ErrorMessage
                header={i18n.t(`${i18nMessagesPrefix}.errorLoadingDeployments`)}
                error={deploymentsResult.error as { message: string }}
            />
        );
    }

    const toolboxContext = toolbox.getContext();
    const deployments = deploymentsResult.data.items;
    const { selectedDeployment, fallbackDeployment } = getSelectedDeployment(
        toolboxContext.getValue('deploymentId'),
        deployments
    );

    if (!selectedDeployment && fallbackDeployment) {
        log.warn(
            'The selected deployment is not visible in the Deployments View table. It will be overridden to the first one in the table'
        );
        toolboxContext.setValue('deploymentId', fallbackDeployment.id);
    }
    // NOTE: use the fallback deployment if it is possible to avoid showing `undefined` as the selected deployment
    const selectedOrFallbackDeployment = selectedDeployment ?? fallbackDeployment;

    const mapOpen = !!(toolboxContext.getValue(mapOpenContextKey) as boolean | undefined);
    const toggleMap = () => toolboxContext.setValue(mapOpenContextKey, !mapOpen);

    return (
        <DeploymentsViewContainer>
            <DeploymentsViewHeaderContainer>
                <DeploymentsViewHeader
                    mapOpen={mapOpen}
                    toggleMap={toggleMap}
                    toolbox={toolbox}
                    onFilterChange={setUserFilterRules}
                    filterRules={finalFilterRules}
                />
            </DeploymentsViewHeaderContainer>

            {mapOpen && (
                <DeploymentsMapLayoutContainer height={widget.configuration.mapHeight}>
                    <DeploymentsMapContainer
                        deployments={deploymentsResult.data.items}
                        selectedDeployment={selectedOrFallbackDeployment}
                        toolbox={toolbox}
                        widgetDimensions={widgetDimensions}
                        environmentTypeVisible={widget.configuration.fieldsToShow.includes('environmentType')}
                    />
                </DeploymentsMapLayoutContainer>
            )}

            <DeploymentsMasterDetailViewContainer>
                <SplitPane
                    minSize={minPaneWidth}
                    maxSize={-minPaneWidth}
                    defaultSize="50%"
                    split="vertical"
                    resizerClassName="master-details-view-resizer"
                >
                    <DeploymentsTableContainer>
                        <DeploymentsTable
                            setGridParams={setGridParams}
                            toolbox={toolbox}
                            loadingIndicatorVisible={
                                defaultFilterRulesResult.isFetching || deploymentsResult.isFetching
                            }
                            // eslint-disable-next-line no-underscore-dangle
                            pageSize={gridParams._size ?? widget.configuration.pageSize}
                            totalSize={deploymentsResult.data.metadata.pagination.total}
                            deployments={deploymentsResult.data.items}
                            fieldsToShow={widget.configuration.fieldsToShow}
                            selectedDeployment={selectedOrFallbackDeployment}
                        />
                    </DeploymentsTableContainer>
                    <DeploymentDetailsContainer>
                        <DetailsPane
                            deployment={selectedOrFallbackDeployment}
                            widget={widget}
                            toolbox={toolbox}
                            mapOpen={mapOpen}
                        />
                    </DeploymentDetailsContainer>
                </SplitPane>
            </DeploymentsMasterDetailViewContainer>
        </DeploymentsViewContainer>
    );
};

const useFilteringByParentDeployment = ({ filterByParentDeployment }: { filterByParentDeployment: boolean }) => {
    const drilldownContext = ReactRedux.useSelector((state: Stage.Types.ReduxState) => state.drilldownContext);
    const parentDeploymentId = useMemo(() => getParentDeploymentId(drilldownContext), [drilldownContext]);

    if (!filterByParentDeployment) {
        return { filterable: true } as const;
    }

    if (!parentDeploymentId) {
        return {
            filterable: false,
            missingParentDeploymentId: true
        } as const;
    }

    return {
        filterable: true,
        parentDeploymentRule: {
            type: FilterRuleType.Label,
            key: parentDeploymentLabelKey,
            operator: FilterRuleOperators.AnyOf,
            values: [parentDeploymentId]
        } as Stage.Common.Filters.Rule
    } as const;
};

const getParentDeploymentId = (drilldownContext: Stage.Types.ReduxState['drilldownContext']) => {
    if (isTopLevelPage(drilldownContext)) {
        return undefined;
    }

    return getParentPageContext(drilldownContext)?.deploymentId as string | undefined;
};
