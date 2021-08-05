import type { ComponentProps, ComponentType } from 'react';
import styled from 'styled-components';
import { compact, isEmpty, isEqual, find, map, without } from 'lodash';

import Actions from './Actions';
import type { PluginDescriptionWithVersion, PluginsCatalogWidgetConfiguration, PluginUploadData } from './types';
import { PluginDescription, PluginWagon } from './types';

interface PluginsCatalogListProps {
    items: PluginDescriptionWithVersion[];
    widget: Stage.Types.Widget<PluginsCatalogWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;
}

interface PluginsCatalogListState {
    showModal: boolean;
    uploadingPlugins: PluginUploadData[];
    /** Potentially hold messages */
    successMessages: string[];
    errorMessages: string[] | null;
}

export interface PluginsCatalogItem extends Omit<PluginDescription, 'wagons'> {
    uploadedVersion: string | undefined;
    wagon: PluginWagon;
}

const t = Stage.Utils.getT('widgets.pluginsCatalog');

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

export default class PluginsCatalogList extends React.Component<PluginsCatalogListProps, PluginsCatalogListState> {
    constructor(props: PluginsCatalogListProps) {
        super(props);
        this.state = {
            showModal: false,
            uploadingPlugins: [],
            successMessages: [],
            errorMessages: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('plugins:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: PluginsCatalogListProps, nextState: PluginsCatalogListState) {
        const { items, widget } = this.props;
        return (
            !isEqual(items, nextProps.items) || !isEqual(widget, nextProps.widget) || !isEqual(this.state, nextState)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('plugins:refresh', this.refreshData);
    }

    private onUpload(plugin: PluginUploadData) {
        const { toolbox, widget } = this.props;

        this.setState(prevState => ({ uploadingPlugins: [...prevState.uploadingPlugins, plugin] }));

        new Actions(toolbox, widget.configuration.jsonPath)
            .doUpload(plugin)
            .then(() => {
                toolbox.getEventBus().trigger('plugins:refresh');
                this.setState(prevState => ({
                    successMessages: [...prevState.successMessages, t('successMessage', { pluginTitle: plugin.title })]
                }));
            })
            .catch(err =>
                this.setState(prevState => ({ errorMessages: [...(prevState.errorMessages ?? []), err.message] }))
            )
            .finally(() =>
                this.setState(prevState => ({ uploadingPlugins: without(prevState.uploadingPlugins, plugin) }))
            );
    }

    private getActionColumnContent(item: PluginsCatalogItem) {
        const { uploadingPlugins } = this.state;
        const pluginUploadData = {
            url: item.wagon.url,
            title: item.title,
            icon: item.icon,
            yamlUrl: item.link
        };

        const pluginUploading = !!find(uploadingPlugins, pluginUploadData);
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
                    this.onUpload(pluginUploadData);
                }}
                title={t(`uploadButton.${titleKey}`)}
                disabled={recentVersionUploaded || pluginUploading}
            />
        );
    }

    private refreshData = () => {
        const { toolbox } = this.props;
        toolbox.refresh();
    };

    render() {
        const { successMessages, errorMessages } = this.state;
        const { items: itemsProp, toolbox } = this.props;
        const NO_DATA_MESSAGE = t('noData');
        const { DataTable, Message, ErrorMessage } = Stage.Basic;
        const { PluginIcon } = Stage.Common;

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
                {successMessages.map(message => (
                    <Message
                        key={message}
                        success
                        onDismiss={() =>
                            this.setState(prevState => ({
                                successMessages: without(prevState.successMessages, message)
                            }))
                        }
                    >
                        {message}
                    </Message>
                ))}
                {!isEmpty(errorMessages) && (
                    <ErrorMessage error={errorMessages} onDismiss={() => this.setState({ errorMessages: null })} />
                )}

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
                                <DataTable.Data className="center aligned">
                                    {this.getActionColumnContent(item)}
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>
            </div>
        );
    }
}
