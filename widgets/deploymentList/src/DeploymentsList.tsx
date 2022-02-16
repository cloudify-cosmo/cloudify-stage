import DeploymentsTable from './DeploymentsTable';
import { DeploymentListWidget } from './types/DeploymentList';
import type DeploymentsTableDataType from './types/DeploymentsTableDataType';

interface DeploymentListProps {
    widget: Stage.Types.Widget<DeploymentListWidget.Configuration>;
    toolbox: Stage.Types.Toolbox;
    data: DeploymentsTableDataType
}

interface DeploymentListState {
    error: string | null;
}

export default class DeploymentList extends React.Component<DeploymentListProps, DeploymentListState> {
    constructor(props: DeploymentListProps) {
        super(props);

        this.state = {
            error: null,
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('deployments:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: DeploymentListProps, nextState: DeploymentListState) {
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

    setError = (errorMessage: string) => {
        this.setState({ error: errorMessage });
    };

    fetchData = (fetchParams: any) => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    onDismiss() {
        this.setState({ error: null });
    }

    render() {
        const { error } = this.state;
        const { data, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Deployments available.';
        const { ErrorMessage } = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={this.onDismiss} autoHide />
                <DeploymentsTable
                    widget={widget}
                    data={data}
                    fetchData={this.fetchData}
                    noDataMessage={NO_DATA_MESSAGE}
                />
            </div>
        );
    }
}

