/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';

export default class CreateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...CreateModal.initialState, open: false}
    }

    static initialState = {
        loading: false,
        tenantName: '',
        errors: {}
    }

    onApprove () {
        this._createTenant();
        return false;
    }

    onCancel () {
        this.setState({open: false});
        return true;
    }

    componentWillUpdate(prevProps, prevState) {
        if (this.state.open && prevState.open != this.state.open) {
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
            this.setState({loading: false, open: false});
            this.props.toolbox.refresh();
        }).catch((err)=> {
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;
        const addButton = <Button content='Add' icon='add user' labelPosition='left' />;

        return (
            <Modal trigger={addButton} open={this.state.open} onOpen={()=>this.setState({open:true})} onClose={()=>this.setState({open:false})}>
                <Modal.Header>
                    <Icon name='add user'/> Add tenant
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}>
                        <Form.Field error={this.state.errors.tenantName}>
                            <Form.Input name='tenantName' placeholder='Tenant name'
                                        value={this.state.tenantName} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Add" icon="add user" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
