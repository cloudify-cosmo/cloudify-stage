import type { FilterConfiguration } from 'widgets/filter/src/types';
import type { DynamicDropdownProps } from 'app/widgets/common/components/DynamicDropdown';

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
        'deployments:refresh': (deploymentIds?: any) => void;
        'filter:refresh': () => void;
        'blueprints:refresh': (blueprintIds?: any) => void;
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
        _.each(this.eventHandlers, (handler, eventName) => toolbox.getEventBus().on(eventName, handler, this));
    }

    shouldComponentUpdate(nextProps: FilterProps, nextState: FilterState) {
        const { configuration } = this.props;
        return !_.isEqual(configuration, nextProps.configuration) || !_.isEqual(this.state, nextState);
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
        _.each(this.eventHandlers, (handler, eventName) => toolbox.getEventBus().off(eventName, handler));
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

        if (!allowMultipleSelection) {
            if (
                !Array.isArray(selectedNodeId) &&
                !Array.isArray(selectedDeploymentId) &&
                !!selectedDeploymentId &&
                !!selectedNodeId
            ) {
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

        interface FilterDropdownProps {
            entityName:
                | 'Blueprint'
                | 'Deployment'
                | 'Node'
                | 'Node Instance'
                | 'Execution'
                | 'Execution Status'
                | 'Site Name';
            onChange: DynamicDropdownProps['onChange'];
            stateProp: keyof FilterState;
            enabledConfigurationKey: keyof FilterConfiguration;
            fetchAll?: boolean;
            fetchIncludeExtra?: string;
            fetchManagerEndpoint?: string;
            filter?: Record<string, string>;
            flushOnRefreshEvent?: boolean;
            pageSize?: number;
            searchParams?: string[];
            textFormatter?: (...args: any) => string;
            valueProp?: string;
        }

        const createDropdown = ({
            entityName,
            onChange,
            stateProp,
            enabledConfigurationKey,
            fetchAll,
            fetchIncludeExtra,
            fetchManagerEndpoint,
            filter,
            flushOnRefreshEvent,
            pageSize,
            searchParams,
            textFormatter,
            valueProp
        }: FilterDropdownProps) => {
            const { DynamicDropdown } = Stage.Common.Components;
            const { appendQueryParam } = Stage.Utils.Url;
            const { configuration, toolbox } = this.props;

            if (configuration[enabledConfigurationKey]) {
                const camelCaseEntityName = _.lowerFirst(entityName.replace(' ', ''));
                const { [stateProp]: value } = this.state;
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
                            onChange={onChange}
                            toolbox={toolbox}
                            value={value}
                            placeholder={entityName}
                            fetchAll={fetchAll}
                            textFormatter={textFormatter}
                            valueProp={valueProp}
                            pageSize={pageSize}
                            filter={filter}
                            className={`${camelCaseEntityName}FilterField`}
                            refreshEvent={flushOnRefreshEvent ? `${camelCaseEntityName}s:refresh` : undefined}
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
                            stateProp: 'blueprintId',
                            enabledConfigurationKey: 'filterByBlueprints',
                            onChange: this.selectBlueprint,
                            fetchManagerEndpoint: 'blueprints?state=uploaded',
                            flushOnRefreshEvent: true
                        }),
                        createDropdown({
                            entityName: 'Deployment',
                            stateProp: 'deploymentId',
                            enabledConfigurationKey: 'filterByDeployments',
                            onChange: this.selectDeployment,
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
                            stateProp: 'nodeId',
                            enabledConfigurationKey: 'filterByNodes',
                            onChange: this.selectNode,
                            filter: blueprintDeploymentFilter,
                            pageSize: 40
                        }),
                        createDropdown({
                            entityName: 'Node Instance',
                            stateProp: 'nodeInstanceId',
                            enabledConfigurationKey: 'filterByNodeInstances',
                            onChange: this.selectNodeInstance,
                            filter: { ...deploymentFilter, node_id: 'nodeId' },
                            pageSize: 40
                        }),
                        createDropdown({
                            entityName: 'Execution',
                            stateProp: 'executionId',
                            enabledConfigurationKey: 'filterByExecutions',
                            onChange: this.selectExecution,
                            fetchIncludeExtra: 'workflow_id',
                            textFormatter: item => (item.workflow_id ? `${item.id} (${item.workflow_id})` : item.id),
                            filter: blueprintDeploymentFilter,
                            pageSize: 20
                        }),
                        createDropdown({
                            entityName: 'Execution Status',
                            stateProp: 'executionStatus',
                            enabledConfigurationKey: 'filterByExecutionsStatus',
                            onChange: this.selectExecutionStatus,
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
                            onChange: this.selectSiteName,
                            fetchManagerEndpoint: 'sites',
                            valueProp: 'name'
                        })
                    ]}
                </Form.Group>
            </Form>
        );
    }
}
