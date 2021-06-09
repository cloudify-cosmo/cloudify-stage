/**
 * Created by Tamer on 30/07/2017.
 */

import Actions from './Actions';
import PluginsCatalogList from './PluginsCatalogList';

Stage.defineWidget({
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

    /**
     * fetch data from source
     *
     * @param {any} widget
     * @param {any} toolbox
     * @param {any} params
     * @returns
     */
    fetchData(widget, toolbox) {
        const actions = new Actions({
            toolbox,
            ...widget.configuration
        });

        return actions.doGetPluginsList().catch(e => (e instanceof Error ? e : Error(e)));
    },

    /**
     * render widget
     *
     * @param {any} widget
     * @param {any} data
     * @param {any} error
     * @param {any} toolbox
     * @returns
     */
    render(widget, data, error, toolbox) {
        const { Basic, Common } = Stage;

        if (data instanceof Error) {
            return <Common.NoDataMessage error={data} repositoryName="plugins" />;
        }

        if (_.isEmpty(data)) {
            return <Basic.Loading />;
        }

        let formattedData = data;
        if (_.get(widget.configuration, 'sortByName', false)) {
            formattedData = _.sortBy(data, 'title');
        }

        return <PluginsCatalogList widget={widget} items={formattedData} toolbox={toolbox} />;
    }
});
