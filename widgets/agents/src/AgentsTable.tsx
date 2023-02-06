import { compact, isEqual } from 'lodash';
import type { DataTableProps } from 'cloudify-ui-components';
import type { AgentsConfiguration } from 'widgets/agents/src/widget';
import InstallAgentsModal from './InstallAgentsModal';
import ValidateAgentsModal from './ValidateAgentsModal';
import type { Agent } from './types';
import { translate, translateColumn } from './utils';

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
        return !isEqual(widget, nextProps.widget) || !isEqual(this.state, nextState) || !isEqual(data, nextProps.data);
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
                    noDataMessage={translate('noDataMessage')}
                >
                    <DataTable.Column
                        label={translateColumn('id')}
                        show={fieldsToShow.indexOf(translateColumn('id')) >= 0}
                    />
                    <DataTable.Column
                        label={translateColumn('ip')}
                        show={fieldsToShow.indexOf(translateColumn('ip')) >= 0}
                    />
                    <DataTable.Column
                        label={translateColumn('deployment')}
                        show={
                            fieldsToShow.indexOf(translateColumn('deployment')) >= 0 &&
                            !data.deploymentId &&
                            !data.nodeId &&
                            !data.nodeInstanceId
                        }
                    />
                    <DataTable.Column
                        label={translateColumn('node')}
                        show={
                            fieldsToShow.indexOf(translateColumn('node')) >= 0 && !data.nodeId && !data.nodeInstanceId
                        }
                    />
                    <DataTable.Column
                        label={translateColumn('system')}
                        show={fieldsToShow.indexOf(translateColumn('system')) >= 0}
                    />
                    <DataTable.Column
                        label={translateColumn('version')}
                        show={fieldsToShow.indexOf(translateColumn('version')) >= 0}
                    />
                    <DataTable.Column
                        label={translateColumn('installMethod')}
                        show={fieldsToShow.indexOf(translateColumn('installMethod')) >= 0}
                    />

                    {data.items.map(item => (
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
                            content={translate('buttons.install')}
                            icon="download"
                            labelPosition="left"
                            onClick={() => this.openModal(Modals.INSTALL_AGENT)}
                        />
                        <Button
                            content={translate('buttons.validate')}
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
                    installMethods={compact(configuration.installMethods)}
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
                    installMethods={compact(configuration.installMethods)}
                    onHide={this.hideModal}
                />
            </div>
        );
    }
}
