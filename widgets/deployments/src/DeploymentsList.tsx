import type { Deployment } from '../../common/src/deploymentsView/types';
import type { Visibility } from '../../common/src/types';
import DeploymentsSegment from './DeploymentsSegment';
import DeploymentsTable from './DeploymentsTable';

const t = Stage.Utils.getT('widgets.deployments.list');

type DeploymentResponse = Stage.Types.PaginatedResponse<Deployment> & DeploymentData;

interface DeploymentData {
    blueprintId?: string;
    searchValue?: string;
    total: number;
}
interface DeploymentsListProps {
    data: DeploymentResponse;
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget;
}

interface DeploymentsListState {
    activeAction: string | null;
    deployment: Deployment | null;
    error: string | null;
    executeModalOpen: boolean;
    workflowName: string | null;
}

interface SelectedDeployment {
    id: string | string[] | null | undefined;
    // eslint-disable-next-line camelcase
    display_name: string;
}

export default class DeploymentsList extends React.Component<DeploymentsListProps, DeploymentsListState> {
    constructor(props: DeploymentsListProps, context: any) {
        super(props, context);

        this.state = {
            activeAction: null,
            deployment: null,
            error: null,
            executeModalOpen: false,
            workflowName: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('deployments:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: DeploymentsListProps, nextState: DeploymentsListState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('deployments:refresh', this.refreshData);
    }

    setDeploymentVisibility = (deploymentId: string, visibility: Visibility) => {
        const { toolbox } = this.props;
        const actions = new Stage.Common.Deployments.Actions(toolbox);
        toolbox.loading(true);
        actions
            .doSetVisibility(deploymentId, visibility)
            .then(() => toolbox.refresh())
            .catch(err => this.setState({ error: err.message }))
            .finally(() => toolbox.loading(false));
    };

    setError = (errorMessage: string) => {
        this.setState({ error: errorMessage });
    };

    // eslint-disable-next-line camelcase
    selectDeployment = ({ id, display_name }: SelectedDeployment) => {
        const { toolbox, widget } = this.props;
        if (widget.configuration.clickToDrillDown) {
            toolbox.drillDown(widget, 'deployment', { deploymentId: id }, display_name);
        } else {
            const oldSelectedDeploymentId = toolbox.getContext().getValue('deploymentId');
            toolbox.getContext().setValue('deploymentId', id === oldSelectedDeploymentId ? null : id);
        }
    };

    actOnExecution = (_execution: any, _action: any, executionError: string) => {
        this.setError(executionError);
    };

    openExecuteModal = (deployment: Deployment, workflowName: string) => {
        this.setState({ deployment, executeModalOpen: true, workflowName });
    };

    hideExecuteModal = () => {
        this.setState({ executeModalOpen: false, workflowName: null });
    };

    openActionModal = (deployment: Deployment, actionName: string) => {
        this.setState({ deployment, activeAction: actionName });
    };

    hideActionModal = () => {
        this.setState({ activeAction: null });
    };

    fetchData = (fetchParams: Stage.Types.ManagerGridParams) => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    render() {
        const { activeAction, deployment, error, executeModalOpen, workflowName } = this.state;
        const { data, toolbox, widget } = this.props;
        const { ErrorMessage } = Stage.Basic;
        const ExecuteWorkflowModal = Stage.Common.Workflows.ExecuteModal;
        const DeploymentActionsModals = Stage.Common.Deployments.ActionsModals;

        const { displayStyle, showExecutionStatusLabel } = widget.configuration;
        const showTableComponent = displayStyle === 'table';

        const DeploymentsView = showTableComponent ? DeploymentsTable : DeploymentsSegment;

        return (
            <>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />
                <DeploymentsView
                    widget={widget}
                    data={data}
                    fetchData={this.fetchData}
                    onSelectDeployment={this.selectDeployment}
                    onDeploymentAction={this.openActionModal}
                    onWorkflowAction={this.openExecuteModal}
                    onActOnExecution={this.actOnExecution}
                    onSetVisibility={this.setDeploymentVisibility}
                    noDataMessage={t('noDeployments')}
                    showExecutionStatusLabel={showExecutionStatusLabel as boolean}
                    toolbox={toolbox}
                />
                {deployment && workflowName && (
                    <ExecuteWorkflowModal
                        deploymentId={deployment.id}
                        deploymentName={deployment.display_name}
                        onHide={this.hideExecuteModal}
                        open={executeModalOpen}
                        toolbox={toolbox}
                        workflow={workflowName}
                    />
                )}
                {activeAction && deployment && (
                    <DeploymentActionsModals
                        activeAction={activeAction}
                        deploymentId={deployment.id}
                        deploymentName={deployment.display_name}
                        onHide={this.hideActionModal}
                        toolbox={toolbox}
                        redirectToParentPageAfterDelete={false}
                    />
                )}
            </>
        );
    }
}
