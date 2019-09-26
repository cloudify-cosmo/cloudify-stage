/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

export default class StatusIcon extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        status: PropTypes.object,
        error: PropTypes.string
    };

    static defaultProps = {
        status: {},
        error: ''
    };

    static knownServices = ['database', 'consul', 'cloudify services', 'heartbeat'];

    static numberOfServices = StatusIcon.knownServices.length;

    static managerStatusRunning = 'running';

    static managerStatusWarning = 'warning';

    static managerStatusError = 'error';

    static managerStatusUnknown = 'unknown';

    static statusParameters = {
        [StatusIcon.managerStatusRunning]: {
            icon: 'signal',
            color: 'green',
            text: 'Running'
        },
        [StatusIcon.managerStatusWarning]: {
            icon: 'signal',
            color: 'orange',
            text: 'Warning'
        },
        [StatusIcon.managerStatusError]: {
            icon: 'signal',
            color: 'red',
            text: 'Error'
        },
        [StatusIcon.managerStatusUnknown]: {
            icon: 'question',
            color: 'yellow',
            text: 'Unknown'
        }
    };

    static okStatusString = 'OK';

    static failStatusString = 'FAIL';

    static leaderStateString = 'leader';

    static replicaStateString = 'replica';

    static offlineStateString = 'offline';

    getServices() {
        return _.pick(this.props.status, StatusIcon.knownServices);
    }

    getStatus() {
        const services = this.getServices();

        if (!_.isEmpty(this.props.error)) {
            return StatusIcon.managerStatusError;
        }

        if (_.size(services) === StatusIcon.numberOfServices) {
            if (!_.isEmpty(_.find(services, service => service !== StatusIcon.okStatusString))) {
                return StatusIcon.managerStatusWarning;
            }
            return StatusIcon.managerStatusRunning;
        }
        return StatusIcon.managerStatusUnknown;
    }

    render() {
        const { Icon, Header, Message, Popup, Table } = Stage.Basic;
        const nodeStatusParams = StatusIcon.statusParameters[this.getStatus()];
        const nodeState = _.get(this.props.status, 'state', '');
        const nodeServices = this.getServices();
        const { error } = this.props;

        return (
            <Popup
                on="hover"
                wide
                trigger={<Icon name={nodeStatusParams.icon} color={nodeStatusParams.color} circular inverted />}
            >
                <Popup.Header>Status: {nodeStatusParams.text}</Popup.Header>
                <Popup.Content>
                    {!_.isEmpty(error) && <Message error>{error}</Message>}
                    {!_.isEmpty(nodeServices) && (
                        <Table celled basic="very" collapsing className="servicesData">
                            <Table.Body>
                                {!_.isEmpty(nodeState) && (
                                    <Table.Row key="state">
                                        <Table.Cell collapsing>State</Table.Cell>
                                        <Table.Cell textAlign="center">
                                            <Header as="h5">
                                                <Icon
                                                    name={
                                                        nodeState === StatusIcon.leaderStateString
                                                            ? 'users'
                                                            : nodeState === StatusIcon.replicaStateString
                                                            ? 'copy'
                                                            : nodeState === StatusIcon.offlineStateString
                                                            ? 'remove'
                                                            : 'question'
                                                    }
                                                />
                                                {_.upperFirst(nodeState)}
                                            </Header>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                                {_.map(nodeServices, (status, service) => (
                                    <Table.Row key={service}>
                                        <Table.Cell collapsing>{_.upperFirst(service)}</Table.Cell>
                                        <Table.Cell textAlign="center">
                                            <Header
                                                as="h5"
                                                color={status === StatusIcon.okStatusString ? 'green' : 'red'}
                                            >
                                                <Icon
                                                    name={
                                                        status === StatusIcon.okStatusString ? 'checkmark' : 'warning'
                                                    }
                                                />
                                                {status}
                                            </Header>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    )}
                </Popup.Content>
            </Popup>
        );
    }
}
