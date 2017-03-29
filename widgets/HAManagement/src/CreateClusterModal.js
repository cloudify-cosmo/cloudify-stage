/**
 * Created by kinneretzin on 28/03/2017.
 */

let PropTypes = React.PropTypes;
import Actions from './actions';

export default class CreateClusterModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = CreateClusterModal.initialState;
    }

    static initialState = {
        loading: false,
        errors: {},
        clusterNodeName: ''
    };

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        show: PropTypes.bool.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState(CreateClusterModal.initialState);
        }
    }

    onApprove () {
        this.refs.createClusterForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    _submitCreateCluster() {
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doCreateCluster(this.state.clusterNodeName)
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
        var {Modal, Icon, Form} = Stage.Basic;

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                <Modal.Header>
                    Create Cluster
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this._submitCreateCluster.bind(this)} errors={this.state.errors} ref="createClusterForm">

                        <h2>
                            <Icon name='warning sign'/>
                            Joining a cluster is irreversible. Separating from the cluster will leave the Cloudify Manager instance unusable.
                        </h2>

                        <Form.Field error={this.state.errors.nodeName}>
                            <Form.Input name='clusterNodeName'
                                        placeholder="Enter cluster node name for this manager. If left empty a name will be generated"
                                        value={this.state.clusterNodeName}
                                        onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Cancel/>
                    <Modal.Approve label="Create Cluster" className="green"/>
                </Modal.Footer>
            </Modal>
        );
    }
};
