import type { FunctionComponent } from 'react';

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
        return <DrilledDownDeploymentsViewWidget widget={widget} toolbox={toolbox} />;
    }
});

interface DrilledDownDeploymentsViewWidgetProps {
    widget: Stage.Types.Widget<DrilledDownWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;
}

const DrilledDownDeploymentsViewWidget: FunctionComponent<DrilledDownDeploymentsViewWidgetProps> = ({
    widget,
    toolbox
}) => {
    const {
        DeploymentsView,
        Common: { i18nMessagesPrefix, filterRulesContextKey }
    } = Stage.Common.DeploymentsView;
    const filterRules: Stage.Common.Filters.Rule[] | undefined = toolbox.getContext().getValue(filterRulesContextKey);
    const { ErrorMessage } = Stage.Basic;

    const drilldownContext = ReactRedux.useSelector((state: Stage.Types.ReduxState) => state.drilldownContext);
    const isTopLevelPage = drilldownContext.length < 2;

    if (isTopLevelPage) {
        const i18nTopLevelPagePrefix = `${i18nMessagesPrefix}.unexpectedWidgetUsage`;

        return (
            <ErrorMessage
                header={Stage.i18n.t(`${i18nTopLevelPagePrefix}.header`)}
                error={Stage.i18n.t(`${i18nTopLevelPagePrefix}.message`)}
            />
        );
    }

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
};
