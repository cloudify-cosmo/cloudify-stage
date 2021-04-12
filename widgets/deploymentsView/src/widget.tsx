import { find } from 'lodash';
import { FunctionComponent, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

export interface DeploymentsViewWidgetConfiguration
    extends Stage.Common.DeploymentsView.Configuration.SharedDeploymentsViewWidgetConfiguration {
    filterId?: string;
    filterByParentDeployment: boolean;
}

const {
    Common: { i18nPrefix },
    Table: { DeploymentsTable },
    Configuration: { sharedConfiguration },
    DetailsPane,
    sharedDefinition
} = Stage.Common.DeploymentsView;

Stage.defineWidget<never, never, DeploymentsViewWidgetConfiguration>({
    ...sharedDefinition,

    id: 'deploymentsView',
    name: Stage.i18n.t(`${i18nPrefix}.name`),
    description: Stage.i18n.t(`${i18nPrefix}.description`),

    initialConfiguration: [
        ...sharedConfiguration,
        {
            id: 'filterId',
            // TODO(RD-1851): add autocomplete instead of plain text input
            type: Stage.Basic.GenericField.STRING_TYPE,
            name: Stage.i18n.t(`${i18nPrefix}.configuration.filterId.name`)
        },
        {
            id: 'filterByParentDeployment',
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            name: Stage.i18n.t(`${i18nPrefix}.configuration.filterByParentDeployment.name`),
            description: Stage.i18n.t(`${i18nPrefix}.configuration.filterByParentDeployment.description`),
            default: false
        }
    ],

    render(widget, _data, _error, toolbox) {
        return <DeploymentsView widget={widget} toolbox={toolbox} />;
    }
});

const i18nMessagesPrefix = `${i18nPrefix}.messages`;

interface DeploymentsViewProps {
    widget: Stage.Types.Widget<DeploymentsViewWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;
}

const DeploymentsView: FunctionComponent<DeploymentsViewProps> = ({ widget, toolbox }) => {
    const { Loading, ErrorMessage } = Stage.Basic;
    const { i18n } = Stage;
    const { fieldsToShow, pageSize, filterId, filterByParentDeployment, customPollingTime } = widget.configuration;
    const manager = toolbox.getManager();
    const filterRulesUrl = `/filters/deployments/${filterId}`;
    const filterRulesResult = useQuery(
        filterRulesUrl,
        ({ queryKey: url }) =>
            filterId ? manager.doGet(url).then(filtersResponse => filtersResponse.value as unknown[]) : [],
        { refetchOnWindowFocus: false, keepPreviousData: true }
    );
    const [gridParams, setGridParams] = useState<Stage.Types.ManagerGridParams>();
    const filteringByParentDeploymentResult = useFilteringByParentDeployment({ filterByParentDeployment });
    const finalFilterRules = useMemo(() => {
        if (!filterRulesResult.isSuccess) {
            return undefined;
        }
        if (!filteringByParentDeploymentResult.parentDeploymentRule) {
            return filterRulesResult.data;
        }

        return [...filterRulesResult.data, filteringByParentDeploymentResult.parentDeploymentRule];
    }, [filterRulesResult.isSuccess, filterRulesResult.data, filteringByParentDeploymentResult.parentDeploymentRule]);
    const deploymentsUrl = '/searches/deployments';
    const deploymentsResult = useQuery(
        [deploymentsUrl, gridParams, finalFilterRules],
        (): Promise<Stage.Common.DeploymentsView.Types.DeploymentsResponse> =>
            manager.doPost(deploymentsUrl, gridParams, {
                filter_rules: finalFilterRules
            }),
        {
            enabled: filterRulesResult.isSuccess && filteringByParentDeploymentResult.filterable,
            onSuccess: data => {
                const context = toolbox.getContext();
                // TODO(RD-1830): detect if deploymentId is not present in the current page and reset it.
                // Do that only if `fetchData` was called from `DataTable`. If it's just polling,
                // then don't reset it (because user may be interacting with some other component)
                if (context.getValue('deploymentId') === undefined && data.items.length > 0) {
                    context.setValue('deploymentId', data.items[0].id);
                }
            },
            refetchInterval: customPollingTime * 1000,
            keepPreviousData: true
        }
    );

    if (filteringByParentDeploymentResult.missingParentDeploymentId) {
        const i18nMissingParentDeploymentPrefix = `${i18nMessagesPrefix}.missingParentDeploymentId`;

        return (
            <ErrorMessage
                header={i18n.t(`${i18nMissingParentDeploymentPrefix}.header`)}
                error={i18n.t(`${i18nMissingParentDeploymentPrefix}.message`)}
            />
        );
    }

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
                loadingIndicatorVisible={filterRulesResult.isFetching || deploymentsResult.isFetching}
                pageSize={pageSize}
                totalSize={deploymentsResult.data.metadata.pagination.total}
                deployments={deploymentsResult.data.items}
                fieldsToShow={fieldsToShow}
            />
            <DetailsPane deployment={selectedDeployment} widget={widget} toolbox={toolbox} />
        </div>
    );
};

const useFilteringByParentDeployment = ({ filterByParentDeployment }: { filterByParentDeployment: boolean }) => {
    const drilldownContext = ReactRedux.useSelector((state: Stage.Types.ReduxState) => state.drilldownContext);
    const parentDeploymentId = useMemo(() => {
        if (drilldownContext.length < 2) {
            return undefined;
        }

        const parentPageContext = drilldownContext[drilldownContext.length - 2].context;

        return parentPageContext?.deploymentId as string | undefined;
    }, [drilldownContext]);

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
