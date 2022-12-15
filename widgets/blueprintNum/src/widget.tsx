export {};

Stage.defineWidget<unknown, unknown, { page?: unknown }>({
    id: 'blueprintNum',
    name: 'Number of blueprints',
    description: 'Number of blueprints',
    initialWidth: 2,
    initialHeight: 8,
    showHeader: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprintNum'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'page',
            name: 'Page to open on click',
            description: 'Page to open when user clicks on widget content',
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            default: 'blueprints',
            component: Stage.Shared.PageFilter
        }
    ],
    fetchUrl: '[manager]/blueprints?_include=id&_size=1',

    render(widget, data) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const { KeyIndicator } = Stage.Basic;
        const { Link } = Stage.Shared;

        const num = _.get(data, 'metadata.pagination.total', 0);
        const to = widget.configuration.page ? `/page/${widget.configuration.page}` : '/';

        return (
            <Link to={to}>
                <KeyIndicator title="Blueprints" icon="file text" number={num} />
            </Link>
        );
    }
});
