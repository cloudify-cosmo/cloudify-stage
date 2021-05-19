import React, { FunctionComponent, useMemo, useState } from 'react';
import { find } from 'lodash';
import { useQuery } from 'react-query';

import { getParentPageContext, i18nMessagesPrefix, isTopLevelPage, parentDeploymentLabelKey } from './common';
import type { SharedDeploymentsViewWidgetConfiguration } from './configuration';
import DetailsPane from './detailsPane';
import { DeploymentsTable } from './table';
import { FilterRuleOperators, FilterRuleType } from '../filters/types';
import {
    DeploymentDetailsContainer,
    DeploymentsMapLayoutContainer,
    DeploymentsTableContainer,
    DeploymentsViewContainer,
    DeploymentsViewHeaderContainer
} from './layout';
import DeploymentsViewHeader from './header';
import DeploymentsMapContainer from './map';
import SearchActions from '../SearchActions';

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

export const DeploymentsView: FunctionComponent<DeploymentsViewProps> = ({
    toolbox,
    widget,
    filterByParentDeployment,
    additionalFilterRules = [],
    defaultFilterId
}) => {
    const manager = toolbox.getManager();
    const searchActions = new SearchActions(toolbox);
    const [gridParams, setGridParams] = useState<Stage.Types.ManagerGridParams>();
    const [userFilterId, setUserFilterId] = useState<string>();

    const filterRulesResult = (() => {
        const filterId = userFilterId ?? defaultFilterId;
        const filterRulesUrl = `/filters/deployments/${filterId}`;
        const result = useQuery<Stage.Common.Filters.Rule[]>(
            filterRulesUrl,
            ({ queryKey: url }) => (filterId ? manager.doGet(url).then(filtersResponse => filtersResponse.value) : []),
            { refetchOnWindowFocus: false, keepPreviousData: true }
        );

        if (result.isIdle) {
            /**
             * NOTE: handling the `isIdle` state is necessary for TypeScript's type-narrowing to exclude `undefined` from
             * the possible values of `result.data`.
             *
             * Such a case should not happen naturally, unless an `enabled` option is added to `useQuery`. If it is added,
             * it should be here.
             */
            throw new Error('Idle state for fetching filter rules is not implemented.');
        }

        return result;
    })();

    const filterRules = filterRulesResult.data ?? [];
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
    const [mapOpen, toggleMap] = Stage.Hooks.useToggle(widget.configuration.mapOpenByDefault);

    const { Loading, ErrorMessage } = Stage.Basic;
    const { i18n } = Stage;

    if (filterRulesResult.isLoading) {
        return <Loading message={i18n.t(`${i18nMessagesPrefix}.loadingFilterRules`)} />;
    }
    if (filterRulesResult.isError) {
        return (
            <ErrorMessage
                header={i18n.t(`${i18nMessagesPrefix}.errorLoadingFilterRules`)}
                error={filterRulesResult.error as { message: string }}
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

    const context = toolbox.getContext();
    const deployments = deploymentsResult.data.items;
    const selectedDeployment = find(deployments, {
        // NOTE: type assertion since lodash has problems receiving string[] in the object
        // eslint-disable-next-line react/destructuring-assignment
        id: context.getValue('deploymentId') as string | undefined
    });

    if (!selectedDeployment && deployments.length > 0) {
        // NOTE: always select the first visible item
        context.setValue('deploymentId', deployments[0].id);
    }

    return (
        <DeploymentsViewContainer>
            <DeploymentsViewHeaderContainer>
                <DeploymentsViewHeader
                    mapOpen={mapOpen}
                    toggleMap={toggleMap}
                    toolbox={toolbox}
                    onFilterChange={setUserFilterId}
                    filterRules={finalFilterRules}
                />
            </DeploymentsViewHeaderContainer>

            {mapOpen && (
                <DeploymentsMapLayoutContainer height={widget.configuration.mapHeight}>
                    <DeploymentsMapContainer
                        deployments={deploymentsResult.data.items}
                        selectedDeployment={selectedDeployment}
                        toolbox={toolbox}
                        widgetDimensions={widgetDimensions}
                        environmentTypeVisible={widget.configuration.fieldsToShow.includes('environmentType')}
                    />
                </DeploymentsMapLayoutContainer>
            )}

            <DeploymentsTableContainer>
                <DeploymentsTable
                    setGridParams={setGridParams}
                    toolbox={toolbox}
                    loadingIndicatorVisible={filterRulesResult.isFetching || deploymentsResult.isFetching}
                    // eslint-disable-next-line no-underscore-dangle
                    pageSize={gridParams?._size ?? widget.configuration.pageSize}
                    totalSize={deploymentsResult.data.metadata.pagination.total}
                    deployments={deploymentsResult.data.items}
                    fieldsToShow={widget.configuration.fieldsToShow}
                />
            </DeploymentsTableContainer>
            <DeploymentDetailsContainer>
                <DetailsPane deployment={selectedDeployment} widget={widget} toolbox={toolbox} />
            </DeploymentDetailsContainer>
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
