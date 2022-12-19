import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import type { SharedDeploymentsViewWidgetConfiguration } from '../../../app/widgets/common/deploymentsView/configuration';

export interface DeploymentsViewWidgetConfiguration extends SharedDeploymentsViewWidgetConfiguration {
    filterId?: string | null;
    filterByParentDeployment: boolean;
    mapOpenByDefault?: boolean;
}

const {
    Common: { i18nPrefix },
    Configuration: { getSharedConfiguration },
    sharedDefinition
} = Stage.Common.DeploymentsView;

Stage.defineWidget<never, never, DeploymentsViewWidgetConfiguration>({
    ...sharedDefinition,

    id: 'deploymentsView',
    name: Stage.i18n.t(`${i18nPrefix}.name`),
    description: Stage.i18n.t(`${i18nPrefix}.description`),

    initialConfiguration: [
        ...getSharedConfiguration(),
        {
            id: 'mapOpenByDefault',
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            name: Stage.i18n.t(`${i18nPrefix}.configuration.mapOpenByDefault.name`),
            default: false
        },
        {
            id: 'filterId',
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            name: Stage.i18n.t(`${i18nPrefix}.configuration.filterId.name`),
            component: Stage.Common.Filters.FilterIdDropdown
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
    const { filterId, filterByParentDeployment, mapOpenByDefault } = widget.configuration;
    const {
        DeploymentsView,
        Common: { mapOpenContextKey }
    } = Stage.Common.DeploymentsView;

    useEffect(() => {
        const context = toolbox.getContext();

        // NOTE: do not overwrite the map open state when coming back from a drilled-down page to the parent
        if (context.getValue(mapOpenContextKey) === undefined) {
            context.setValue(mapOpenContextKey, mapOpenByDefault);
        }
    }, [mapOpenByDefault]);

    return (
        <DeploymentsView
            toolbox={toolbox}
            widget={widget}
            filterByParentDeployment={filterByParentDeployment}
            // NOTE: converts null to undefined
            defaultFilterId={filterId ?? undefined}
        />
    );
};
