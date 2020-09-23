/**
 * Created by jakubniezgoda on 23/05/2018.
 */

Stage.defineWidget({
    id: 'executionNum',
    name: 'Number of running executions',
    description: 'Number of running executions',
    initialWidth: 2,
    initialHeight: 8,
    color: 'teal',
    showHeader: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('executionNum'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(10)],
    fetchUrl:
        '[manager]/executions?_include=id&_size=1&' +
        '&status=pending&status=started&status=cancelling&status=force_cancelling&status=kill_cancelling',

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const { KeyIndicator } = Stage.Basic;

        const num = _.get(data, 'metadata.pagination.total', 0);

        return <KeyIndicator title="Running Executions" icon="cogs" number={num} />;
    }
});
