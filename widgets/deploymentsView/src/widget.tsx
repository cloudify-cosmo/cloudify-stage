import type { FunctionComponent } from 'react';
import { useQuery } from 'react-query';

export interface DeploymentsViewWidgetConfiguration
    extends Stage.Common.DeploymentsView.Configuration.SharedDeploymentsViewWidgetConfiguration {
    filterId?: string;
    filterByParentDeployment: boolean;
}

const {
    Common: { i18nPrefix, i18nMessagesPrefix },
    Configuration: { sharedConfiguration },
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
        return <TopLevelDeploymentsView widget={widget} toolbox={toolbox} />;
    }
});

interface TopLevelDeploymentsViewProps {
    widget: Stage.Types.Widget<DeploymentsViewWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;
}

const TopLevelDeploymentsView: FunctionComponent<TopLevelDeploymentsViewProps> = ({ widget, toolbox }) => {
    const { filterId, filterByParentDeployment } = widget.configuration;
    const manager = toolbox.getManager();

    const filterRulesUrl = `/filters/deployments/${filterId}`;
    const filterRulesResult = useQuery<Stage.Common.Filters.Rule[]>(
        filterRulesUrl,
        ({ queryKey: url }) => (filterId ? manager.doGet(url).then(filtersResponse => filtersResponse.value) : []),
        { refetchOnWindowFocus: false, keepPreviousData: true }
    );

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

    if (filterRulesResult.isIdle) {
        /**
         * NOTE: handling the `isIdle` state is necessary for TypeScript's type-narrowing to exclude `undefined` from
         * the possible values of `filterRulesResult.data`.
         *
         * Such a case should not happen naturally, unless an `enabled` option is added to `useQuery`. If it is added,
         * it should be here.
         */
        throw new Error('Idle state for fetching filter rules is not implemented.');
    }

    const { DeploymentsView } = Stage.Common.DeploymentsView;
    return (
        <DeploymentsView
            toolbox={toolbox}
            widget={widget}
            filterByParentDeployment={filterByParentDeployment}
            filterRules={filterRulesResult.data}
            fetchingRules={filterRulesResult.isFetching}
        />
    );
};
