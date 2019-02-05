/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

export default class RefreshIcon extends React.Component {

    constructor(props, context){
        super(props, context);

        this.state = {
            loading: false
        }
    }

    static propTypes = {
        manager: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        onSuccess: PropTypes.func,
        onFail: PropTypes.func
    };

    static defaultProps = {
        onSuccess: _.noop,
        onFail: _.noop
    };

    handleClick(event) {
        event.stopPropagation();

        this.setState({loading: true});

        const executionStatusCheckInterval = 2000; //ms
        let {DeploymentActions, ExecutionActions} = Stage.Common;
        let managerId = this.props.manager.id;
        let deploymentActions = new DeploymentActions(this.props.toolbox);
        let executionActions = new ExecutionActions(this.props.toolbox);

        return deploymentActions.doExecute({id: managerId}, {name: 'get_status'}, {})
            .then((result) => {
                this.props.toolbox.refresh();
                return executionActions.waitUntilFinished(result.id, executionStatusCheckInterval);
            })
            .then((result) => this.props.onSuccess(result))
            .catch((error) => this.props.onFail(error.message))
            .finally(() => this.setState({loading: false}));
    }

    render() {
        let {Icon, Popup} = Stage.Basic;

        return (
            <Popup trigger={this.state.loading
                            ? <Icon name='spinner' loading disabled />
                            : <Icon name='refresh' link bordered onClick={this.handleClick.bind(this)} />}
                   content={this.state.loading ? 'Status refresh in progress...' : 'Refresh Status'} />
        );
    }
}

