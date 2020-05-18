/**
 * Created by jakubniezgoda on 03/02/2017.
 */

import Actions from './actions';

export default class UserDetails extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            processing: false,
            processItem: '',
            showModal: false,
            user: ''
        };
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        groups: PropTypes.array.isRequired,
        onError: PropTypes.func
    };

    removeTenant(tenant) {
        const { data, onError, toolbox } = this.props;
        this.setState({ processItem: tenant, processing: true });

        const actions = new Actions(toolbox);
        actions
            .doRemoveTenantFromGroup(tenant, data.name)
            .then(() => {
                toolbox.refresh();
                toolbox.getEventBus().trigger('users:refresh');
                toolbox.getEventBus().trigger('tenants:refresh');
                this.setState({ processItem: '', processing: false });
            })
            .catch(err => {
                onError(err.message);
                this.setState({ processItem: '', processing: false });
            });
    }

    removeUser(username) {
        const { data, onError, toolbox } = this.props;
        this.setState({ processItem: username, processing: true });

        const actions = new Actions(toolbox);
        actions
            .doRemoveUserFromGroup(username, data.name)
            .then(() => {
                const { showModal } = this.state;
                if (showModal) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                }
                this.setState({ processItem: '', processing: false });
                toolbox.refresh();
                toolbox.getEventBus().trigger('users:refresh');
                toolbox.getEventBus().trigger('tenants:refresh');
            })
            .catch(err => {
                onError(err.message);
                this.setState({ processItem: '', processing: false });
            });
    }

    removeUserOrShowModal(username) {
        const { data, groups, toolbox } = this.props;
        const actions = new Actions(toolbox);

        if (actions.isLogoutToBePerformed(data, groups, [username])) {
            this.setState({ user: username, showModal: true });
        } else {
            this.removeUser(username);
        }
    }

    hideModal() {
        this.setState({ user: '', showModal: false });
    }

    render() {
        const { processItem, processing: processingState, showModal, user } = this.state;
        const { data } = this.props;
        const { Confirm, Divider, Icon, List, Message, Segment } = Stage.Basic;

        return (
            <Segment.Group horizontal>
                <Segment>
                    <Icon name="users" /> Users
                    <Divider />
                    <List divided relaxed verticalAlign="middle" className="light">
                        {data.users.map(item => {
                            const processing = processingState && processItem === item;

                            return (
                                <List.Item key={item}>
                                    {item}
                                    <Icon
                                        link
                                        name={processing ? 'notched circle' : 'remove'}
                                        loading={processing}
                                        className="right floated"
                                        onClick={this.removeUserOrShowModal.bind(this, item)}
                                    />
                                </List.Item>
                            );
                        })}

                        {_.isEmpty(data.users) && <Message content="No users available" />}
                    </List>
                </Segment>
                <Segment>
                    <Icon name="users" /> Tenants
                    <Divider />
                    <List divided relaxed verticalAlign="middle" className="light">
                        {_.map(data.tenants, (role, item) => {
                            const processing = processingState && processItem === item;

                            return (
                                <List.Item key={item}>
                                    {item} - {role}
                                    <Icon
                                        link
                                        name={processing ? 'notched circle' : 'remove'}
                                        loading={processing}
                                        className="right floated"
                                        onClick={this.removeTenant.bind(this, item)}
                                    />
                                </List.Item>
                            );
                        })}

                        {_.isEmpty(data.tenants) && <Message content="No tenants available" />}
                    </List>
                </Segment>

                <Confirm
                    content={
                        `You have administrator privileges from the '${data.name}' group.` +
                        'Are you sure you want to remove yourself from this group? ' +
                        'You will be logged out of the system so the changes take effect.'
                    }
                    open={showModal}
                    onConfirm={this.removeUser.bind(this, user)}
                    onCancel={this.hideModal.bind(this)}
                />
            </Segment.Group>
        );
    }
}
