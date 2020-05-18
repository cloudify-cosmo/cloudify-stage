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
        this.setState({ processItem: tenant, processing: true });

        const actions = new Actions(this.props.toolbox);
        actions
            .doRemoveTenantFromGroup(tenant, this.props.data.name)
            .then(() => {
                this.props.toolbox.refresh();
                this.props.toolbox.getEventBus().trigger('users:refresh');
                this.props.toolbox.getEventBus().trigger('tenants:refresh');
                this.setState({ processItem: '', processing: false });
            })
            .catch(err => {
                this.props.onError(err.message);
                this.setState({ processItem: '', processing: false });
            });
    }

    removeUser(username) {
        this.setState({ processItem: username, processing: true });

        const actions = new Actions(this.props.toolbox);
        actions
            .doRemoveUserFromGroup(username, this.props.data.name)
            .then(() => {
                if (this.state.showModal) {
                    this.props.toolbox.getEventBus().trigger('menu.users:logout');
                }
                this.setState({ processItem: '', processing: false });
                this.props.toolbox.refresh();
                this.props.toolbox.getEventBus().trigger('users:refresh');
                this.props.toolbox.getEventBus().trigger('tenants:refresh');
            })
            .catch(err => {
                this.props.onError(err.message);
                this.setState({ processItem: '', processing: false });
            });
    }

    removeUserOrShowModal(username) {
        const actions = new Actions(this.props.toolbox);

        if (actions.isLogoutToBePerformed(this.props.data, this.props.groups, [username])) {
            this.setState({ user: username, showModal: true });
        } else {
            this.removeUser(username);
        }
    }

    hideModal() {
        this.setState({ user: '', showModal: false });
    }

    render() {
        const { Confirm, Divider, Icon, List, Message, Segment } = Stage.Basic;

        return (
            <Segment.Group horizontal>
                <Segment>
                    <Icon name="users" /> Users
                    <Divider />
                    <List divided relaxed verticalAlign="middle" className="light">
                        {this.props.data.users.map(item => {
                            const processing = this.state.processing && this.state.processItem === item;

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

                        {_.isEmpty(this.props.data.users) && <Message content="No users available" />}
                    </List>
                </Segment>
                <Segment>
                    <Icon name="users" /> Tenants
                    <Divider />
                    <List divided relaxed verticalAlign="middle" className="light">
                        {_.map(this.props.data.tenants, (role, item) => {
                            const processing = this.state.processing && this.state.processItem === item;

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

                        {_.isEmpty(this.props.data.tenants) && <Message content="No tenants available" />}
                    </List>
                </Segment>

                <Confirm
                    content={
                        `You have administrator privileges from the '${this.props.data.name}' group.` +
                        'Are you sure you want to remove yourself from this group? ' +
                        'You will be logged out of the system so the changes take effect.'
                    }
                    open={this.state.showModal}
                    onConfirm={this.removeUser.bind(this, this.state.user)}
                    onCancel={this.hideModal.bind(this)}
                />
            </Segment.Group>
        );
    }
}
