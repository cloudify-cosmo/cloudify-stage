/**
 * Created by kinneretzin on 28/03/2017.
 */

let PropTypes = React.PropTypes;
import Actions from './actions';

export default class JoinClusterModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = JoinClusterModal.initialState;
    }

    static initialState = {
        loading: false,
        errors: {},
        clusterNodeName: '',
        clusterJoinAddr: '',
        clusterJoinAddrUser: '',
        clusterJoinAddrPass: ''
    };

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState(JoinClusterModal.initialState);
        }
    }

    onApprove () {
        this._submitJoinCluster();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    _submitJoinCluster() {
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doJoinCluster(this.state.clusterJoinAddr,this.state.clusterJoinAddrUser,this.state.clusterJoinAddrPass,this.state.clusterNodeName)
            .then(()=>actions.waitForClusterInitialization())
            .then(()=> {
                this.setState({loading: false});
                this.props.toolbox.getEventBus().trigger('cluster:refresh');
                this.props.onHide();
            })
            .catch((err)=>{
                this.setState({loading: false, errors: {error: err.message}});
            });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        return (
            <Modal open={this.props.open}>
                <Modal.Header>
                    Join existing cluster
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}>

                        <h2>
                            <Icon name='warning sign'/>
                            Joining a cluster is irreversible. Separating from the cluster will leave the Cloudify Manager instance unusable.
                        </h2>

                        <Form.Field error={this.state.errors.clusterNodeName}>
                            <Form.Input name='clusterNodeName'
                                        placeholder="Enter cluster node name for this manager. If left empty a name will be generated"
                                        value={this.state.clusterNodeName}
                                        onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.clusterJoinAddr}>
                            <Form.Input name='clusterJoinAddr'
                                        placeholder="Enter the ip of the manager in the cluster you want to join to"
                                        required
                                        value={this.state.clusterJoinAddr}
                                        onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.clusterJoinAddrUser}>
                            <Form.Input name='clusterJoinAddrUser'
                                        placeholder="Enter the cluster manager user name"
                                        required
                                        value={this.state.clusterJoinAddrUser}
                                        onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                        <Form.Field error={this.state.errors.clusterJoinAddrPass}>
                            <Form.Input name='clusterJoinAddrPass'
                                        placeholder="Enter the cluster manager password"
                                        type='password'
                                        required
                                        value={this.state.clusterJoinAddrPass}
                                        onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Join Cluster" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
