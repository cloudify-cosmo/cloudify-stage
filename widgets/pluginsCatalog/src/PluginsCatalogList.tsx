import type { ComponentProps, ComponentType } from 'react';
import styled from 'styled-components';

import PluginsCatalogModal, { PluginsCatalogModalProps } from './PluginsCatalogModal';
import Actions from './Actions';
import type { PluginDescriptionWithVersion, PluginsCatalogWidgetConfiguration } from './types';

interface PluginsCatalogListProps {
    items: PluginDescriptionWithVersion[];
    widget: Stage.Types.Widget<PluginsCatalogWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;
}

interface PluginsCatalogListState {
    showModal: boolean;
    plugin: PluginsCatalogModalProps['plugin'] | null;
    /** Potentially holds a message after a successful upload */
    success: string | null;
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

export default class PluginsCatalogList extends React.Component<PluginsCatalogListProps, PluginsCatalogListState> {
    constructor(props: PluginsCatalogListProps) {
        super(props);
        this.state = {
            showModal: false,
            plugin: null,
            success: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('plugins:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: PluginsCatalogListProps, nextState: PluginsCatalogListState) {
        const { items, widget } = this.props;
        return (
            !_.isEqual(items, nextProps.items) ||
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('plugins:refresh', this.refreshData);
    }

    private onSuccess: PluginsCatalogModalProps['onSuccess'] = msg => {
        this.setState({ success: msg });
    };

    private onUpload(plugin: PluginsCatalogModalProps['plugin']) {
        this.setState({ plugin });
        this.showModal();
    }

    private hideModal = () => {
        this.setState({ showModal: false });
    };

    private refreshData = () => {
        const { toolbox } = this.props;
        toolbox.refresh();
    };

    private showModal() {
        this.setState({ showModal: true });
    }

    render() {
        const { plugin, showModal, success } = this.state;
        const { items: itemsProp, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = "There are no Plugins available in catalog. Check widget's configuration.";
        const { DataTable, Message } = Stage.Basic;
        const { PluginIcon } = Stage.Common;

        const distro = `${toolbox
            .getManager()
            .getDistributionName()
            .toLowerCase()} ${toolbox.getManager().getDistributionRelease().toLowerCase()}`;
        const plugins = _.compact(
            _.map(itemsProp, item => {
                const wagon = _.find(
                    item.pluginDescription.wagons,
                    w => w.name.toLowerCase() === distro || w.name.toLowerCase() === 'any'
                );
                return wagon ? { ...item.pluginDescription, wagon, uploadedVersion: item.uploadedVersion } : undefined;
            })
        );

        return (
            <div>
                {success && (
                    <Message color="green" onDismiss={() => this.setState({ success: null })}>
                        {success}
                    </Message>
                )}

                <DataTable noDataAvailable={plugins.length === 0} selectable noDataMessage={NO_DATA_MESSAGE}>
                    <DataTable.Column width="2%" />
                    <DataTable.Column label="Name" width="20%" />
                    <DataTable.Column label="Description" width="60%" />
                    <DataTable.Column label="Version" width="10%" />
                    <DataTable.Column label="Uploaded version" width="10%" />
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
                                    <UploadPluginButton
                                        icon="upload"
                                        onClick={event => {
                                            event.preventDefault();
                                            this.onUpload({
                                                url: item.wagon.url,
                                                title: item.title,
                                                icon: item.icon,
                                                yamlUrl: item.link
                                            });
                                        }}
                                        // eslint-disable-next-line react/jsx-props-no-spreading
                                        {...(item.version === item.uploadedVersion
                                            ? { disabled: true, title: 'Latest version is already uploaded' }
                                            : { disabled: false, title: 'Upload plugin' })}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>

                <PluginsCatalogModal
                    open={showModal}
                    // SAFETY: `plugin` will always be non-null when `showModal` is true
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    plugin={plugin!}
                    onSuccess={this.onSuccess}
                    onHide={this.hideModal}
                    toolbox={toolbox}
                    actions={new Actions(toolbox, widget.configuration.jsonPath)}
                />
            </div>
        );
    }
}
