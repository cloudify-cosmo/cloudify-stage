/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';
import TenantPropType from './props/TenantPropType';

const { RolesPicker } = Stage.Common;
const { RolesUtil } = Stage.Common;

export default class GroupsModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            ...GroupsModal.initialState
        };
    }

    static initialState = {
        userGroups: {},
        loading: false,
        errors: {}
    };

    onApprove() {
        this.updateTenant();
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    onRoleChange(group, role) {
        const { userGroups } = this.state;
        const newUserGroups = { ...userGroups };
        newUserGroups[group] = role;
        this.setState({ userGroups: newUserGroups });
    }

    componentDidUpdate(prevProps) {
        const { open, tenant } = this.props;
        if (!prevProps.open && open) {
            this.setState({
                ...GroupsModal.initialState,
                userGroups: tenant.groups
            });
        }
    }

    updateTenant() {
        const { onHide, tenant, toolbox } = this.props;
        const { userGroups: submitUserGroups } = this.state;

        // Disable the form
        this.setState({ loading: true });

        const userGroups = tenant.groups;
        const userGroupsList = Object.keys(userGroups);
        const submitUserGroupsList = Object.keys(submitUserGroups);

        const userGroupsToAdd = _.pick(submitUserGroups, _.difference(submitUserGroupsList, userGroupsList));
        const userGroupsToRemove = _.difference(userGroupsList, submitUserGroupsList);
        const userGroupsToUpdate = _.pickBy(submitUserGroups, (role, group) => {
            return userGroups[group] && !_.isEqual(userGroups[group], role);
        });

        const actions = new Actions(toolbox);
        actions
            .doHandleUserGroups(tenant.name, userGroupsToAdd, userGroupsToRemove, userGroupsToUpdate)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                toolbox.refresh();
                toolbox.getEventBus().trigger('userGroups:refresh');
                toolbox.getEventBus().trigger('users:refresh');
                onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        const newUserGroups = {};
        _.forEach(field.value, group => {
            const { toolbox } = this.props;
            const { userGroups } = this.state;
            newUserGroups[group] = userGroups[group] || RolesUtil.getDefaultRoleName(toolbox.getManagerState().roles);
        });

        this.setState({ userGroups: newUserGroups });
    }

    render() {
        const { errors, loading, userGroups: userGroupsState } = this.state;
        const { Modal, Icon, Form, CancelButton, ApproveButton } = Stage.Basic;

        const { tenant, onHide, open, toolbox, userGroups: userGroupsProp } = this.props;
        const userGroups = _.map(userGroupsProp.items, userGroup => {
            return { text: userGroup.name, value: userGroup.name, key: userGroup.name };
        });

        return (
            <Modal open={open} onClose={() => onHide()}>
                <Modal.Header>
                    <Icon name="users" /> Edit user groups for {tenant.name}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field>
                            <Form.Dropdown
                                placeholder="Groups"
                                multiple
                                selection
                                options={userGroups}
                                name="userGroups"
                                value={Object.keys(userGroupsState)}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        <RolesPicker
                            onUpdate={this.onRoleChange.bind(this)}
                            resources={userGroupsState}
                            resourceName="user group"
                            toolbox={toolbox}
                        />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={loading} icon="users" color="green" />
                </Modal.Actions>
            </Modal>
        );
    }
}

GroupsModal.propTypes = {
    tenant: TenantPropType.isRequired,
    userGroups: PropTypes.shape({ items: PropTypes.array }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    onHide: PropTypes.func,
    open: PropTypes.bool.isRequired
};

GroupsModal.defaultProps = {
    onHide: _.noop
};
