// @ts-nocheck File not migrated fully to TS

import Actions from './actions';

const t = Stage.Utils.getT('widgets.managers.actions');

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
                        <Icon name="refresh" link onClick={this.handleClick} />
                    )
                }
                content={loading ? t('refreshStatusInProgress') : t('refreshStatus')}
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
