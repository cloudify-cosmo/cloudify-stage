import type { DataTableProps } from 'cloudify-ui-components';
import type { AgentsConfiguration } from 'widgets/agents/src/widget';
import InstallAgentsModal from './InstallAgentsModal';
import ValidateAgentsModal from './ValidateAgentsModal';
import type { Agent } from './types';

const t = Stage.Utils.getT('widgets.agents');

export interface AgentsTableData {
    items: Agent[];
    total: number;
    deploymentId: Stage.ContextEntries['deploymentId'];
    nodeId: Stage.ContextEntries['nodeId'];
    nodeInstanceId: Stage.ContextEntries['nodeInstanceId'];
}

interface AgentsTableProps {
    data: AgentsTableData;
    widget: Stage.Types.Widget<AgentsConfiguration>;
    toolbox: Stage.Types.Toolbox;
}

interface AgentsTableState {
    showModal: boolean;
    modal?: Modals;
}

enum Modals {
    INSTALL_AGENT,
    VALIDATE_AGENT
}

export default class AgentsTable extends React.Component<AgentsTableProps, AgentsTableState> {
    constructor(props: AgentsTableProps) {
        super(props);

        this.state = {
            showModal: false
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('agents:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: AgentsTableProps, nextState: AgentsTableState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('agents:refresh', this.refreshData);
    }

    fetchGridData: DataTableProps['fetchData'] = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    openModal(modal: AgentsTableState['modal']) {
        this.setState({ showModal: true, modal });
    }

    refreshData() {
        const { toolbox } = this.props;

        toolbox.refresh();
    }

    render() {
        const { modal, showModal } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Agents available.';
        const { configuration } = widget;
        const { fieldsToShow } = configuration;

        const { Button, DataTable } = Stage.Basic;

        return (
            <div>
                <DataTable
                    fetchData={this.fetchGridData}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    searchable
                    selectable={false}
                    className="agentsTable"
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column label={t('columns.id')} show={fieldsToShow.indexOf(t('columns.id')) >= 0} />
                    <DataTable.Column label={t('columns.ip')} show={fieldsToShow.indexOf(t('columns.ip')) >= 0} />
                    <DataTable.Column
                        label={t('columns.deployment')}
                        show={
                            fieldsToShow.indexOf(t('columns.deployment')) >= 0 &&
                            !data.deploymentId &&
                            !data.nodeId &&
                            !data.nodeInstanceId
                        }
                    />
                    <DataTable.Column
                        label={t('columns.node')}
                        show={fieldsToShow.indexOf(t('columns.node')) >= 0 && !data.nodeId && !data.nodeInstanceId}
                    />
                    <DataTable.Column
                        label={t('columns.system')}
                        show={fieldsToShow.indexOf(t('columns.system')) >= 0}
                    />
                    <DataTable.Column
                        label={t('columns.version')}
                        show={fieldsToShow.indexOf(t('columns.version')) >= 0}
                    />
                    <DataTable.Column
                        label={t('columns.installMethod')}
                        show={fieldsToShow.indexOf(t('columns.installMethod')) >= 0}
                    />

                    {_.map(data.items, item => (
                        <DataTable.Row key={item.id}>
                            <DataTable.Data>{item.id}</DataTable.Data>
                            <DataTable.Data>{item.ip}</DataTable.Data>
                            <DataTable.Data>{item.deployment}</DataTable.Data>
                            <DataTable.Data>{item.node}</DataTable.Data>
                            <DataTable.Data>{item.system}</DataTable.Data>
                            <DataTable.Data>{item.version}</DataTable.Data>
                            <DataTable.Data>{item.install_method}</DataTable.Data>
                        </DataTable.Row>
                    ))}

                    <DataTable.Action>
                        <Button
                            content="Install"
                            icon="download"
                            labelPosition="left"
                            onClick={() => this.openModal(Modals.INSTALL_AGENT)}
                        />
                        <Button
                            content="Validate"
                            icon="checkmark"
                            labelPosition="left"
                            onClick={() => this.openModal(Modals.VALIDATE_AGENT)}
                        />
                    </DataTable.Action>
                </DataTable>

                <ValidateAgentsModal
                    manager={toolbox.getManager()}
                    drilldownHandler={toolbox.getDrilldownHandler()}
                    open={showModal && modal === Modals.VALIDATE_AGENT}
                    deploymentId={data.deploymentId || undefined}
                    nodeId={data.nodeId}
                    nodeInstanceId={data.nodeInstanceId}
                    agents={data.items}
                    installMethods={_.compact(configuration.installMethods)}
                    onHide={this.hideModal}
                />

                <InstallAgentsModal
                    manager={toolbox.getManager()}
                    drilldownHandler={toolbox.getDrilldownHandler()}
                    open={showModal && modal === Modals.INSTALL_AGENT}
                    deploymentId={data.deploymentId || undefined}
                    nodeId={data.nodeId}
                    nodeInstanceId={data.nodeInstanceId}
                    agents={data.items}
                    installMethods={_.compact(configuration.installMethods)}
                    onHide={this.hideModal}
                />
            </div>
        );
    }
}
