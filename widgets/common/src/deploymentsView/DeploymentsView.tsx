import React, { FunctionComponent, useMemo, useState } from 'react';
import { find } from 'lodash';
import { useQuery } from 'react-query';

import { getParentPageContext, i18nMessagesPrefix, isTopLevelPage } from './common';
import type { SharedDeploymentsViewWidgetConfiguration } from './configuration';
import DetailsPane from './detailsPane';
import { DeploymentsTable } from './table';
import { FilterRuleOperators, FilterRuleType } from '../filters/types';
import {
    DeploymentDetailsContainer,
    DeploymentsMapContainer,
    DeploymentsTableContainer,
    DeploymentsViewContainer,
    DeploymentsViewHeaderContainer
} from './layout';
import DeploymentsViewHeader from './header';

export interface DeploymentsViewProps {
    widget: Stage.Types.Widget<SharedDeploymentsViewWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;

    filterByParentDeployment: boolean;
    filterRules: Stage.Common.Filters.Rule[];
    fetchingRules: boolean;
}

export const DeploymentsView: FunctionComponent<DeploymentsViewProps> = ({
    toolbox,
    widget,
    filterByParentDeployment,
    filterRules,
    fetchingRules
}) => {
    const manager = toolbox.getManager();
    const [gridParams, setGridParams] = useState<Stage.Types.ManagerGridParams>();

    const filteringByParentDeploymentResult = useFilteringByParentDeployment({ filterByParentDeployment });
    const finalFilterRules = useMemo(() => {
        if (!filteringByParentDeploymentResult.parentDeploymentRule) {
            return filterRules;
        }

        return [...filterRules, filteringByParentDeploymentResult.parentDeploymentRule];
    }, [filterRules, filteringByParentDeploymentResult.parentDeploymentRule]);

    const deploymentsUrl = '/searches/deployments';
    const deploymentsResult = useQuery(
        [deploymentsUrl, gridParams, finalFilterRules],
        (): Promise<Stage.Common.DeploymentsView.Types.DeploymentsResponse> =>
            manager.doPost(deploymentsUrl, gridParams, {
                filter_rules: finalFilterRules
            }),
        {
            enabled: filteringByParentDeploymentResult.filterable,
            refetchInterval: widget.configuration.customPollingTime * 1000,
            keepPreviousData: true
        }
    );

    Stage.Hooks.useEventListener(toolbox, 'deployments:refresh', deploymentsResult.refetch);

    const [mapOpen, toggleMap] = Stage.Hooks.useToggle(false);

    const { Loading, ErrorMessage } = Stage.Basic;
    const { i18n } = Stage;

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
                <DeploymentsViewHeader mapOpen={mapOpen} toggleMap={toggleMap} />
            </DeploymentsViewHeaderContainer>

            {mapOpen && <DeploymentsMapContainer>Hey, I am a map</DeploymentsMapContainer>}

            <DeploymentsTableContainer>
                <DeploymentsTable
                    setGridParams={setGridParams}
                    toolbox={toolbox}
                    loadingIndicatorVisible={fetchingRules || deploymentsResult.isFetching}
                    pageSize={widget.configuration.pageSize}
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
            key: 'csys-obj-parent',
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
