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

    handleClick = event => {
        const { manager, onFail, onStart, onSuccess, toolbox } = this.props;
        event.stopPropagation();

        this.setState({ loading: true });

        const managerId = manager.id;
        const actions = new Actions(toolbox);

        return actions.getClusterStatus(managerId, onStart, onSuccess, onFail, () => this.setState({ loading: false }));
    };

    render() {
        const { loading } = this.state;
        const { Icon, Popup } = Stage.Basic;

        return (
            <Popup
                trigger={
                    loading ? (
                        <Icon name="spinner" loading disabled />
                    ) : (
                        <Icon name="refresh" link bordered onClick={this.handleClick} />
                    )
                }
                content={loading ? 'Status refresh in progress...' : 'Refresh Status'}
            />
        );
    }
}

RefreshIcon.propTypes = {
    manager: PropTypes.shape({ id: PropTypes.string }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    onStart: PropTypes.func,
    onSuccess: PropTypes.func,
    onFail: PropTypes.func
};

RefreshIcon.defaultProps = {
    onStart: _.noop,
    onSuccess: _.noop,
    onFail: _.noop
};
