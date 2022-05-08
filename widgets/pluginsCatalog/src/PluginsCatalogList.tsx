import type { ComponentProps, ComponentType, FunctionComponent } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { compact, find, map, without } from 'lodash';

import Actions from './Actions';
import type {
    PluginDescriptionWithVersion,
    PluginsCatalogWidgetConfiguration,
    PluginUploadData,
    PluginDescription,
    PluginWagon
} from './types';

interface PluginsCatalogListProps {
    items: PluginDescriptionWithVersion[];
    widget: Stage.Types.Widget<PluginsCatalogWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;
}

export interface PluginsCatalogItem extends Omit<PluginDescription, 'wagons'> {
    uploadedVersion: string | undefined;
    wagon: PluginWagon;
}

const t = Stage.Utils.getT('widgets.pluginsCatalog');

function toUploadData(item: PluginsCatalogItem) {
    return {
        url: item.wagon.url,
        title: item.title,
        icon: item.icon,
        yamlUrl: item.link
    };
}

const UploadPluginButton: ComponentType<ComponentProps<typeof Stage.Basic.Button>> = styled(Stage.Basic.Button)`
    // NOTE: increase specificity to override semantic-ui's style
    &&& {
        ${props =>
            props.disabled &&
            // NOTE: enables showing the title on a disabled button
            // Uses `!important` to override semantic-ui's `!important`
            // Count not be applied via inline `style` prop due to
            // https://github.com/facebook/react/issues/1881
            'pointer-events: auto !important;'}
    }
`;

const uploadSucceededEvent = 'plugins:uploadSucceeded';
const uploadFailedEvent = 'plugins:uploadFailed';
const refreshEvent = 'plugins:refresh';

const PluginsCatalogList: FunctionComponent<PluginsCatalogListProps> = ({ toolbox, widget, items: itemsProp }) => {
    const [successMessages, setSuccessMessages] = useState<string[]>([]);
    const [errorMessages, setErrorMessages] = useState<string[] | null>(null);
    // Temporal state to hold uploaded plugin urls until plugins list is refreshed
    const [uploadedPlugins, setUploadedPlugins] = useState<Record<string, boolean>>({});

    const { useRefreshEvent, useEventListener } = Stage.Hooks;
    useRefreshEvent(toolbox, refreshEvent);
    useEventListener(toolbox, refreshEvent, () => setUploadedPlugins({}));
    useEventListener(toolbox, uploadSucceededEvent, message =>
        setSuccessMessages(prevState => [...prevState, message])
    );
    useEventListener(toolbox, uploadFailedEvent, message =>
        setErrorMessages(prevState => [...(prevState ?? []), message])
    );

    const dispatch = ReactRedux.useDispatch();
    const uploadingPlugins = ReactRedux.useSelector((state: Stage.Types.ReduxState) => state.plugins?.uploading ?? {});
    const { PluginActions } = Stage.Shared;

    function doUpload(plugin: PluginUploadData) {
        const eventBus = toolbox.getEventBus();
        return new Actions(toolbox, widget.configuration.jsonPath)
            .doUpload(plugin)
            .then(() => {
                eventBus.trigger(refreshEvent);
                eventBus.trigger(uploadSucceededEvent, t('successMessage', { pluginTitle: plugin.title }));
                setUploadedPlugins(prevState => ({ ...prevState, [plugin.yamlUrl]: true }));
            })
            .catch(err => {
                eventBus.trigger(uploadFailedEvent, err.message);
            })
            .finally(() => dispatch(PluginActions.unsetPluginUploading(plugin.yamlUrl)));
    }

    function isAvailableForUpload(item: PluginsCatalogItem) {
        return !uploadingPlugins[item.link] && item.version !== item.uploadedVersion;
    }

    function onUploadAll(plugins: PluginsCatalogItem[]) {
        let promise = Promise.resolve();
        plugins.forEach(plugin => {
            const pluginUrl = plugin.link;
            if (isAvailableForUpload(plugin)) {
                dispatch(PluginActions.setPluginUploading(pluginUrl));
                promise = promise.then(() => doUpload(toUploadData(plugin)));
            }
        });
    }

    function getActionColumnContent(item: PluginsCatalogItem) {
        const pluginUploadData = toUploadData(item);

        const pluginUploading =
            !!uploadingPlugins[pluginUploadData.yamlUrl] ||
            (uploadedPlugins[pluginUploadData.yamlUrl] && !item.uploadedVersion);
        const recentVersionUploaded = item.version === item.uploadedVersion;

        let titleKey;
        if (pluginUploading) {
            titleKey = 'uploading';
        } else if (recentVersionUploaded) {
            titleKey = 'disabled';
        } else {
            titleKey = 'enabled';
        }

        return (
            <UploadPluginButton
                loading={pluginUploading}
                icon="upload"
                onClick={event => {
                    event.preventDefault();
                    dispatch(PluginActions.setPluginUploading(item.link));
                    doUpload(pluginUploadData);
                }}
                title={t(`uploadButton.${titleKey}`)}
                disabled={recentVersionUploaded || pluginUploading}
            />
        );
    }

    const NO_DATA_MESSAGE = t('noData');
    const { Button, DataTable } = Stage.Basic;
    const { FeedbackMessages } = Stage.Common.Components;
    const PluginIcon = Stage.Common.Plugins.Icon;

    const distro = `${toolbox
        .getManager()
        .getDistributionName()
        .toLowerCase()} ${toolbox.getManager().getDistributionRelease().toLowerCase()}`;
    const plugins = compact(
        map(itemsProp, item => {
            const wagon = find(
                item.pluginDescription.wagons,
                w => w.name.toLowerCase() === distro || w.name.toLowerCase() === 'any'
            );
            return wagon ? { ...item.pluginDescription, wagon, uploadedVersion: item.uploadedVersion } : undefined;
        })
    );

    return (
        <div>
            <FeedbackMessages
                successMessages={successMessages}
                onDismissSuccess={message => setSuccessMessages(without(successMessages, message))}
                errorMessages={errorMessages}
                onDismissErrors={() => setErrorMessages(null)}
            />

            <DataTable noDataAvailable={plugins.length === 0} selectable noDataMessage={NO_DATA_MESSAGE}>
                <DataTable.Column width="2%" />
                <DataTable.Column label={t('columns.name')} width="20%" />
                <DataTable.Column label={t('columns.description')} width="60%" />
                <DataTable.Column label={t('columns.version')} width="10%" />
                <DataTable.Column label={t('columns.uploadedVersion')} width="10%" />
                <DataTable.Column width="5%" />

                {plugins.map(item => {
                    return (
                        <DataTable.Row key={item.title}>
                            <DataTable.Data>
                                <PluginIcon src={item.icon} />
                            </DataTable.Data>
                            <DataTable.Data>{item.title}</DataTable.Data>
                            <DataTable.Data>{item.description}</DataTable.Data>
                            <DataTable.Data>{item.version}</DataTable.Data>
                            <DataTable.Data>{item.uploadedVersion ?? '-'}</DataTable.Data>
                            <DataTable.Data className="center aligned">{getActionColumnContent(item)}</DataTable.Data>
                        </DataTable.Row>
                    );
                })}

                <DataTable.Action>
                    <Button
                        disabled={!find(plugins, isAvailableForUpload)}
                        content={t('uploadAllButton')}
                        onClick={() => onUploadAll(plugins)}
                    />
                </DataTable.Action>
            </DataTable>
        </div>
    );
};

export default PluginsCatalogList;
