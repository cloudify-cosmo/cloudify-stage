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
        this.refs.tenantsForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState({...TenantsModal.initialState, tenants: nextProps.group.tenants});
        }
    }

    _submitUsers() {
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
        var {Modal, Icon, Form} = Stage.Basic;

        var group = Object.assign({},{name:''}, this.props.group);
        var tenants = Object.assign({},{items:[]}, this.props.tenants);

        var options = _.map(tenants.items, item => { return {text: item.name, value: item.name, key: item.name} });

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                <Modal.Header>
                    <Icon name="user"/> Add group {group.name} to tenants
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this._submitUsers.bind(this)} errors={this.state.errors} ref="tenantsForm">
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
