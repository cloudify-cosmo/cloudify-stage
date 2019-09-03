/**
 * Created by jakub.niezgoda on 31/10/2018.
 */

export default class RefreshButton extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loading: false
        };
    }

    static propTypes = {
        managers: PropTypes.array.isRequired,
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

        this.setState({ loading: true });

        const executionStatusCheckInterval = 2000; // ms
        const { DeploymentActions, ExecutionActions } = Stage.Common;
        const deploymentActions = new DeploymentActions(this.props.toolbox);
        const executionActions = new ExecutionActions(this.props.toolbox);
        const executePromises = _.map(this.props.managers, manager =>
            deploymentActions.doExecute({ id: manager }, { name: 'get_status' }, {})
        );

        return Promise.all(executePromises)
            .then(results => {
                this.props.toolbox.refresh();
                return executionActions.waitUntilFinished(
                    _.map(results, result => result.id),
                    executionStatusCheckInterval
                );
            })
            .then(result => this.props.onSuccess(result))
            .catch(error => this.props.onFail(error.message))
            .finally(() => this.setState({ loading: false }));
    }

    render() {
        const { Button, Popup } = Stage.Basic;
        const { managers } = this.props;

        return (
            <Popup
                on={_.isEmpty(managers) || this.state.loading ? 'hover' : []}
                open={_.isEmpty(managers) || this.state.loading ? undefined : false}
            >
                <Popup.Trigger>
                    <div>
                        <Button
                            icon="refresh"
                            content="Refresh Status"
                            labelPosition="left"
                            disabled={_.isEmpty(managers) || this.state.loading}
                            loading={this.state.loading}
                            onClick={this.handleClick.bind(this)}
                        />
                    </div>
                </Popup.Trigger>

                <Popup.Content>
                    {this.state.loading
                        ? 'Bulk status refresh in progress...'
                        : 'Tick at least one manager to perform bulk status refresh'}
                </Popup.Content>
            </Popup>
        );
    }
}
