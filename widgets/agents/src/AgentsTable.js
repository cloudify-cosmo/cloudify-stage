/**
 * Created by jakub.niezgoda on 04/10/2018.
 */

import ValidateAgentsModal from './ValidateAgentsModal';
import InstallAgentsModal from './InstallAgentsModal';

export default class AgentsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modal: ''
        };
    }

    static Modals = {
        INSTALL_AGENT: 'install_agent',
        VALIDATE_AGENT: 'validate_agent'
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.data, nextProps.data)
        );
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('agents:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('agents:refresh', this._refreshData);
    }

    openModal(modal) {
        this.setState({ showModal: true, modal });
    }

    hideModal() {
        this.setState({ showModal: false });
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Agents available.';
        const { configuration } = this.props.widget;
        const { fieldsToShow } = configuration;
        const totalSize = this.props.data.total > 0 ? undefined : 0;

        const { Button, DataTable, ErrorMessage } = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    selectable={false}
                    className="agentsTable"
                    noDataMessage={NO_DATA_MESSAGE}
                    totalSize={totalSize}
                >
                    <DataTable.Column label="Id" show={fieldsToShow.indexOf('Id') >= 0} />
                    <DataTable.Column label="IP" show={fieldsToShow.indexOf('IP') >= 0} />
                    <DataTable.Column
                        label="Deployment"
                        show={
                            fieldsToShow.indexOf('Deployment') >= 0 &&
                            !this.props.data.deploymentId &&
                            !this.props.data.nodeId &&
                            !this.props.data.nodeInstanceId
                        }
                    />
                    <DataTable.Column
                        label="Node"
                        show={
                            fieldsToShow.indexOf('Node') >= 0 &&
                            !this.props.data.nodeId &&
                            !this.props.data.nodeInstanceId
                        }
                    />
                    <DataTable.Column label="System" show={fieldsToShow.indexOf('System') >= 0} />
                    <DataTable.Column label="Version" show={fieldsToShow.indexOf('Version') >= 0} />
                    <DataTable.Column label="Install Method" show={fieldsToShow.indexOf('Install Method') >= 0} />

                    {_.map(this.props.data.items, item => (
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
                            onClick={this.openModal.bind(this, AgentsTable.Modals.INSTALL_AGENT)}
                        />
                        <Button
                            content="Validate"
                            icon="checkmark"
                            labelPosition="left"
                            onClick={this.openModal.bind(this, AgentsTable.Modals.VALIDATE_AGENT)}
                        />
                    </DataTable.Action>
                </DataTable>

                <ValidateAgentsModal
                    toolbox={this.props.toolbox}
                    widget={this.props.widget}
                    open={this.state.showModal && this.state.modal === AgentsTable.Modals.VALIDATE_AGENT}
                    deploymentId={this.props.data.deploymentId}
                    nodeId={this.props.data.nodeId}
                    nodeInstanceId={this.props.data.nodeInstanceId}
                    agents={this.props.data.items}
                    installMethods={_.without(configuration.installMethods, '')}
                    onHide={this.hideModal.bind(this)}
                />

                <InstallAgentsModal
                    toolbox={this.props.toolbox}
                    widget={this.props.widget}
                    open={this.state.showModal && this.state.modal === AgentsTable.Modals.INSTALL_AGENT}
                    deploymentId={this.props.data.deploymentId}
                    nodeId={this.props.data.nodeId}
                    nodeInstanceId={this.props.data.nodeInstanceId}
                    agents={this.props.data.items}
                    installMethods={_.without(configuration.installMethods, '')}
                    onHide={this.hideModal.bind(this)}
                />
            </div>
        );
    }
}
