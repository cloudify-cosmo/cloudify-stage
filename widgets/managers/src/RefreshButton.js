/**
 * Created by jakub.niezgoda on 31/10/2018.
 */

import Actions from './actions';

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
        onStart: PropTypes.func,
        onSuccess: PropTypes.func,
        onFail: PropTypes.func
    };

    static defaultProps = {
        onStart: _.noop,
        onSuccess: _.noop,
        onFail: _.noop
    };

    handleClick(event) {
        event.stopPropagation();

        this.setState({ loading: true });

        const actions = new Actions(this.props.toolbox);

        const clusterStatusPromise = managerId =>
            actions.getClusterStatus(managerId, this.props.onStart, this.props.onSuccess, this.props.onFail);
        const clusterStatusPromises = _.map(this.props.managers, managerId => clusterStatusPromise(managerId));

        return Promise.all(clusterStatusPromises).then(() => this.setState({ loading: false }));
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
