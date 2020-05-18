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
        const { open } = this.state;
        if (!prevState.open && open) {
            const { toolbox } = this.props;
            this.setState({ ...CreateModal.initialState, loading: true });

            const actions = new Actions(toolbox);
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
        const { confirmPassword, isAdmin, password, tenants, username } = this.state;
        const { toolbox } = this.props;
        const errors = {};

        if (_.isEmpty(username)) {
            errors.username = 'Please provide username';
        }

        if (_.isEmpty(password)) {
            errors.password = 'Please provide user password';
        }

        if (_.isEmpty(confirmPassword)) {
            errors.confirmPassword = 'Please provide password confirmation';
        }

        if (!_.isEmpty(password) && !_.isEmpty(confirmPassword) && password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new Actions(toolbox);
        actions
            .doCreate(username, password, Stage.Common.RolesUtil.getSystemRole(isAdmin))
            .then(() => actions.doHandleTenants(username, tenants, [], []))
            .then(() => {
                this.setState({ errors: {}, loading: false, open: false });
                toolbox.refresh();
                toolbox.getEventBus().trigger('tenants:refresh');
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
            const { toolbox } = this.props;
            const { tenants } = this.state;

            newTenants[tenant] =
                tenants[tenant] || Stage.Common.RolesUtil.getDefaultRoleName(toolbox.getManagerState().roles);
        });
        this.setState({ tenants: newTenants });
    }

    handleRoleChange(tenant, role) {
        const { tenants } = this.state;
        const newTenants = { ...tenants };
        newTenants[tenant] = role;
        this.setState({ tenants: newTenants });
    }

    render() {
        const { toolbox } = this.props;
        const { availableTenants, confirmPassword, errors, isAdmin, loading, open, password, username } = this.state;
        const { ApproveButton, Button, CancelButton, Icon, Form, Message, Modal } = Stage.Basic;
        const { RolesPicker } = Stage.Common;

        const addButton = <Button content="Add" icon="add user" labelPosition="left" className="addUserButton" />;

        const tenants = { items: [], ...availableTenants };
        const options = _.map(tenants.items, item => {
            return { text: item.name, value: item.name, key: item.name };
        });

        return (
            <Modal
                trigger={addButton}
                open={open}
                onOpen={() => this.setState({ open: true })}
                onClose={() => this.setState({ open: false })}
                className="addUserModal"
            >
                <Modal.Header>
                    <Icon name="add user" /> Add user
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field label="Username" error={errors.username} required>
                            <Form.Input name="username" value={username} onChange={this.handleInputChange.bind(this)} />
                        </Form.Field>

                        <Form.Field label="Password" error={errors.password} required>
                            <Form.Input
                                name="password"
                                type="password"
                                value={password}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field label="Confirm password" error={errors.confirmPassword} required>
                            <Form.Input
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field error={errors.isAdmin}>
                            <Form.Checkbox
                                label="Admin"
                                name="isAdmin"
                                checked={isAdmin}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        {isAdmin && <Message>Admin users have full permissions to all tenants on the manager.</Message>}

                        <Form.Field label="Tenants">
                            <Form.Dropdown
                                name="tenants"
                                multiple
                                selection
                                options={options}
                                value={Object.keys(tenants)}
                                onChange={this.handleTenantChange.bind(this)}
                            />
                        </Form.Field>
                        <RolesPicker
                            onUpdate={this.handleRoleChange.bind(this)}
                            resources={tenants}
                            resourceName="tenant"
                            toolbox={toolbox}
                        />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={loading}
                        content="Add"
                        icon="add user"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
