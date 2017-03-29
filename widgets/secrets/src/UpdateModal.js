/**
 * Created by jakubniezgoda on 24/03/2017.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class UpdateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = UpdateModal.initialState;
    }

    static initialState = {
        loading: false,
        secretValue: '',
        errors: {}
    }

    static propTypes = {
        secret: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        show: PropTypes.bool.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    onApprove () {
        this.refs.updateForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState({...UpdateModal.initialState, loading: true});

            let actions = new Actions(this.props.toolbox);
            actions.doGet(nextProps.secret.key).then((secret)=>{
                this.setState({secretValue: secret.value, loading: false, errors: {}});
            }).catch((err)=> {
                this.setState({loading: false, errors: {secretValue: err.message}});
            });
        }
    }

    _updateSecret() {
        let errors = {};

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
        actions.doUpdate(this.props.secret.key, this.state.secretValue).then(()=>{
            this.setState({loading: false});
            this.props.onHide();
            this.props.toolbox.refresh();
        }).catch((err)=> {
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        let {Modal, Icon, Form} = Stage.Basic;

        return (
            <div>
                <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Modal.Header>
                        <Icon name='edit' /> Update secret {this.props.secret.key}
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={this._updateSecret.bind(this)} errors={this.state.errors} ref='updateForm'>
                            <Form.Field error={this.state.errors.secretValue}>
                                <Form.Input name='secretValue' placeholder='Secret value'
                                            value={this.state.secretValue} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Cancel/>
                        <Modal.Approve label="Update" icon='edit' className="green"/>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};
