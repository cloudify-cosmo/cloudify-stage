/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';

const { RolesPicker } = Stage.Common;
const { RolesUtil } = Stage.Common;

export default class TenantModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = TenantModal.initialState;
    }

    static initialState = {
        loading: false,
        tenants: {},
        errors: {}
    };

    onApprove() {
        this.submitTenant();
        return false;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    onRoleChange(tenant, role) {
        const newTenants = { ...this.state.tenants };
        newTenants[tenant] = role;
        this.setState({ tenants: newTenants });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            const tenants = _.mapValues(
                _.pickBy(this.props.user.tenants, rolesObj => {
                    return !_.isEmpty(rolesObj['tenant-role']);
                }),
                rolesObj => {
                    return rolesObj['tenant-role'];
                }
            );
            this.setState({ ...TenantModal.initialState, tenants });
        }
    }

    submitTenant() {
        // Disable the form
        this.setState({ loading: true });

        const tenants = this.props.user.tenant_roles.direct;
        const tenantsList = Object.keys(tenants);
        const submitTenants = this.state.tenants;
        const submitTenantsList = Object.keys(submitTenants);

        const tenantsToAdd = _.pick(submitTenants, _.difference(submitTenantsList, tenantsList));
        const tenantsToRemove = _.difference(tenantsList, submitTenantsList);
        const tenantsToUpdate = _.pickBy(submitTenants, (role, tenant) => {
            return tenants[tenant] && !_.isEqual(tenants[tenant], role);
        });

        const actions = new Actions(this.props.toolbox);
        actions
            .doHandleTenants(this.props.user.username, tenantsToAdd, tenantsToRemove, tenantsToUpdate)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                this.props.toolbox.refresh();
                this.props.toolbox.getEventBus().trigger('tenants:refresh');
                this.props.onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        const newTenants = {};
        _.forEach(field.value, tenant => {
            newTenants[tenant] =
                this.state.tenants[tenant] || RolesUtil.getDefaultRoleName(this.props.toolbox.getManager()._data.roles);
        });
        this.setState({ tenants: newTenants });
    }

    render() {
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

        const user = { username: '', ...this.props.user };
        const tenants = { items: [], ...this.props.tenants };

        const options = _.map(tenants.items, item => {
            return { text: item.name, value: item.name, key: item.name };
        });

        return (
            <Modal open={this.props.open} onClose={() => this.props.onHide()} className="editTenantsModal">
                <Modal.Header>
                    <Icon name="user" /> Edit tenants for {user.username}
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={this.state.loading}
                        errors={this.state.errors}
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        <Form.Field>
                            <Form.Dropdown
                                placeholder="Tenants"
                                multiple
                                selection
                                options={options}
                                name="tenants"
                                value={Object.keys(this.state.tenants)}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        <RolesPicker
                            onUpdate={this.onRoleChange.bind(this)}
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
                        icon="user"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
