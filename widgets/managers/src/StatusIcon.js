/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

export default class StatusIcon extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        status: PropTypes.object
    };

    static defaultProps = {
        status: {}
    };

    render() {
        const { Popup, Cluster } = Stage.Basic;
        const { ClusterStatusIcon, ClusterServicesOverview } = Cluster;
        const { status, services } = this.props.status;

        return (
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
