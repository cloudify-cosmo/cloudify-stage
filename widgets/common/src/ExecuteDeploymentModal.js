/**
 * Created by kinneretzin on 19/10/2016.
 */

let PropTypes = React.PropTypes;

export default class ExecuteDeploymentModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = ExecuteDeploymentModal.initialState(props);
    }

    static initialState = (props) => {

        var params = {};
        _.each(props.workflow.parameters,(param, name)=>{
            params[name] = Stage.Common.JsonUtils.stringify(param.default);
        })

        return {
            errors: {},
            loading: false,
            params
        }
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        deployment: PropTypes.object.isRequired,
        workflow: PropTypes.object.isRequired,
        onHide: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState(ExecuteDeploymentModal.initialState(this.props));
        }
    }

    onApprove () {
        this._submitExecute();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    _submitExecute () {
        if (!this.props.deployment || !this.props.workflow) {
            this.setState({errors: {error: 'Missing workflow or deployment'}});
            return false;
        }

        this.setState({loading: true});

        var actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doExecute(this.props.deployment, this.props.workflow, this.state.params).then(()=>{
            this.setState({loading: false});
            this.props.onHide();
            this.props.toolbox.getEventBus().trigger('executions:refresh');
        }).catch((err)=>{
            this.setState({loading: false, errors: {error: err.message}});
        })
    }

    handleInputChange(event, field) {
        this.setState({params: {...this.state.params, ...Stage.Basic.Form.fieldNameValue(field)}});
    }

    render() {
        var {Modal, Icon, Form, Message, Input, ApproveButton, CancelButton} = Stage.Basic;

        var workflow = Object.assign({},{name:"", parameters:[]}, this.props.workflow);

        return (
            <Modal open={this.props.open}>
                <Modal.Header>
                    <Icon name="road"/> Execute workflow {workflow.name}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}>
                        {
                            _.isEmpty(workflow.parameters)
                            &&
                            <Message content="No parameters available for the execution"/>
                        }

                        {
                            _.map(workflow.parameters,(parameter,name)=>{
                                return (
                                    <Form.Field key={name}>
                                        <label title={parameter.description || name }>{name}</label>
                                        <Input name={name} value={this.state.params[name]} onChange={this.handleInputChange.bind(this)}/>
                                    </Form.Field>
                                );
                            })
                        }
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Execute" icon="rocket" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};

Stage.defineCommon({
    name: 'ExecuteDeploymentModal',
    common: ExecuteDeploymentModal
});