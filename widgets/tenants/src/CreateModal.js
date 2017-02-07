/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';

export default class CreateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...CreateModal.initialState, show: false}
    }

    static initialState = {
        loading: false,
        tenantName: '',
        errors: {}
    }

    onApprove () {
        this.refs.createForm.submit();
        return false;
    }

    onDeny () {
        this.setState({show: false});
        return true;
    }

    _showModal() {
        this.setState({show: true});
    }

    componentWillUpdate(prevProps, prevState) {
        if (this.state.show && prevState.show != this.state.show) {
            this.setState(CreateModal.initialState);
        }
    }

    _createTenant() {
        let errors = {};

        if (_.isEmpty(this.state.tenantName)) {
            errors['tenantName'] = 'Please provide tenant name';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        let actions = new Actions(this.props.toolbox);
        actions.doCreate(this.state.tenantName).then((tenant)=>{
            this.setState({loading: false, show: false});
            this.props.toolbox.refresh();
        }).catch((err)=> {
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form} = Stage.Basic;

        return (
            <div>
                <Button content='Add' icon='add user' labelPosition='left' onClick={this._showModal.bind(this)}/>

                <Modal show={this.state.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Modal.Header>
                        <Icon name='add user'/> Add tenant
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={this._createTenant.bind(this)} errors={this.state.errors} ref='createForm'>
                            <Form.Field error={this.state.errors.tenantName}>
                                <Form.Input name='tenantName' placeholder='Tenant name'
                                            value={this.state.tenantName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Cancel/>
                        <Modal.Approve label="Add" icon="add user" className="green"/>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};
