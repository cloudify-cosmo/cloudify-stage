import { isEmpty, map } from 'lodash';

import Actions from './actions';
import type { UserGroup } from './widget.types';

const translate = Stage.Utils.getT('widgets.userGroups.details.group.segments');

interface UserDetailsProps {
    toolbox: Stage.Types.Toolbox;
    data: UserGroup;
    groups: UserGroup[];
    onError: (error: string) => void;
}

interface UserDetailsState {
    processing: boolean;
    processItem: string;
    showModal: boolean;
    user: string;
}

export default class UserDetails extends React.Component<UserDetailsProps, UserDetailsState> {
    constructor(props: UserDetailsProps, context: any) {
        super(props, context);

        this.state = {
            processing: false,
            processItem: '',
            showModal: false,
            user: ''
        };
    }

    hideModal = () => {
        this.setState({ user: '', showModal: false });
    };

    removeTenant(tenant: string) {
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
            .catch((err: { message: string }) => {
                onError(err.message);
                this.setState({ processItem: '', processing: false });
            });
    }

    removeUser(username: string) {
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
            .catch((err: { message: string }) => {
                onError(err.message);
                this.setState({ processItem: '', processing: false });
            });
    }

    removeUserOrShowModal(username: string) {
        const { data, groups, toolbox } = this.props;
        const actions = new Actions(toolbox);

        if (actions.isLogoutToBePerformed(data, groups, [username])) {
            this.setState({ user: username, showModal: true });
        } else {
            this.removeUser(username);
        }
    }

    render() {
        const { processItem, processing: processingState, showModal, user } = this.state;
        const { data } = this.props;
        const { Confirm, Divider, Icon, List, Message, Segment } = Stage.Basic;

        return (
            <Segment.Group horizontal>
                <Segment>
                    <Icon name="users" />
                    {translate('users.header')}
                    <Divider />
                    <List divided relaxed verticalAlign="middle" className="light">
                        {data.users.map(item => {
                            const processing = processingState && processItem === item;
                            const iconName = processing ? 'circle notched' : 'remove';

                            return (
                                <List.Item key={item}>
                                    {item}
                                    <Icon
                                        link
                                        name={iconName}
                                        loading={processing}
                                        className="right floated"
                                        onClick={() => this.removeUserOrShowModal(item)}
                                    />
                                </List.Item>
                            );
                        })}

                        {isEmpty(data.users) && <Message content={translate('users.empty')} />}
                    </List>
                </Segment>
                <Segment>
                    <Icon name="users" />
                    {translate('tenants.header')}
                    <Divider />
                    <List divided relaxed verticalAlign="middle" className="light">
                        {map(data.tenants, (role, item) => {
                            const processing = processingState && processItem === item;
                            const iconName = processing ? 'circle notched' : 'remove';

                            return (
                                <List.Item key={item}>
                                    {item} - {role}
                                    <Icon
                                        link
                                        name={iconName}
                                        loading={processing}
                                        className="right floated"
                                        onClick={() => this.removeTenant(item)}
                                    />
                                </List.Item>
                            );
                        })}

                        {isEmpty(data.tenants) && <Message content={translate('tenants.empty')} />}
                    </List>
                </Segment>

                <Confirm
                    content={translate('confirm.removeFromGroup', {
                        groupName: data.name
                    })}
                    open={showModal}
                    onConfirm={() => this.removeUser(user)}
                    onCancel={this.hideModal}
                />
            </Segment.Group>
        );
    }
}
