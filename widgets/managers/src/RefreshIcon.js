/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

import Actions from './actions';

export default class RefreshIcon extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loading: false
        };
    }

    static propTypes = {
        manager: PropTypes.object.isRequired,
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

        const managerId = this.props.manager.id;
        const actions = new Actions(this.props.toolbox);

        return actions.getClusterStatus(managerId, this.props.onStart, this.props.onSuccess, this.props.onFail, () =>
            this.setState({ loading: false })
        );
    }

    render() {
        const { Icon, Popup } = Stage.Basic;

        return (
            <Popup
                trigger={
                    this.state.loading ? (
                        <Icon name="spinner" loading disabled />
                    ) : (
                        <Icon name="refresh" link bordered onClick={this.handleClick.bind(this)} />
                    )
                }
                content={this.state.loading ? 'Status refresh in progress...' : 'Refresh Status'}
            />
        );
    }
}
