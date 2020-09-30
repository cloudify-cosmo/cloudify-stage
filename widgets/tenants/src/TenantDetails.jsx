/**
 * Created by jakubniezgoda on 02/02/2017.
 */

import Actions from './actions';
import UserRoles from './UserRoles';
import TenantPropType from './props/TenantPropType';

export default class TenantDetails extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            processing: false,
            processItem: ''
        };
    }

    removeUser(username) {
        const { onError, tenant, toolbox } = this.props;
        this.setState({ processItem: username, processing: true });

        const actions = new Actions(toolbox);
        actions
            .doRemoveUser(tenant.name, username)
            .then(() => {
                toolbox.refresh();
                toolbox.getEventBus().trigger('users:refresh');
                this.setState({ processItem: '', processing: false });
            })
            .catch(err => {
                onError(err.message);
                this.setState({ processItem: '', processing: false });
            });
    }

    removeUserGroup(group) {
        const { onError, tenant, toolbox } = this.props;
        this.setState({ processItem: group, processing: true });

        const actions = new Actions(toolbox);
        actions
            .doRemoveUserGroup(tenant.name, group)
            .then(() => {
                toolbox.refresh();
                toolbox.getEventBus().trigger('userGroups:refresh');
                this.setState({ processItem: '', processing: false });
            })
            .catch(err => {
                onError(err.message);
                this.setState({ processItem: '', processing: false });
            });
    }

    render() {
        const { processItem, processing: processingState } = this.state;
        const { Segment, List, Icon, Message, Divider, Popup } = Stage.Basic;
        const { tenant } = this.props;

        return (
            <Segment.Group horizontal>
                <Segment>
                    <Icon name="users" /> Groups
                    <Divider />
                    <List divided relaxed verticalAlign="middle" className="light">
                        {_.map(tenant.groups, (role, group) => {
                            const processing = processingState && processItem === group;

                            return (
                                <List.Item key={group}>
                                    {group} - {role}
                                    <Icon
                                        link
                                        name={processing ? 'notched circle' : 'remove'}
                                        loading={processing}
                                        className="right floated"
                                        onClick={() => this.removeUserGroup(group)}
                                    />
                                </List.Item>
                            );
                        })}

                        {_.isEmpty(tenant.groups) && <Message content="No groups available" />}
                    </List>
                </Segment>

                <Popup>
                    <Popup.Trigger>
                        <Segment>
                            <Icon name="user" /> Users
                            <Divider />
                            <List divided relaxed verticalAlign="middle" className="light">
                                {_.map(tenant.users, (data, user) => {
                                    const processing = processingState && processItem === user;

                                    return (
                                        <List.Item key={user}>
                                            {user} - <UserRoles tenant={tenant} user={user} />
                                            <Icon
                                                link
                                                name={processing ? 'notched circle' : 'remove'}
                                                loading={processing}
                                                className="right floated"
                                                onClick={() => this.removeUser(user)}
                                            />
                                        </List.Item>
                                    );
                                })}

                                {_.isEmpty(tenant.users) && <Message content="No users available" />}
                            </List>
                        </Segment>
                    </Popup.Trigger>
                    <Popup.Content>
                        The users assigned to this tenant, and the assigned roles. When the roles are inherited from a
                        user group, the name of the user group is also shown, for example: viewer (Viewers)
                    </Popup.Content>
                </Popup>
            </Segment.Group>
        );
    }
}

TenantDetails.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    tenant: TenantPropType.isRequired,
    onError: PropTypes.func.isRequired
};
