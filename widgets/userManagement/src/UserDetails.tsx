import Actions from './actions';
import type { User } from './widget.types';
import getWidgetT from './getWidgetT';

const detailsT = (key: string) => getWidgetT()(`details.${key}`);

interface UserDetailsProps {
    toolbox: Stage.Types.Toolbox;
    data: User;
    onError: (error: string) => void;
}

interface UserDetailsState {
    processing: boolean;
    processItem: string;
}

export default class UserDetails extends React.Component<UserDetailsProps, UserDetailsState> {
    constructor(props: UserDetailsProps) {
        super(props);

        this.state = {
            processing: false,
            processItem: ''
        };
    }

    removeTenant(tenant: string) {
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

    removeGroup(group: string) {
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
        const RolesPresenter = Stage.Common.Roles.Presenter;

        return (
            <Segment.Group horizontal>
                <Segment>
                    <Icon name="users" /> {detailsT('groups')}
                    <Divider />
                    <List divided relaxed verticalAlign="middle" className="light">
                        {data.groups.map(item => {
                            const processing = processingState && processItem === item;

                            return (
                                <List.Item key={item}>
                                    {item}
                                    <Icon
                                        link
                                        name={processing ? 'circle notched' : 'remove'}
                                        loading={processing}
                                        className="right floated"
                                        onClick={() => this.removeGroup(item)}
                                    />
                                </List.Item>
                            );
                        })}

                        {_.isEmpty(data.groups) && <Message content={detailsT('noGroups')} />}
                    </List>
                </Segment>

                <Popup>
                    <Popup.Trigger>
                        <Segment>
                            <Icon name="user" /> {detailsT('tenants')}
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
                                                name={processing ? 'circle notched' : 'remove'}
                                                loading={processing}
                                                className="right floated"
                                                onClick={() => this.removeTenant(item)}
                                            />
                                        </List.Item>
                                    );
                                })}

                                {_.isEmpty(data.tenants) && <Message content={detailsT('noTenants')} />}
                            </List>
                        </Segment>
                    </Popup.Trigger>
                    <Popup.Content>{detailsT('assignedTenantsNote')}</Popup.Content>
                </Popup>
            </Segment.Group>
        );
    }
}
