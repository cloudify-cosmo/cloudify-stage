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
            if (typeof param.default == 'undefined' || typeof param.default == 'object')
                params[name] = Stage.Common.JsonUtils.stringify(param.default);
            else
                params[name] = param.default;
        });

        return {
            errors: {},
            loading: false,
            force: false,
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
            this.setState(ExecuteDeploymentModal.initialState(nextProps));
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

        // Attempt to parse params to json
        var paramsJson = {};
        _.map(this.state.params, (param,name) => {
            paramsJson[name] = Stage.Common.JsonUtils.stringToJson((param));
        });

        // Note that this.setState() is asynchronous and we cannot be sure that
        // the state changes before we call doExecute
        this.setState({params: paramsJson});

        var actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doExecute(this.props.deployment, this.props.workflow, paramsJson, this.state.force).then(()=>{
            this.setState({loading: false, errors: {}});
            this.props.onHide();
            this.props.toolbox.getEventBus().trigger('executions:refresh');
        }).catch((err)=>{
            this.setState({loading: false, errors: {error: err.message}});
        })
    }

    getGenericFieldType(parameter){
        const {GenericField} = Stage.Basic;

        // if param type is not provided attempt to infer it from default value
        if (!parameter.type)
            parameter.type = typeof parameter.default;

        switch (parameter.type){
            case 'boolean':
                return GenericField.BOOLEAN_TYPE;
            case 'integer':
                return GenericField.NUMBER_TYPE;
            default:
                return GenericField.STRING_TYPE;
        }
    }

    handleInputChange(event, field) {
        this.setState({params: {...this.state.params, ...Stage.Basic.Form.fieldNameValue(field)}});
    }

    render() {
        var {Modal, Icon, Form, Message, ApproveButton, CancelButton, GenericField} = Stage.Basic;

        var workflow = Object.assign({},{name:'', parameters:[]}, this.props.workflow);
        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()} className="executeWorkflowModal">
                <Modal.Header>
                    <Icon name="road"/> Execute workflow {workflow.name}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>
                        {
                            _.isEmpty(workflow.parameters)
                            &&
                            <Message content="No parameters available for the execution"/>
                        }

                        {
                            _.map(workflow.parameters,(parameter,name)=>{
                                return (
                                    <Form.Field key={name}>
                                        <GenericField name={name}
                                                      label={name}
                                                      description={parameter.description}
                                                      type={this.getGenericFieldType(parameter)}
                                                      value={this.state.params[name]}
                                                      onChange={this.handleInputChange.bind(this)} />
                                    </Form.Field>
                                );
                            })
                        }
                        <Form.Field key="force">
                            <GenericField
                                name="force"
                                label="force"
                                description=""
                                type={this.getGenericFieldType({type: 'boolean'})}
                                value={this.state.force}
                                onChange={(event, field) => {
                                    this.setState({force: field.checked});
                                }} />
                        </Form.Field>
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