export {};

const {
    Common: { i18nDrillDownPrefix },
    Configuration: { sharedConfiguration },
    sharedDefinition
} = Stage.Common.DeploymentsView;

type DrilledDownWidgetConfiguration = Stage.Common.DeploymentsView.Configuration.SharedDeploymentsViewWidgetConfiguration;

Stage.defineWidget<never, never, DrilledDownWidgetConfiguration>({
    ...sharedDefinition,

    id: 'deploymentsViewDrilledDown',
    name: Stage.i18n.t(`${i18nDrillDownPrefix}.name`),
    description: Stage.i18n.t(`${i18nDrillDownPrefix}.description`),

    initialConfiguration: sharedConfiguration,

    render(widget, _data, _error, toolbox) {
        // TODO(RD-2004): get filter rules from context

        const { DeploymentsView } = Stage.Common.DeploymentsView;
        return (
            <DeploymentsView
                toolbox={toolbox}
                widget={widget}
                filterByParentDeployment
                filterRules={[]}
                fetchingRules={false}
            />
        );
    }
});
