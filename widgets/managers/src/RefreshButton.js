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
        managers: PropTypes.arrayOf(PropTypes.string).isRequired,
        toolbox: Stage.PropTypes.Toolbox.isRequired,
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
        const { managers, onFail, onStart, onSuccess, toolbox } = this.props;
        event.stopPropagation();

        this.setState({ loading: true });

        const actions = new Actions(toolbox);

        const clusterStatusPromise = managerId => actions.getClusterStatus(managerId, _.noop, onSuccess, onFail);
        const clusterStatusPromises = _.map(managers, managerId => clusterStatusPromise(managerId));
        onStart(managers);

        return Promise.all(clusterStatusPromises).then(() => this.setState({ loading: false }));
    }

    render() {
        const { loading } = this.state;
        const { Button, Popup } = Stage.Basic;
        const { managers } = this.props;

        return (
            <Popup
                on={_.isEmpty(managers) || loading ? 'hover' : []}
                open={_.isEmpty(managers) || loading ? undefined : false}
            >
                <Popup.Trigger>
                    <div>
                        <Button
                            icon="refresh"
                            content="Refresh Status"
                            labelPosition="left"
                            disabled={_.isEmpty(managers) || loading}
                            loading={loading}
                            onClick={this.handleClick.bind(this)}
                        />
                    </div>
                </Popup.Trigger>

                <Popup.Content>
                    {loading
                        ? 'Bulk status refresh in progress...'
                        : 'Tick at least one manager to perform bulk status refresh'}
                </Popup.Content>
            </Popup>
        );
    }
}
