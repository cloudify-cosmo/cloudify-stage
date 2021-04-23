import type { FunctionComponent } from 'react';

export interface DeploymentsViewWidgetConfiguration
    extends Stage.Common.DeploymentsView.Configuration.SharedDeploymentsViewWidgetConfiguration {
    filterId?: string;
    filterByParentDeployment: boolean;
}

const {
    Common: { i18nPrefix },
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
    const { DeploymentsView } = Stage.Common.DeploymentsView;
    return (
        <DeploymentsView
            toolbox={toolbox}
            widget={widget}
            filterByParentDeployment={filterByParentDeployment}
            defaultFilterId={filterId}
        />
    );
};
