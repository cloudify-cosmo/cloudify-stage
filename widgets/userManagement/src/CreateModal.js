/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';

export default class CreateModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.availableTenantsPromise = null;
        this.state = { ...CreateModal.initialState, open: false };
    }

    static initialState = {
        loading: false,
        username: '',
        password: '',
        confirmPassword: '',
        isAdmin: false,
        tenants: {},
        errors: {}
    };

    onApprove() {
        this.submitCreate();
        return false;
    }

    onCancel() {
        this.setState({ open: false });
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.setState({ ...CreateModal.initialState, loading: true });

            const actions = new Actions(this.props.toolbox);
            this.availableTenantsPromise = Stage.Utils.makeCancelable(actions.doGetTenants());

            this.availableTenantsPromise.promise
                .then(availableTenants => {
                    this.setState({ error: null, availableTenants, loading: false });
                })
                .catch(err => {
                    if (!err.isCanceled) {
                        this.setState({ error: err.message, availableTenants: { items: [] }, loading: false });
                    }
                });
        }
    }

    componentWillUnmount() {
        if (this.availableTenantsPromise) {
            this.availableTenantsPromise.cancel();
        }
    }

    submitCreate() {
        const errors = {};

        if (_.isEmpty(this.state.username)) {
            errors.username = 'Please provide username';
        }

        if (_.isEmpty(this.state.password)) {
            errors.password = 'Please provide user password';
        }

        if (_.isEmpty(this.state.confirmPassword)) {
            errors.confirmPassword = 'Please provide password confirmation';
        }

        if (
            !_.isEmpty(this.state.password) &&
            !_.isEmpty(this.state.confirmPassword) &&
            this.state.password !== this.state.confirmPassword
        ) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new Actions(this.props.toolbox);
        actions
            .doCreate(
                this.state.username,
                this.state.password,
                Stage.Common.RolesUtil.getSystemRole(this.state.isAdmin)
            )
            .then(() => actions.doHandleTenants(this.state.username, this.state.tenants, [], []))
            .then(() => {
                this.setState({ errors: {}, loading: false, open: false });
                this.props.toolbox.refresh();
                this.props.toolbox.getEventBus().trigger('tenants:refresh');
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    handleTenantChange(proxy, field) {
        const newTenants = {};
        _.forEach(field.value, tenant => {
            newTenants[tenant] =
                this.state.tenants[tenant] ||
                Stage.Common.RolesUtil.getDefaultRoleName(this.props.toolbox.getManagerState().roles);
        });
        this.setState({ tenants: newTenants });
    }

    handleRoleChange(tenant, role) {
        const newTenants = { ...this.state.tenants };
        newTenants[tenant] = role;
        this.setState({ tenants: newTenants });
    }

    render() {
        const { ApproveButton, Button, CancelButton, Icon, Form, Message, Modal } = Stage.Basic;
        const { RolesPicker } = Stage.Common;

        const addButton = <Button content="Add" icon="add user" labelPosition="left" className="addUserButton" />;

        const tenants = { items: [], ...this.state.availableTenants };
        const options = _.map(tenants.items, item => {
            return { text: item.name, value: item.name, key: item.name };
        });

        return (
            <Modal
                trigger={addButton}
                open={this.state.open}
                onOpen={() => this.setState({ open: true })}
                onClose={() => this.setState({ open: false })}
                className="addUserModal"
            >
                <Modal.Header>
                    <Icon name="add user" /> Add user
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={this.state.loading}
                        errors={this.state.errors}
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        <Form.Field label="Username" error={this.state.errors.username} required>
                            <Form.Input
                                name="username"
                                value={this.state.username}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field label="Password" error={this.state.errors.password} required>
                            <Form.Input
                                name="password"
                                type="password"
                                value={this.state.password}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field label="Confirm password" error={this.state.errors.confirmPassword} required>
                            <Form.Input
                                name="confirmPassword"
                                type="password"
                                value={this.state.confirmPassword}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field error={this.state.errors.isAdmin}>
                            <Form.Checkbox
                                label="Admin"
                                name="isAdmin"
                                checked={this.state.isAdmin}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        {this.state.isAdmin && (
                            <Message>Admin users have full permissions to all tenants on the manager.</Message>
                        )}

                        <Form.Field label="Tenants">
                            <Form.Dropdown
                                name="tenants"
                                multiple
                                selection
                                options={options}
                                value={Object.keys(this.state.tenants)}
                                onChange={this.handleTenantChange.bind(this)}
                            />
                        </Form.Field>
                        <RolesPicker
                            onUpdate={this.handleRoleChange.bind(this)}
                            resources={this.state.tenants}
                            resourceName="tenant"
                            toolbox={this.props.toolbox}
                        />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={this.state.loading}
                        content="Add"
                        icon="add user"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
