import { each, isEqual } from 'lodash';
import FilterDropdown from './FilterDropdown';
import type { FilterConfiguration } from './types';

const deploymentFilter = { deployment_id: 'deploymentId' };
const blueprintFilter = { blueprint_id: 'blueprintId' };
const blueprintDeploymentFilter = { ...deploymentFilter, ...blueprintFilter };

type FilterField = keyof Stage.ContextEntries;
const filterFields: FilterField[] = [
    'blueprintId',
    'deploymentId',
    'nodeId',
    'nodeInstanceId',
    'executionId',
    'executionStatus',
    'siteName',
    'depNodeId'
];

interface FilterProps {
    configuration: FilterConfiguration;
    toolbox: Stage.Types.Toolbox;
}
type FilterState = Stage.ContextEntries;

export default class Filter extends React.Component<FilterProps, FilterState> {
    private eventHandlers: {
        'deployments:refresh': (deploymentIds?: Stage.ContextEntries['deploymentId']) => void;
        'filter:refresh': () => void;
        'blueprints:refresh': (blueprintIds?: Stage.ContextEntries['blueprintId']) => void;
    };

    constructor(props: FilterProps) {
        super(props);

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
        each(this.eventHandlers, (handler, eventName) => toolbox.getEventBus().on(eventName, handler, this));
    }

    shouldComponentUpdate(nextProps: FilterProps, nextState: FilterState) {
        const { configuration } = this.props;
        return !isEqual(configuration, nextProps.configuration) || !isEqual(this.state, nextState);
    }

    componentDidUpdate(prevProps: FilterProps) {
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
        each(this.eventHandlers, (handler, eventName) => toolbox.getEventBus().off(eventName, handler));
    }

    getStateFromContext() {
        const { toolbox } = this.props;

        return filterFields.reduce((newState, fieldName) => {
            return {
                ...newState,
                [fieldName]: toolbox.getContext().getValue(fieldName) || null
            };
        }, {} as FilterState);
    }

    setValue(name: FilterField, value: Stage.ContextEntries[FilterField]) {
        const { toolbox } = this.props;
        toolbox.getContext().setValue(name, value);
        this.setState((prevState: FilterState) => ({ ...prevState, [name]: value }));
    }

    selectBlueprint = (blueprintIds: Stage.ContextEntries['blueprintId'] = null) => {
        this.setValue('blueprintId', blueprintIds);
        this.setValue('deploymentId', null);
        this.setValue('nodeId', null);
        this.setValue('executionId', null);
        this.updateDeplomentNodeIdValue(null, null);
    };

    selectDeployment = (deploymentIds: Stage.ContextEntries['deploymentId'] = null) => {
        this.setValue('deploymentId', deploymentIds);
        this.setValue('nodeInstanceId', null);
        this.setValue('nodeId', null);
        this.setValue('executionId', null);
        this.updateDeplomentNodeIdValue(null, null);
    };

    selectNode = (nodeIds: Stage.ContextEntries['nodeId']) => {
        const { deploymentId } = this.state;
        this.setValue('nodeId', nodeIds);
        this.setValue('nodeInstanceId', null);
        this.updateDeplomentNodeIdValue(deploymentId, nodeIds);
        this.updateTopologyWidget(nodeIds);
    };

    selectNodeInstance = (nodeInstanceIds: Stage.ContextEntries['nodeInstanceId']) => {
        this.setValue('nodeInstanceId', nodeInstanceIds);
    };

    selectExecution = (executionIds: Stage.ContextEntries['executionId']) => {
        this.setValue('executionId', executionIds);
    };

    selectExecutionStatus = (executionStatuses: Stage.ContextEntries['executionStatus']) => {
        this.setValue('executionStatus', executionStatuses);
    };

    selectSiteName = (siteNames: Stage.ContextEntries['siteName']) => {
        this.setValue('siteName', siteNames);
    };

    updateDeplomentNodeIdValue(
        selectedDeploymentId: Stage.ContextEntries['deploymentId'] | undefined,
        selectedNodeId: Stage.ContextEntries['nodeId']
    ) {
        const { configuration, toolbox } = this.props;
        const { allowMultipleSelection } = configuration;
        const context = toolbox.getContext();
        const isSingleValue = (value: string | string[] | null | undefined) => !Array.isArray(value) && !!value;

        if (!allowMultipleSelection) {
            if (isSingleValue(selectedDeploymentId) && isSingleValue(selectedNodeId)) {
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

    updateTopologyWidget(selectedNodeId: Stage.ContextEntries['nodeId']) {
        const { configuration, toolbox } = this.props;
        const { allowMultipleSelection } = configuration;

        if (!allowMultipleSelection) {
            toolbox.getEventBus().trigger('topology:selectNode', selectedNodeId);
        }
    }

    render() {
        const { Form } = Stage.Basic;
        const { configuration, toolbox } = this.props;
        const { blueprintId, deploymentId, executionId, executionStatus, nodeId, nodeInstanceId, siteName } =
            this.state;

        return (
            <Form size="small">
                <Form.Group inline widths="equal">
                    {configuration.filterByBlueprints && (
                        <FilterDropdown
                            entityName="Blueprint"
                            value={blueprintId}
                            onChange={this.selectBlueprint}
                            toolbox={toolbox}
                            fetchManagerEndpoint="blueprints?state=uploaded"
                            flushOnRefreshEvent
                            multiple={configuration.allowMultipleSelection}
                        />
                    )}
                    {configuration.filterByDeployments && (
                        <FilterDropdown
                            entityName="Deployment"
                            value={deploymentId}
                            onChange={this.selectDeployment}
                            toolbox={toolbox}
                            fetchIncludeExtra="display_name"
                            filter={blueprintFilter}
                            flushOnRefreshEvent
                            multiple={configuration.allowMultipleSelection}
                            pageSize={20}
                            searchParams={['_search', '_search_name']}
                            textFormatter={item =>
                                Stage.Utils.formatDisplayName({ id: item.id, displayName: item.display_name })
                            }
                        />
                    )}
                    {configuration.filterByNodes && (
                        <FilterDropdown
                            entityName="Node"
                            value={nodeId}
                            onChange={this.selectNode}
                            toolbox={toolbox}
                            filter={blueprintDeploymentFilter}
                            multiple={configuration.allowMultipleSelection}
                            pageSize={40}
                        />
                    )}
                    {configuration.filterByNodeInstances && (
                        <FilterDropdown
                            entityName="Node Instance"
                            value={nodeInstanceId}
                            onChange={this.selectNodeInstance}
                            toolbox={toolbox}
                            filter={{ ...deploymentFilter, node_id: 'nodeId' }}
                            multiple={configuration.allowMultipleSelection}
                            pageSize={40}
                        />
                    )}
                    {configuration.filterByExecutions && (
                        <FilterDropdown
                            entityName="Execution"
                            value={executionId}
                            onChange={this.selectExecution}
                            toolbox={toolbox}
                            fetchIncludeExtra="workflow_id"
                            filter={blueprintDeploymentFilter}
                            multiple={configuration.allowMultipleSelection}
                            textFormatter={item => (item.workflow_id ? `${item.id} (${item.workflow_id})` : item.id)}
                            pageSize={20}
                        />
                    )}
                    {configuration.filterByExecutionsStatus && (
                        <FilterDropdown
                            entityName="Execution Status"
                            value={executionStatus}
                            onChange={this.selectExecutionStatus}
                            toolbox={toolbox}
                            fetchManagerEndpoint="executions"
                            fetchAll
                            filter={{ ...blueprintDeploymentFilter, id: 'executionId' }}
                            multiple={configuration.allowMultipleSelection}
                            valueProp="status_display"
                        />
                    )}
                    {configuration.filterBySiteName && (
                        <FilterDropdown
                            entityName="Site Name"
                            value={siteName}
                            onChange={this.selectSiteName}
                            toolbox={toolbox}
                            fetchManagerEndpoint="sites"
                            multiple={configuration.allowMultipleSelection}
                            valueProp="name"
                        />
                    )}
                </Form.Group>
            </Form>
        );
    }
}
