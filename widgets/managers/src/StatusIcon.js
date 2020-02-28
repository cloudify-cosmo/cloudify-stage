/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

export default class StatusIcon extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        status: PropTypes.object,
        isFetching: PropTypes.bool
    };

    static defaultProps = {
        status: {},
        isFetching: false
    };

    render() {
        const { Icon, Popup } = Stage.Basic;
        const { ClusterStatusIcon, ClusterServicesOverview } = Stage.Shared;

        const { isFetching } = this.props;
        const { status, services } = this.props.status;

        return isFetching ? (
            <Icon name="spinner" loading disabled />
        ) : (
            <Popup
                on="hover"
                wide
                trigger={
                    <div>
                        <ClusterStatusIcon status={status} />
                    </div>
                }
            >
                <Popup.Content>
                    <ClusterServicesOverview services={services} />
                </Popup.Content>
            </Popup>
        );
    }
}
