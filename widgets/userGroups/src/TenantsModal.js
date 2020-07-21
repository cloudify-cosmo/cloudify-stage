/**
 * Created by jakubniezgoda on 03/02/2017.
 */

import Actions from './actions';
import GroupPropType from './props/GroupPropType';

const { RolesPicker } = Stage.Common;
const { RolesUtil } = Stage.Common;

export default class TenantsModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = TenantsModal.initialState;
    }

    static initialState = {
        loading: false,
        tenants: {},
        errors: {}
    };

    onApprove() {
        this.submitTenants();
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
        const { group, open } = this.props;
        if (!prevProps.open && open) {
            this.setState({ ...TenantsModal.initialState, tenants: group.tenants });
        }
    }

    submitTenants() {
        const { group, onHide, toolbox } = this.props;
        const { tenants: submitTenants } = this.state;
        // Disable the form
        this.setState({ loading: true });

        const { tenants } = group;
        const tenantsList = Object.keys(tenants);
        const submitTenantsList = Object.keys(submitTenants);

        const tenantsToAdd = _.pick(submitTenants, _.difference(submitTenantsList, tenantsList));
        const tenantsToRemove = _.difference(tenantsList, submitTenantsList);
        const tenantsToUpdate = _.pickBy(submitTenants, (role, tenant) => {
            return tenants[tenant] && !_.isEqual(tenants[tenant], role);
        });

        const actions = new Actions(toolbox);
        actions
            .doHandleTenants(group.name, tenantsToAdd, tenantsToRemove, tenantsToUpdate)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                toolbox.refresh();
                toolbox.getEventBus().trigger('tenants:refresh');
                toolbox.getEventBus().trigger('users:refresh');
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
        const { group: groupProp, onHide, open, tenants: tenantsProp, toolbox } = this.props;
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

        const group = { name: '', ...groupProp };
        const tenants = { items: [], ...tenantsProp };

        const options = _.map(tenants.items, item => {
            return { text: item.name, value: item.name, key: item.name };
        });

        return (
            <Modal open={open} onClose={() => onHide()}>
                <Modal.Header>
                    <Icon name="user" /> Edit tenants for {group.name}
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

TenantsModal.propTypes = {
    group: GroupPropType.isRequired,
    onHide: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    tenants: PropTypes.shape({ items: PropTypes.arrayOf(PropTypes.object) }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
