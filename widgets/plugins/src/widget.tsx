import { constant } from 'lodash';
import PluginsTable from './PluginsTable';
import type { PluginsWidget } from './widget.types';

Stage.defineWidget<PluginsWidget.Parameters, PluginsWidget.Data, PluginsWidget.Configuration>({
    id: 'plugins',
    initialWidth: 8,
    initialHeight: 20,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('plugins'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(30), Stage.GenericConfig.PAGE_SIZE_CONFIG()],

    fetchData(_widget, toolbox, params) {
        return toolbox
            .getManager()
            .doGet(
                '/plugins?_include=id,package_name,package_version,supported_platform,distribution,distribution_release,uploaded_at,created_by,visibility,title',
                {
                    params: toolbox.getContext().getValue('onlyMyResources')
                        ? { ...params, created_by: toolbox.getManager().getCurrentUsername() }
                        : params
                }
            )
            .then((data: PluginsWidget.Data) =>
                Promise.all(
                    data.items.map(item =>
                        toolbox
                            .getInternal()
                            .doGet<Response>(`/plugins/icons/${item.id}`, { parseResponse: false })
                            .then(response => response.blob())
                            .then(
                                blob =>
                                    new Promise<void>(resolve => {
                                        if (blob.size) {
                                            const reader = new FileReader();
                                            reader.addEventListener('error', () => resolve());
                                            reader.addEventListener('load', () => {
                                                item.icon = reader.result as string;
                                                resolve();
                                            });
                                            reader.readAsDataURL(blob);
                                        } else {
                                            resolve();
                                        }
                                    })
                            )
                    )
                ).then(constant(data))
            );
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        const selectedPlugin = toolbox.getContext().getValue('pluginId');
        const formattedData = {
            ...data,
            items: data.items.map(item => {
                return {
                    ...item,
                    uploaded_at: Stage.Utils.Time.formatTimestamp(item.uploaded_at), // 2016-07-20 09:10:53.103579
                    isSelected: selectedPlugin === item.id
                };
            }),
            total: data.metadata.pagination.total
        };

        return <PluginsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
