/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';
import UserPropType from './props/UserPropType';

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
        const { onHide } = this.props;
        onHide();
        return true;
    }

    onRoleChange(tenant, role) {
        const { tenants } = this.state;
        const newTenants = { ...tenants };
        newTenants[tenant] = role;
        this.setState({ tenants: newTenants });
    }

    componentDidUpdate(prevProps) {
        const { open, user } = this.props;
        if (!prevProps.open && open) {
            const tenants = _.mapValues(
                _.pickBy(user.tenants, rolesObj => {
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
        const { onHide, toolbox, user } = this.props;
        const { tenants: submitTenants } = this.state;
        // Disable the form
        this.setState({ loading: true });

        const tenants = user.tenant_roles.direct;
        const tenantsList = Object.keys(tenants);
        const submitTenantsList = Object.keys(submitTenants);

        const tenantsToAdd = _.pick(submitTenants, _.difference(submitTenantsList, tenantsList));
        const tenantsToRemove = _.difference(tenantsList, submitTenantsList);
        const tenantsToUpdate = _.pickBy(submitTenants, (role, tenant) => {
            return tenants[tenant] && !_.isEqual(tenants[tenant], role);
        });

        const actions = new Actions(toolbox);
        actions
            .doHandleTenants(user.username, tenantsToAdd, tenantsToRemove, tenantsToUpdate)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                toolbox.refresh();
                toolbox.getEventBus().trigger('tenants:refresh');
                onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        const newTenants = {};
        _.forEach(field.value, tenant => {
            const { toolbox } = this.props;
            const { tenants } = this.state;
            newTenants[tenant] = tenants[tenant] || RolesUtil.getDefaultRoleName(toolbox.getManagerState().roles);
        });
        this.setState({ tenants: newTenants });
    }

    render() {
        const { errors, loading, tenants: tenantsState } = this.state;
        const { onHide, open, toolbox, tenants: tenantsProp, user: userProp } = this.props;
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

        const user = { username: '', ...userProp };
        const tenants = { items: [], ...tenantsProp };

        const options = _.map(tenants.items, item => {
            return { text: item.name, value: item.name, key: item.name };
        });

        return (
            <Modal open={open} onClose={() => onHide()} className="editTenantsModal">
                <Modal.Header>
                    <Icon name="user" /> Edit tenants for {user.username}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field>
                            <Form.Dropdown
                                placeholder="Tenants"
                                multiple
                                selection
                                options={options}
                                name="tenants"
                                value={Object.keys(tenantsState)}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        <RolesPicker
                            onUpdate={this.onRoleChange.bind(this)}
                            resources={tenantsState}
                            resourceName="tenant"
                            toolbox={toolbox}
                        />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={loading} icon="user" color="green" />
                </Modal.Actions>
            </Modal>
        );
    }
}

TenantModal.propTypes = {
    onHide: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    tenants: PropTypes.shape({
        items: PropTypes.array
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    user: UserPropType.isRequired
};
