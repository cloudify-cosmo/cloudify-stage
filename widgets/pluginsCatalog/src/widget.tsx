import Actions from './Actions';
import PluginsCatalogList from './PluginsCatalogList';
import type { PluginDescriptionWithVersion, PluginsCatalogWidgetConfiguration } from './types';

type PluginsCatalogResponse = PluginDescriptionWithVersion[];

const translate = Stage.Utils.getT('widgets.pluginsCatalog');

Stage.defineWidget<unknown, PluginsCatalogResponse | Error, PluginsCatalogWidgetConfiguration>({
    id: 'pluginsCatalog',
    initialWidth: 12,
    initialHeight: 20,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('pluginsCatalog'),
    initialConfiguration: [
        {
            id: 'jsonPath',
            name: translate('configuration.jsonPath.name'),
            placeHolder: translate('configuration.jsonPath.placeholder'),
            default: Stage.i18n.t('urls.pluginsCatalog'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'sortByName',
            name: translate('configuration.sortByName.name'),
            description: translate('configuration.sortByName.description'),
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
