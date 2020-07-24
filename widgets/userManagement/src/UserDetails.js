/**
 * Created by pposel on 30/01/2017.
 */

import Actions from './actions';
import UserPropType from './props/UserPropType';

export default class UserDetails extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            processing: false,
            processItem: ''
        };
    }

    static propTypes = {
        toolbox: Stage.PropTypes.Toolbox.isRequired,
        data: UserPropType.isRequired,
        onError: PropTypes.func.isRequired
    };

    removeTenant(tenant) {
        const { data, onError, toolbox } = this.props;
        this.setState({ processItem: tenant, processing: true });

        const actions = new Actions(toolbox);
        actions
            .doRemoveFromTenant(data.username, tenant)
            .then(() => {
                toolbox.refresh();
                toolbox.getEventBus().trigger('tenants:refresh');
                this.setState({ processItem: '', processing: false });
            })
            .catch(err => {
                onError(err.message);
                this.setState({ processItem: '', processing: false });
            });
    }

    removeGroup(group) {
        const { data, onError, toolbox } = this.props;
        this.setState({ processItem: group, processing: true });

        const actions = new Actions(toolbox);
        actions
            .doRemoveFromGroup(data.username, group)
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
        const { data } = this.props;
        const { Segment, List, Icon, Message, Divider, Popup } = Stage.Basic;
        const { RolesPresenter } = Stage.Common;

        return (
            <Segment.Group horizontal>
                <Segment>
                    <Icon name="users" /> Groups
                    <Divider />
                    <List divided relaxed verticalAlign="middle" className="light">
                        {data.groups.map(item => {
                            const processing = processingState && processItem === item;

                            return (
                                <List.Item key={item}>
                                    {item}
                                    <Icon
                                        link
                                        name={processing ? 'notched circle' : 'remove'}
                                        loading={processing}
                                        className="right floated"
                                        onClick={this.removeGroup.bind(this, item)}
                                    />
                                </List.Item>
                            );
                        })}

                        {_.isEmpty(data.groups) && <Message content="No groups available" />}
                    </List>
                </Segment>

                <Popup>
                    <Popup.Trigger>
                        <Segment>
                            <Icon name="user" /> Tenants
                            <Divider />
                            <List divided relaxed verticalAlign="middle" className="light">
                                {_.map(_.keys(data.tenants), item => {
                                    const processing = processingState && processItem === item;

                                    return (
                                        <List.Item key={item}>
                                            {item} -{' '}
                                            <RolesPresenter
                                                directRole={data.tenant_roles.direct[item]}
                                                groupRoles={data.tenant_roles.groups[item]}
                                            />
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
                    </Popup.Trigger>
                    <Popup.Content>
                        The tenants that this user is assigned to, and the assigned roles. When the roles are inherited
                        from a user group, the name of the user group is also shown, for example: viewer (Viewers)
                    </Popup.Content>
                </Popup>
            </Segment.Group>
        );
    }
}
