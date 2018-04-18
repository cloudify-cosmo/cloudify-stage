/**
 * Created by kinneretzin on 19/10/2016.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';

export default class ExecuteDeploymentModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = ExecuteDeploymentModal.initialState();
    }

    static initialState = () => {
        return {
            errors: {},
            loading: false,
            force: false,
            params: {}
        }
    };

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        deployment: PropTypes.object.isRequired,
        workflow: PropTypes.object.isRequired,
        onHide: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState(ExecuteDeploymentModal.initialState());
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

        //Check required parameters has value
        var errors = {};
        _.forEach(this.props.workflow.parameters, (param, name) => {
            if(this.isParamRequired(param) && !this.state.params[name]){
                errors[name] = `Please provide ${name}`;
            }
        });

        if (!_.isEmpty(errors)){
            this.setState({errors: errors});
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

        switch (parameter.type){
            case 'boolean':
                return GenericField.BOOLEAN_LIST_TYPE;
            case 'integer':
                return GenericField.NUMBER_TYPE;
            default:
                return GenericField.STRING_TYPE;
        }
    }

    getParameterPlaceholder(defaultValue){
        if(_.isString(defaultValue)){
            return defaultValue;
        } else if(!_.isUndefined(defaultValue)){
            return Stage.Common.JsonUtils.stringify(defaultValue, null, true);
        }
    }

    isParamRequired(parameter){
        return _.isUndefined(parameter.default);
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
                                    <Form.Field key={name} error={this.state.errors[name]}>
                                        <GenericField name={name}
                                                      label={name}
                                                      description={parameter.description}
                                                      type={this.getGenericFieldType(parameter)}
                                                      value={this.state.params[name]}
                                                      placeholder={this.getParameterPlaceholder(parameter.default)}
                                                      required={this.isParamRequired(parameter)}
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
                                type={GenericField.BOOLEAN_TYPE}
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