const deploymentFilter = { deployment_id: 'deploymentId' };
const blueprintFilter = { blueprint_id: 'blueprintId' };
const blueprintDeploymentFilter = { ...deploymentFilter, ...blueprintFilter };

export default class Filter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.configuration, nextProps.configuration) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.data, nextProps.data)
        );
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('blueprints:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('deployments:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('nodes:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('executions:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('events:refresh', this._refreshData, this);
        this.props.toolbox.getEventBus().on('topology:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('blueprints:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('deployments:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('nodes:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('executions:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('events:refresh', this._refreshData);
        this.props.toolbox.getEventBus().off('topology:refresh', this._refreshData);
    }

    setValue(name, value) {
        this.props.toolbox.getContext().setValue(name, value);
        this.setState({ [name]: value });
    }

    componentDidUpdate(prevProps) {
        const oldAllowMultipleSelection = prevProps.configuration.allowMultipleSelection;
        const newAllowMultipleSelection = this.props.configuration.allowMultipleSelection;

        if (oldAllowMultipleSelection !== newAllowMultipleSelection) {
            this.setValue('blueprintId', null);
            this.setValue('deploymentId', null);
            this.setValue('nodeId', null);
            this.setValue('nodeInstanceId', null);
            this.setValue('executionId', null);
            this.setValue('depNodeId', null);
            this.setValue('executionStatus', null);
            this.setValue('siteName', null);
        }
    }

    updateDeplomentNodeIdValue(selectedDeploymentId, selectedNodeId) {
        const { allowMultipleSelection } = this.props.configuration;
        const context = this.props.toolbox.getContext();

        if (!allowMultipleSelection) {
            if (!_.isEmpty(selectedDeploymentId) && !_.isEmpty(selectedNodeId)) {
                const oldDepNodeId = context.getValue('depNodeId');
                const newDepNodeId = selectedNodeId + selectedDeploymentId;
                if (oldDepNodeId !== newDepNodeId) {
                    context.setValue('depNodeId', newDepNodeId);
                }
            } else {
                context.setValue('depNodeId', null);
            }
        }
    }

    updateTopologyWidget(selectedNodeId) {
        const { allowMultipleSelection } = this.props.configuration;

        if (!allowMultipleSelection) {
            this.props.toolbox.getEventBus().trigger('topology:selectNode', selectedNodeId);
        }
    }

    selectBlueprint(blueprintIds) {
        this.setValue('blueprintId', blueprintIds);
        this.setValue('deploymentId', null);
        this.setValue('nodeId', null);
        this.setValue('executionId', null);
        this.updateDeplomentNodeIdValue(null, null);
    }

    selectDeployment(deploymentIds) {
        this.setValue('deploymentId', deploymentIds);
        this.setValue('nodeInstanceId', null);
        this.setValue('nodeId', null);
        this.setValue('executionId', null);
        this.updateDeplomentNodeIdValue(null, null);
    }

    selectNode(nodeIds) {
        this.setValue('nodeId', nodeIds);
        this.setValue('nodeInstanceId', null);
        this.updateDeplomentNodeIdValue(this.state.deploymentId, nodeIds);
        this.updateTopologyWidget(nodeIds);
    }

    selectNodeInstance(nodeInstanceIds) {
        this.setValue('nodeInstanceId', nodeInstanceIds);
    }

    selectExecution(executionIds) {
        this.setValue('executionId', executionIds);
    }

    selectExecutionStatus(executionStatuses) {
        this.setValue('executionStatus', executionStatuses);
    }

    selectSiteName(siteNames) {
        this.setValue('siteName', siteNames);
    }

    render() {
        const { ErrorMessage, Form } = Stage.Basic;

        const createDropdown = ({
            stateProp,
            enabledConfigurationKey,
            fetchAll,
            fetchIncludeExtra,
            fetchManagerEndpoint,
            entityName,
            textFormatter,
            valueProp,
            pageSize,
            filter
        }) => {
            const { DynamicDropdown } = Stage.Common;
            const { configuration } = this.props;
            const joinedEntityName = entityName.replace(' ', '');
            if (configuration[enabledConfigurationKey || `filterBy${joinedEntityName}s`]) {
                return (
                    <Form.Field key={entityName}>
                        <DynamicDropdown
                            multiple={configuration.allowMultipleSelection}
                            fetchUrl={`/${fetchManagerEndpoint ||
                                `${entityName.replace(' ', '-').toLowerCase()}s`}?_include=${_(filter)
                                .keys()
                                .concat(valueProp || 'id')
                                .concat(fetchIncludeExtra || [])
                                .join()}`}
                            onChange={this[`select${joinedEntityName}`].bind(this)}
                            toolbox={this.props.toolbox}
                            value={this.state[stateProp || `${_.lowerFirst(joinedEntityName)}Id`]}
                            placeholder={entityName}
                            fetchAll={fetchAll}
                            textFormatter={textFormatter}
                            valueProp={valueProp}
                            pageSize={pageSize}
                            filter={filter}
                        />
                    </Form.Field>
                );
            }

            return null;
        };

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                <Form size="small">
                    <Form.Group inline widths="equal">
                        {[
                            createDropdown({
                                entityName: 'Blueprint'
                            }),
                            createDropdown({
                                entityName: 'Deployment',
                                filter: blueprintFilter,
                                pageSize: 20
                            }),
                            createDropdown({
                                entityName: 'Node',
                                filter: blueprintDeploymentFilter,
                                pageSize: 40
                            }),
                            createDropdown({
                                entityName: 'Node Instance',
                                filter: { ...deploymentFilter, node_id: 'nodeId' },
                                pageSize: 40
                            }),
                            createDropdown({
                                entityName: 'Execution',
                                fetchIncludeExtra: 'workflow_id',
                                textFormatter: item => `${item.id} (${item.workflow_id})`,
                                filter: blueprintDeploymentFilter,
                                pageSize: 20
                            }),
                            createDropdown({
                                entityName: 'Execution Status',
                                stateProp: 'executionStatus',
                                enabledConfigurationKey: 'filterByExecutionsStatus',
                                fetchManagerEndpoint: 'executions',
                                fetchAll: true,
                                valueProp: 'status_display',
                                filter: {
                                    ...blueprintDeploymentFilter,
                                    id: 'executionId'
                                }
                            }),
                            createDropdown({
                                entityName: 'Site Name',
                                stateProp: 'siteName',
                                enabledConfigurationKey: 'filterBySiteName',
                                fetchManagerEndpoint: 'sites',
                                valueProp: 'name'
                            })
                        ]}
                    </Form.Group>
                </Form>
            </div>
        );
    }
}
