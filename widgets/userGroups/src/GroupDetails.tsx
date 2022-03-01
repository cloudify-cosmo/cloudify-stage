// @ts-nocheck File not migrated fully to TS

import Actions from './actions';
import GroupPropType from './props/GroupPropType';

const t = Stage.Utils.getT('widgets.userGroups.details.group.segments');

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

    hideModal = () => {
        this.setState({ user: '', showModal: false });
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

    render() {
        const { processItem, processing: processingState, showModal, user } = this.state;
        const { data } = this.props;
        const { Confirm, Divider, Icon, List, Message, Segment } = Stage.Basic;

        return (
            <Segment.Group horizontal>
                <Segment>
                    <Icon name="users" />
                    {t('users.header')}
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
                                        onClick={() => this.removeUserOrShowModal(item)}
                                    />
                                </List.Item>
                            );
                        })}

                        {_.isEmpty(data.users) && <Message content={t('users.empty')} />}
                    </List>
                </Segment>
                <Segment>
                    <Icon name="users" />
                    {t('tenants.header')}
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
                                        onClick={() => this.removeTenant(item)}
                                    />
                                </List.Item>
                            );
                        })}

                        {_.isEmpty(data.tenants) && <Message content={t('tenants.empty')} />}
                    </List>
                </Segment>

                <Confirm
                    content={t('confirm.removeFromGroup', {
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

UserDetails.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    data: GroupPropType.isRequired,
    groups: PropTypes.arrayOf(GroupPropType).isRequired,
    onError: PropTypes.func.isRequired
};
