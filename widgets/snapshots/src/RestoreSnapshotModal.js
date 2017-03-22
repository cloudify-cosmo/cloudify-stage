/**
 * Created by kinneretzin on 03/21/2017.
 */

import Actions from './actions';
let PropTypes = React.PropTypes;

export default class RestoreSnapshotModal extends React.Component {

    constructor(props,context) {
        super(props, context);

        this.state = {...RestoreSnapshotModal.initialState, show: false}
    }

    static initialState = {
        loading: false,
        errors: {},
        isFromTenantlessEnv : false,
        shouldForceRestore: false,
        newTenantName: ''
    }

    static propTypes = {
        snapshot: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    onApprove () {
        this.refs.restoreForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }


    componentWillUpdate(prevProps, prevState) {
        if (!prevState.show && this.state.show) {
            this.setState(RestoreSnapshotModal.initialState);
        }
    }

    _submitRestore() {
        let errors = {};

        if (this.state.isFromTenantlessEnv && _.isEmpty(this.state.newTenantName)) {
            errors["newTenantName"]="Please provide a new tenant name";
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doRestore(this.props.snapshot,this.state.shouldForceRestore,this.state.newTenantName).then(()=>{
            this.setState({loading: false});
            this.props.toolbox.refresh();
            this.props.toolbox.getEventBus().trigger('snapshots:refresh');
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleFieldChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form} = Stage.Basic;

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                <Modal.Header>
                    <Icon name="undo"/> Restore snapshot
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this._submitRestore.bind(this)} errors={this.state.errors} ref="restoreForm">

                        <Form.Field>
                            <Form.Checkbox toggle
                                           label="Is Snapshot from a tenant-less environment?"
                                           name='isFromTenantlessEnv'
                                           checked={this.state.isFromTenantlessEnv}
                                           onChange={this._handleFieldChange.bind(this)}/>
                        </Form.Field>


                        {
                            this.state.isFromTenantlessEnv &&
                            <Form.Field error={this.state.errors.newTenantName}>
                                <Form.Input  placeholder="Enter new tenant name for this snapshot to be restored to"
                                             name='newTenantName'
                                             required
                                             value={this.state.newTenantName}
                                             onChange={this._handleFieldChange.bind(this)}/>
                            </Form.Field>
                        }
                        <Form.Field>
                            <Form.Checkbox toggle
                                           label="Force restore even if manager is non-empty? (It will delete all data)"
                                           name='shouldForceRestore'
                                           checked={this.state.shouldForceRestore}
                                           onChange={this._handleFieldChange.bind(this)}/>
                        </Form.Field>

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Cancel/>
                    <Modal.Approve label="Restore" icon="undo" className="green"/>
                </Modal.Footer>
            </Modal>
        );
    }
};
