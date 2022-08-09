// @ts-nocheck File not migrated fully to TS
const deploymentFilter = { deployment_id: 'deploymentId' };
const blueprintFilter = { blueprint_id: 'blueprintId' };
const blueprintDeploymentFilter = { ...deploymentFilter, ...blueprintFilter };

const filterFields = [
    'blueprintId',
    'deploymentId',
    'nodeId',
    'nodeInstanceId',
    'executionId',
    'executionStatus',
    'siteName'
];

export default class Filter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            ...this.getStateFromContext()
        };

        this.eventHandlers = {
            'blueprints:refresh': this.selectBlueprint,
            'deployments:refresh': this.selectDeployment,
            'filter:refresh': () => this.setState(this.getStateFromContext())
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        _.each(this.eventHandlers, (handler, eventName) => toolbox.getEventBus().on(eventName, handler, this));
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { configuration } = this.props;
        return !_.isEqual(configuration, nextProps.configuration) || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate(prevProps) {
        const { configuration } = this.props;
        const oldAllowMultipleSelection = prevProps.configuration.allowMultipleSelection;
        const newAllowMultipleSelection = configuration.allowMultipleSelection;

        if (oldAllowMultipleSelection !== newAllowMultipleSelection) {
            filterFields.forEach(filterField => this.setValue(filterField, null));
            this.setValue('depNodeId', null);
        }
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        _.each(this.eventHandlers, (handler, eventName) => toolbox.getEventBus().off(eventName, handler));
    }

    getStateFromContext() {
        const { toolbox } = this.props;
        return _(filterFields)
            .keyBy()
            .mapValues(filterField => toolbox.getContext().getValue(filterField) || null)
            .value();
    }

    setValue(name, value) {
        const { toolbox } = this.props;
        toolbox.getContext().setValue(name, value);
        this.setState({ [name]: value });
    }

    selectBlueprint = (blueprintIds = null) => {
        this.setValue('blueprintId', blueprintIds);
        this.setValue('deploymentId', null);
        this.setValue('nodeId', null);
        this.setValue('executionId', null);
        this.updateDeplomentNodeIdValue(null, null);
    };

    selectDeployment = (deploymentIds = null) => {
        this.setValue('deploymentId', deploymentIds);
        this.setValue('nodeInstanceId', null);
        this.setValue('nodeId', null);
        this.setValue('executionId', null);
        this.updateDeplomentNodeIdValue(null, null);
    };

    selectNode = nodeIds => {
        const { deploymentId } = this.state;
        this.setValue('nodeId', nodeIds);
        this.setValue('nodeInstanceId', null);
        this.updateDeplomentNodeIdValue(deploymentId, nodeIds);
        this.updateTopologyWidget(nodeIds);
    };

    selectNodeInstance = nodeInstanceIds => {
        this.setValue('nodeInstanceId', nodeInstanceIds);
    };

    selectExecution = executionIds => {
        this.setValue('executionId', executionIds);
    };

    selectExecutionStatus = executionStatuses => {
        this.setValue('executionStatus', executionStatuses);
    };

    selectSiteName = siteNames => {
        this.setValue('siteName', siteNames);
    };

    updateDeplomentNodeIdValue(selectedDeploymentId, selectedNodeId) {
        const { configuration, toolbox } = this.props;
        const { allowMultipleSelection } = configuration;
        const context = toolbox.getContext();

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
        const { configuration, toolbox } = this.props;
        const { allowMultipleSelection } = configuration;

        if (!allowMultipleSelection) {
            toolbox.getEventBus().trigger('topology:selectNode', selectedNodeId);
        }
    }

    render() {
        const { Form } = Stage.Basic;

        const createDropdown = ({
            stateProp,
            enabledConfigurationKey,
            fetchAll,
            fetchIncludeExtra,
            fetchManagerEndpoint,
            searchParams,
            entityName,
            textFormatter,
            valueProp,
            pageSize,
            filter,
            flushOnRefreshEvent
        }) => {
            const { DynamicDropdown } = Stage.Common.Components;
            const { appendQueryParam } = Stage.Utils.Url;
            const { configuration, toolbox } = this.props;

            const joinedEntityName = entityName.replace(' ', '');
            if (configuration[enabledConfigurationKey || `filterBy${joinedEntityName}s`]) {
                const camelCaseEntityName = _.lowerFirst(joinedEntityName);
                const { [stateProp || `${camelCaseEntityName}Id`]: value } = this.state;
                const url = `/${fetchManagerEndpoint || `${entityName.replace(' ', '-').toLowerCase()}s`}`;
                return (
                    <Form.Field key={entityName}>
                        <DynamicDropdown
                            multiple={configuration.allowMultipleSelection}
                            fetchUrl={appendQueryParam(url, {
                                _include: _(filter)
                                    .keys()
                                    .concat(valueProp || 'id')
                                    .concat(fetchIncludeExtra || [])
                                    .join()
                            })}
                            searchParams={searchParams}
                            onChange={this[`select${joinedEntityName}`]}
                            toolbox={toolbox}
                            value={value}
                            placeholder={entityName}
                            fetchAll={fetchAll}
                            textFormatter={textFormatter}
                            valueProp={valueProp}
                            pageSize={pageSize}
                            filter={filter}
                            className={`${camelCaseEntityName}FilterField`}
                            refreshEvent={flushOnRefreshEvent ? `${camelCaseEntityName}s:refresh` : null}
                        />
                    </Form.Field>
                );
            }

            return null;
        };

        return (
            <Form size="small">
                <Form.Group inline widths="equal">
                    {[
                        createDropdown({
                            entityName: 'Blueprint',
                            fetchManagerEndpoint: 'blueprints?state=uploaded',
                            flushOnRefreshEvent: true
                        }),
                        createDropdown({
                            entityName: 'Deployment',
                            filter: blueprintFilter,
                            pageSize: 20,
                            textFormatter: item =>
                                Stage.Utils.formatDisplayName({ id: item.id, displayName: item.display_name }),
                            fetchIncludeExtra: 'display_name',
                            searchParams: ['_search', '_search_name'],
                            flushOnRefreshEvent: true
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
                            textFormatter: item => (item.workflow_id ? `${item.id} (${item.workflow_id})` : item.id),
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
        );
    }
}

Filter.propTypes = {
    configuration: PropTypes.shape({ allowMultipleSelection: PropTypes.bool }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
