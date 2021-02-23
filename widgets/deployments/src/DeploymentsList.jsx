import DeploymentsSegment from './DeploymentsSegment';
import DeploymentsTable from './DeploymentsTable';

export default class DeploymentsList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            activeAction: '',
            deploymentId: '',
            error: null,
            showExecuteModal: false,
            workflowName: ''
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('deployments:refresh', this.refreshData, this);
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
        toolbox.getEventBus().off('deployments:refresh', this.refreshData);
    }

    setDeploymentVisibility = (deploymentId, visibility) => {
        const { toolbox } = this.props;
        const actions = new Stage.Common.DeploymentActions(toolbox);
        toolbox.loading(true);
        actions
            .doSetVisibility(deploymentId, visibility)
            .then(() => toolbox.refresh())
            .catch(err => this.setState({ error: err.message }))
            .finally(() => toolbox.loading(false));
    };

    setError = errorMessage => {
        this.setState({ error: errorMessage });
    };

    selectDeployment = item => {
        const { toolbox, widget } = this.props;
        if (widget.configuration.clickToDrillDown) {
            toolbox.drillDown(widget, 'deployment', { deploymentId: item.id }, item.id);
        } else {
            const oldSelectedDeploymentId = toolbox.getContext().getValue('deploymentId');
            toolbox.getContext().setValue('deploymentId', item.id === oldSelectedDeploymentId ? null : item.id);
        }
    };

    actOnExecution = (execution, action, error) => {
        this.setError(error);
    };

    openExecuteModal = (deploymentId, workflowName) => {
        this.setState({ deploymentId, workflowName }, () => this.setState({ showExecuteModal: true }));
    };

    hideExecuteModal = () => {
        this.setState({ showExecuteModal: false });
    };

    openActionModal = (deploymentId, actionName) => {
        this.setState({ deploymentId }, () => this.setState({ activeAction: actionName }));
    };

    hideActionModal = () => {
        this.setState({ activeAction: '' });
    };

    fetchData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    render() {
        const { activeAction, deploymentId, error, showExecuteModal, workflowName } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Deployments available. Click "Create deployment" to add deployments.';
        const { ErrorMessage } = Stage.Basic;
        const { DeploymentActionsModals, ExecuteDeploymentModal } = Stage.Common;
        const showTableComponent = widget.configuration.displayStyle === 'table';

        const DeploymentsView = showTableComponent ? DeploymentsTable : DeploymentsSegment;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />
                <DeploymentsView
                    widget={widget}
                    data={data}
                    fetchData={this.fetchData}
                    onSelectDeployment={this.selectDeployment}
                    onDeploymentAction={this.openActionModal}
                    onWorkflowAction={this.openExecuteModal}
                    onActOnExecution={this.actOnExecution}
                    onError={this.setError}
                    onSetVisibility={this.setDeploymentVisibility}
                    noDataMessage={NO_DATA_MESSAGE}
                    showExecutionStatusLabel={widget.configuration.showExecutionStatusLabel}
                    toolbox={toolbox}
                />
                {deploymentId && (
                    <ExecuteDeploymentModal
                        deploymentId={deploymentId}
                        onHide={this.hideExecuteModal}
                        open={showExecuteModal}
                        toolbox={toolbox}
                        workflow={workflowName}
                    />
                )}
                {deploymentId && (
                    <DeploymentActionsModals
                        activeAction={activeAction}
                        deploymentId={deploymentId}
                        onHide={this.hideActionModal}
                        toolbox={toolbox}
                    />
                )}
            </div>
        );
    }
}

DeploymentsList.propTypes = {
    data: PropTypes.shape({}).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
