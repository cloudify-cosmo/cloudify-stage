import Actions from './Actions';
import PluginsCatalogList from './PluginsCatalogList';
import type { PluginDescriptionWithVersion, PluginsCatalogWidgetConfiguration } from './types';

type PluginsCatalogResponse = PluginDescriptionWithVersion[];

// TODO Norbert: Migrate labels to the translation file
Stage.defineWidget<unknown, PluginsCatalogResponse | Error, PluginsCatalogWidgetConfiguration>({
    id: 'pluginsCatalog',
    name: 'Plugins Catalog',
    description: 'Shows plugins catalog',
    initialWidth: 12,
    initialHeight: 20,
    color: 'teal',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('pluginsCatalog'),
    initialConfiguration: [
        {
            id: 'jsonPath',
            name: 'Plugins Catalog JSON Source',
            placeHolder: 'Type JSON Path',
            default: Stage.i18n.t('urls.pluginsCatalog'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'sortByName',
            name: 'Sort by name',
            description: 'If set to true, then plugins will be sorted by name.',
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    fetchData(widget, toolbox) {
        const actions = new Actions(toolbox, widget.configuration.jsonPath);

        return actions.doGetPluginsList().catch(e => (e instanceof Error ? e : Error(e)));
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;
        const { NoDataMessage } = Stage.Common.Components;

        if (data instanceof Error) {
            return <NoDataMessage error={data} repositoryName="plugins" />;
        }

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        let formattedData = data;
        if (_.get(widget.configuration, 'sortByName', false)) {
            formattedData = _.sortBy(data, item => item.pluginDescription.display_name);
        }

        return <PluginsCatalogList widget={widget} items={formattedData} toolbox={toolbox} />;
    }
});
