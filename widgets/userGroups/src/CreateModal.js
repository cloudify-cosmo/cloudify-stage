/**
 * Created by jakubniezgoda on 03/02/2017.
 */

import Actions from './actions';

export default class CreateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...CreateModal.initialState, show: false}
    }

    static initialState = {
        show: false,
        loading: false,
        groupName: "",
        ldapGroup: "",
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
        if (!prevState.show && this.state.show) {
            this.setState(CreateModal.initialState);
        }
    }

    _submitCreate() {
        let errors = {};

        if (_.isEmpty(this.state.groupName)) {
            errors['groupName'] = 'Please provide group name';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doCreate(this.state.groupName,
                         this.state.ldapGroup
        ).then(()=>{
            this.setState({loading: false, show: false});
            this.props.toolbox.refresh();
        }).catch((err)=>{
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
                        <Icon name="add user"/> Add user group
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={this._submitCreate.bind(this)} errors={this.state.errors} ref="createForm">
                            <Form.Field error={this.state.errors.groupName}>
                                <Form.Input name='groupName' placeholder="Group name"
                                            value={this.state.groupName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>

                            <Form.Field error={this.state.errors.ldapGroup}>
                                <Form.Input name='ldapGroup' placeholder="LDAP group name"
                                            value={this.state.ldapGroup} onChange={this._handleInputChange.bind(this)}/>
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
