import React, { FunctionComponent, useMemo, useState } from 'react';
import { find } from 'lodash';
import { useQuery } from 'react-query';

import { i18nMessagesPrefix } from './common';
import type { SharedDeploymentsViewWidgetConfiguration } from './configuration';
import DetailsPane from './detailsPane';
import { DeploymentsTable } from './table';

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
            onSuccess: data => {
                const context = toolbox.getContext();
                // TODO(RD-1830): detect if deploymentId is not present in the current page and reset it.
                // Do that only if `fetchData` was called from `DataTable`. If it's just polling,
                // then don't reset it (because user may be interacting with some other component)
                if (context.getValue('deploymentId') === undefined && data.items.length > 0) {
                    context.setValue('deploymentId', data.items[0].id);
                }
            },
            refetchInterval: widget.configuration.customPollingTime * 1000,
            keepPreviousData: true
        }
    );

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

    const selectedDeployment = find(deploymentsResult.data.items, {
        // NOTE: type assertion since lodash has problems receiving string[] in the object
        id: toolbox.getContext().getValue('deploymentId') as string | undefined
    });

    return (
        <div className="grid">
            <DeploymentsTable
                setGridParams={setGridParams}
                toolbox={toolbox}
                loadingIndicatorVisible={fetchingRules || deploymentsResult.isFetching}
                pageSize={widget.configuration.pageSize}
                totalSize={deploymentsResult.data.metadata.pagination.total}
                deployments={deploymentsResult.data.items}
                fieldsToShow={widget.configuration.fieldsToShow}
            />
            <DetailsPane deployment={selectedDeployment} widget={widget} toolbox={toolbox} />
        </div>
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
            type: 'label',
            key: 'csys-obj-parent',
            operator: 'any_of',
            values: [parentDeploymentId]
        }
    } as const;
};

const getParentDeploymentId = (drilldownContext: Stage.Types.ReduxState['drilldownContext']) => {
    /**
     * NOTE: drilldownContext contains contexts for each page, starting with
     * the top-level page, and ending with the current page's initial context.
     *
     * Thus, the current page's parent context will be the penultimate entry in the array.
     *
     * It may happen, that the array only contains a single item (if we are on the top-level page).
     */
    if (drilldownContext.length < 2) {
        return undefined;
    }

    const parentPageContext = drilldownContext[drilldownContext.length - 2].context;

    return parentPageContext?.deploymentId as string | undefined;
};
