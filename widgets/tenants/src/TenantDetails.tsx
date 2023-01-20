import type { Toolbox } from 'app/utils/StageAPI';
import type { Tenant } from './widget.types';
import Actions from './actions';
import UserRoles from './UserRoles';

interface TenantDetailsProps {
    toolbox: Toolbox;
    tenant: Tenant;
    onError: (error: any) => void;
}

interface TenantDetailsState {
    processing?: boolean;
    processItem?: string;
}

export default class TenantDetails extends React.Component<TenantDetailsProps, TenantDetailsState> {
    constructor(props: TenantDetailsProps) {
        super(props);

        this.state = {};
    }

    removeUser(username: string) {
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

    removeUserGroup(group: string) {
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
                                        name={processing ? 'circle notched' : 'remove'}
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
                                {Object.keys(tenant.users).map(user => {
                                    const processing = processingState && processItem === user;

                                    return (
                                        <List.Item key={user}>
                                            {user} - <UserRoles tenant={tenant} user={user} />
                                            <Icon
                                                link
                                                name={processing ? 'circle notched' : 'remove'}
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
