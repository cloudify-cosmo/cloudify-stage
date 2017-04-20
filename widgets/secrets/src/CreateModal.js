/**
 * Created by jakubniezgoda on 24/03/2017.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class CreateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...CreateModal.initialState, open: false}
    }

    static initialState = {
        loading: false,
        secretKey: '',
        secretValue: '',
        errors: {}
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired
    };

    onApprove () {
        this._createSecret();
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

    _createSecret() {
        let errors = {};

        if (_.isEmpty(this.state.secretKey)) {
            errors['secretKey'] = 'Please provide secret key';
        }

        if (_.isEmpty(this.state.secretValue)) {
            errors['secretValue'] = 'Please provide secret value';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        let actions = new Actions(this.props.toolbox);
        actions.doCreate(this.state.secretKey, this.state.secretValue).then(()=>{
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
        let {Modal, Button, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;
        const createButton = <Button content='Create' icon='add' labelPosition='left' />;

        return (
            <Modal trigger={createButton} open={this.state.open} onOpen={()=>this.setState({open:true})} onClose={()=>this.setState({open:false})}>
                <Modal.Header>
                    <Icon name='add' /> Create secret
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}>
                        <Form.Field error={this.state.errors.secretKey}>
                            <Form.Input name='secretKey' placeholder='Secret key'
                                        value={this.state.secretKey} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                        <Form.Field error={this.state.errors.secretValue}>
                            <Form.Input name='secretValue' placeholder='Secret value'
                                        value={this.state.secretValue} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Create" icon='add' color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
