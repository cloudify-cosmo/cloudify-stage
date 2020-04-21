/**
 * Created by kinneretzin on 07/09/2016.
 */

import PluginsTable from './PluginsTable';

Stage.defineWidget({
    id: 'plugins',
    name: 'Plugins list',
    description: 'Plugins list',
    initialWidth: 8,
    initialHeight: 20,
    color: 'blue',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('plugins'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(30), Stage.GenericConfig.PAGE_SIZE_CONFIG()],

    fetchData(widget, toolbox) {
        return toolbox
            .getManager()
            .doGet(
                '/plugins?_include=id,package_name,package_version,supported_platform,distribution,distribution_release,uploaded_at,created_by,visibility',
                toolbox.getContext().getValue('onlyMyResources')
                    ? { created_by: toolbox.getManager().getCurrentUsername() }
                    : {}
            )
            .then(data =>
                Promise.all(
                    _.map(data.items, item =>
                        toolbox
                            .getInternal()
                            .doGet(`/plugins/icons/${item.id}`, null, false)
                            .then(response => response.blob())
                            .then(
                                blob =>
                                    new Promise(resolve => {
                                        if (blob.size) {
                                            const reader = new FileReader();
                                            reader.addEventListener('error', () => resolve());
                                            reader.addEventListener('load', () => {
                                                item.icon = reader.result;
                                                resolve();
                                            });
                                            reader.readAsDataURL(blob);
                                        } else {
                                            resolve();
                                        }
                                    })
                            )
                    )
                ).then(_.constant(data))
            );
    },

    render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading />;
        }

        const selectedPlugin = toolbox.getContext().getValue('pluginId');
        const formattedData = {
            ...data,
            items: _.map(data.items, item => {
                return {
                    ...item,
                    uploaded_at: Stage.Utils.Time.formatTimestamp(item.uploaded_at), // 2016-07-20 09:10:53.103579
                    isSelected: selectedPlugin === item.id
                };
            })
        };
        formattedData.total = _.get(data, 'metadata.pagination.total', 0);

        return <PluginsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
