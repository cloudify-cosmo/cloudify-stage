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
        const {
            DeploymentsView,
            Common: { i18nMessagesPrefix, filterRulesContextKey }
        } = Stage.Common.DeploymentsView;
        const filterRules: Stage.Common.Filters.Rule[] | undefined = toolbox
            .getContext()
            .getValue(filterRulesContextKey);
        const { ErrorMessage } = Stage.Basic;

        if (!filterRules || !Array.isArray(filterRules)) {
            const i18nMissingFilterRulesPrefix = `${i18nMessagesPrefix}.missingFilterRules`;

            return (
                <ErrorMessage
                    header={Stage.i18n.t(`${i18nMissingFilterRulesPrefix}.header`)}
                    error={Stage.i18n.t(`${i18nMissingFilterRulesPrefix}.message`)}
                />
            );
        }

        return (
            <DeploymentsView
                toolbox={toolbox}
                widget={widget}
                filterByParentDeployment
                filterRules={filterRules}
                fetchingRules={false}
            />
        );
    }
});
