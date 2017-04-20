/**
 * Created by jakubniezgoda on 03/02/2017.
 */

import Actions from './actions';

export default class TenantsModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = TenantsModal.initialState;
    }

    static initialState = {
        loading: false,
        tenants: [],
        errors: {}
    }

    onApprove () {
        this._submitTenants();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState({...TenantsModal.initialState, tenants: nextProps.group.tenants});
        }
    }

    _submitTenants() {
        // Disable the form
        this.setState({loading: true});

        let tenantsToAdd = _.difference(this.state.tenants, this.props.group.tenants);
        let tenantsToRemove = _.difference(this.props.group.tenants, this.state.tenants);

        var actions = new Actions(this.props.toolbox);
        actions.doHandleTenants(this.props.group.name, tenantsToAdd, tenantsToRemove).then(()=>{
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
        var {Modal, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        var group = Object.assign({},{name:''}, this.props.group);
        var tenants = Object.assign({},{items:[]}, this.props.tenants);

        var options = _.map(tenants.items, item => { return {text: item.name, value: item.name, key: item.name} });

        return (
            <Modal open={this.props.open}>
                <Modal.Header>
                    <Icon name="user"/> Add group {group.name} to tenants
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}>
                        <Form.Field>
                            <Form.Dropdown placeholder='Tenants' multiple selection options={options} name="tenants"
                                           value={this.state.tenants} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
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
