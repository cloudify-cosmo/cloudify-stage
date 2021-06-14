// @ts-nocheck File not migrated fully to TS
/**
 * Created by jakub.niezgoda on 04/10/2018.
 */

import InstallAgentsModal from './InstallAgentsModal';
import ValidateAgentsModal from './ValidateAgentsModal';
import AgentsPropType from './props/AgentsPropType';

export default class AgentsTable extends React.Component {
    static Modals = {
        INSTALL_AGENT: 'install_agent',
        VALIDATE_AGENT: 'validate_agent'
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modal: ''
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('agents:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps, nextState) {
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

    fetchGridData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    openModal(modal) {
        this.setState({ showModal: true, modal });
    }

    refreshData() {
        const { toolbox } = this.props;
        this.setState({ error: null });

        toolbox.refresh();
    }

    render() {
        const { error, modal, showModal } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Agents available.';
        const { configuration } = widget;
        const { fieldsToShow } = configuration;

        const { Button, DataTable, ErrorMessage } = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

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
                    <DataTable.Column label="Id" show={fieldsToShow.indexOf('Id') >= 0} />
                    <DataTable.Column label="IP" show={fieldsToShow.indexOf('IP') >= 0} />
                    <DataTable.Column
                        label="Deployment"
                        show={
                            fieldsToShow.indexOf('Deployment') >= 0 &&
                            !data.deploymentId &&
                            !data.nodeId &&
                            !data.nodeInstanceId
                        }
                    />
                    <DataTable.Column
                        label="Node"
                        show={fieldsToShow.indexOf('Node') >= 0 && !data.nodeId && !data.nodeInstanceId}
                    />
                    <DataTable.Column label="System" show={fieldsToShow.indexOf('System') >= 0} />
                    <DataTable.Column label="Version" show={fieldsToShow.indexOf('Version') >= 0} />
                    <DataTable.Column label="Install Method" show={fieldsToShow.indexOf('Install Method') >= 0} />

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
                            onClick={() => this.openModal(AgentsTable.Modals.INSTALL_AGENT)}
                        />
                        <Button
                            content="Validate"
                            icon="checkmark"
                            labelPosition="left"
                            onClick={() => this.openModal(AgentsTable.Modals.VALIDATE_AGENT)}
                        />
                    </DataTable.Action>
                </DataTable>

                <ValidateAgentsModal
                    toolbox={toolbox}
                    widget={widget}
                    open={showModal && modal === AgentsTable.Modals.VALIDATE_AGENT}
                    deploymentId={data.deploymentId}
                    nodeId={data.nodeId}
                    nodeInstanceId={data.nodeInstanceId}
                    agents={data.items}
                    installMethods={_.without(configuration.installMethods, '')}
                    onHide={this.hideModal}
                />

                <InstallAgentsModal
                    toolbox={toolbox}
                    widget={widget}
                    open={showModal && modal === AgentsTable.Modals.INSTALL_AGENT}
                    deploymentId={data.deploymentId}
                    nodeId={data.nodeId}
                    nodeInstanceId={data.nodeInstanceId}
                    agents={data.items}
                    installMethods={_.without(configuration.installMethods, '')}
                    onHide={this.hideModal}
                />
            </div>
        );
    }
}

AgentsTable.propTypes = {
    data: PropTypes.shape({
        items: AgentsPropType,
        total: PropTypes.number,
        deploymentId: Stage.PropTypes.StringOrArray,
        nodeId: Stage.PropTypes.StringOrArray,
        nodeInstanceId: Stage.PropTypes.StringOrArray
    }).isRequired,
    widget: Stage.PropTypes.Widget.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
