/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';
const RolesPicker = Stage.Common.RolesPicker;
const RolesUtil = Stage.Common.RolesUtil;

export default class TenantModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = TenantModal.initialState;
    }

    static initialState = {
        loading: false,
        tenants: {},
        errors: {}
    }

    onApprove () {
        this._submitTenant();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    onRoleChange(tenant, role){
        var newTenants = Object.assign({}, this.state.tenants);
        newTenants[tenant] = role;
        this.setState({tenants: newTenants});
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            var tenants = _.mapValues(_.pickBy(nextProps.user.tenants, (rolesObj) => {
                return !_.isEmpty(rolesObj['tenant-role']);
            }), (rolesObj) => {
                return rolesObj['tenant-role'];
            });
            this.setState({...TenantModal.initialState, tenants: tenants});
        }
    }

    _submitTenant() {
        // Disable the form
        this.setState({loading: true});

        var tenants = this.props.user.tenants;
        var tenantsList = Object.keys(tenants);
        var submitTenants = this.state.tenants;
        var submitTenantsList = Object.keys(submitTenants);

        let tenantsToAdd = _.pick(submitTenants, _.difference(submitTenantsList, tenantsList));
        let tenantsToRemove = _.difference(tenantsList, submitTenantsList);
        let tenantsToUpdate = _.pickBy(submitTenants, (role, tenant) => {
            return tenants[tenant] && !_.isEqual(tenants[tenant], role);
        });

        var actions = new Actions(this.props.toolbox);
        actions.doHandleTenants(this.props.user.username, tenantsToAdd, tenantsToRemove, tenantsToUpdate).then(()=>{
            this.setState({errors: {}, loading: false});
            this.props.toolbox.refresh();
            this.props.toolbox.getEventBus().trigger('tenants:refresh');
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        var newTenants = {};
        _.forEach(field.value, (tenant) => {
            newTenants[tenant] = this.state.tenants[tenant] || RolesUtil.getDefaultRoleName(this.props.toolbox.getManager()._data.roles);
        });
        this.setState({tenants: newTenants});
    }

    render() {
        var {Modal, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        var user = Object.assign({},{username:''}, this.props.user);
        var tenants = Object.assign({},{items:[]}, this.props.tenants);

        var options = _.map(tenants.items, item => { return {text: item.name, value: item.name, key: item.name} });

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()} className="editTenantsModal">
                <Modal.Header>
                    <Icon name="user"/> Edit tenants for {user.username}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>
                        <Form.Field>
                            <Form.Dropdown placeholder='Tenants' multiple selection closeOnChange options={options} name="tenants"
                                           value={Object.keys(this.state.tenants)} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                        <RolesPicker onUpdate={this.onRoleChange.bind(this)} resources={this.state.tenants} resourceName="tenant" toolbox={this.props.toolbox}></RolesPicker>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} icon="user" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
