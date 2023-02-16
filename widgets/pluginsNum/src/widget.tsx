import React from 'react';
import type { PollingTimeConfiguration } from 'app/utils/GenericConfig';

interface WidgetConfiguration extends PollingTimeConfiguration {
    page: string;
}
type WidgetData = Stage.Types.PaginatedResponse<any>;

Stage.defineWidget<never, WidgetData, WidgetConfiguration>({
    id: 'pluginsNum',
    name: 'Number of plugins',
    description: 'Number of plugins',
    initialWidth: 2,
    initialHeight: 8,
    showHeader: false,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('pluginsNum'),
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        {
            id: 'page',
            name: 'Page to open on click',
            description: 'Page to open when user clicks on widget content',
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            default: 'plugins',
            component: Stage.Shared.PageFilter
        }
    ],
    fetchUrl: '[manager]/plugins?_include=id&_size=1',

    render(widget, data) {
        const { Loading, KeyIndicator } = Stage.Basic;
        const { Link } = Stage.Shared;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        const num = data.metadata.pagination.total;
        const to = widget.configuration.page ? `/page/${widget.configuration.page}` : '/';

        return (
            <Link to={to}>
                <KeyIndicator title="Plugins" icon="plug" number={num} />
            </Link>
        );
    }
});
