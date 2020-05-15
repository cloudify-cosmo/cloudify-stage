/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';

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

    static propTypes = {
        tenant: PropTypes.object.isRequired,
        userGroups: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: _.noop
    };

    onApprove() {
        this.updateTenant();
        return false;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    onRoleChange(group, role) {
        const newUserGroups = { ...this.state.userGroups };
        newUserGroups[group] = role;
        this.setState({ userGroups: newUserGroups });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState({
                ...GroupsModal.initialState,
                userGroups: this.props.tenant.groups
            });
        }
    }

    updateTenant() {
        // Disable the form
        this.setState({ loading: true });

        const userGroups = this.props.tenant.groups;
        const userGroupsList = Object.keys(userGroups);
        const submitUserGroups = this.state.userGroups;
        const submitUserGroupsList = Object.keys(submitUserGroups);

        const userGroupsToAdd = _.pick(submitUserGroups, _.difference(submitUserGroupsList, userGroupsList));
        const userGroupsToRemove = _.difference(userGroupsList, submitUserGroupsList);
        const userGroupsToUpdate = _.pickBy(submitUserGroups, (role, group) => {
            return userGroups[group] && !_.isEqual(userGroups[group], role);
        });

        const actions = new Actions(this.props.toolbox);
        actions
            .doHandleUserGroups(this.props.tenant.name, userGroupsToAdd, userGroupsToRemove, userGroupsToUpdate)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                this.props.toolbox.refresh();
                this.props.toolbox.getEventBus().trigger('userGroups:refresh');
                this.props.toolbox.getEventBus().trigger('users:refresh');
                this.props.onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        const newUserGroups = {};
        _.forEach(field.value, group => {
            newUserGroups[group] =
                this.state.userGroups[group] ||
                RolesUtil.getDefaultRoleName(this.props.toolbox.getManagerState().roles);
        });

        this.setState({ userGroups: newUserGroups });
    }

    render() {
        const { Modal, Icon, Form, CancelButton, ApproveButton } = Stage.Basic;

        const { tenant } = this.props;
        const userGroups = _.map(this.props.userGroups.items, userGroup => {
            return { text: userGroup.name, value: userGroup.name, key: userGroup.name };
        });

        return (
            <Modal open={this.props.open} onClose={() => this.props.onHide()}>
                <Modal.Header>
                    <Icon name="users" /> Edit user groups for {tenant.name}
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={this.state.loading}
                        errors={this.state.errors}
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        <Form.Field>
                            <Form.Dropdown
                                placeholder="Groups"
                                multiple
                                selection
                                options={userGroups}
                                name="userGroups"
                                value={Object.keys(this.state.userGroups)}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        <RolesPicker
                            onUpdate={this.onRoleChange.bind(this)}
                            resources={this.state.userGroups}
                            resourceName="user group"
                            toolbox={this.props.toolbox}
                        />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={this.state.loading}
                        icon="users"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
