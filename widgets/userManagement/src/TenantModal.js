/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';

export default class TenantModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = TenantModal.initialState;
    }

    static initialState = {
        loading: false,
        tenants: [],
        errors: {}
    }

    onApprove () {
        this.refs.tenantForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState({...TenantModal.initialState, tenants: nextProps.user.tenants});
        }
    }

    _submitTenant() {
        // Disable the form
        this.setState({loading: true});

        let tenantsToAdd = _.difference(this.state.tenants, this.props.user.tenants);
        let tenantsToRemove = _.difference(this.props.user.tenants, this.state.tenants);

        var actions = new Actions(this.props.toolbox);
        actions.doHandleTenants(this.props.user.username, tenantsToAdd, tenantsToRemove).then(()=>{
            this.setState({loading: false});
            this.props.toolbox.refresh();
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Icon, Form} = Stage.Basic;

        var user = Object.assign({},{username:""}, this.props.user);
        var tenants = Object.assign({},{items:[]}, this.props.tenants);

        var options = _.map(tenants.items, item => { return {text: item.name, value: item.name, key: item.name} });

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                <Modal.Header>
                    <Icon name="user"/> Add {user.username} to tenant
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this._submitTenant.bind(this)} errors={this.state.errors} ref="tenantForm">
                        <Form.Field>
                            <Form.Dropdown placeholder='Tenants' multiple search selection options={options} name="tenants"
                                           value={this.state.tenants} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Cancel/>
                    <Modal.Approve label="Save" icon="user" className="green"/>
                </Modal.Footer>
            </Modal>
        );
    }
};
