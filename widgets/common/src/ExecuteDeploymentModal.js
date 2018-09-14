/**
 * Created by kinneretzin on 19/10/2016.
 */

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
            let params = _.mapValues(
                _.get(nextProps.workflow, 'parameters', {}),
                (parameterData) =>
                    !_.isUndefined(parameterData.default)
                    ? Stage.Common.JsonUtils.getStringValue(parameterData.default)
                    : '');
            this.setState({...ExecuteDeploymentModal.initialState, params});
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

        // Check required parameters has value
        let errors = {};
        _.forEach(this.props.workflow.parameters, (param, name) => {
            if(this.isParamRequired(param) && _.isEmpty(this.state.params[name])) {
                errors[name] = `Please provide value for '${name}'`;
            }
        });
        if (!_.isEmpty(errors)){
            this.setState({errors: errors});
            return false;
        }

        this.setState({loading: true});
        const {JsonUtils, DeploymentActions} = Stage.Common;

        // Parse params to typed values (booleans, integers, objects/arrays or strings)
        // and remove parameters which are not changed (the same as default values)
        let paramsJson = {};
        _.forEach(this.state.params, (value, name) => {
            const defaultValue = this.props.workflow.parameters[name].default;
            if (this.isParamRequired(this.props.workflow.parameters[name]) ||
                !_.isEqual(JsonUtils.getStringValue(value), JsonUtils.getStringValue(defaultValue))) {
                paramsJson[name] = JsonUtils.getTypedValue(value);
            }
        });

        const actions = new DeploymentActions(this.props.toolbox);
        actions.doExecute(this.props.deployment, this.props.workflow, paramsJson, this.state.force).then(()=>{
            this.setState({loading: false, errors: {}});
            this.props.onHide();
            this.props.toolbox.getEventBus().trigger('executions:refresh');
            this.props.toolbox.getEventBus().trigger('deployments:refresh');
        }).catch((err)=>{
            this.setState({loading: false, errors: {error: err.message}});
        })
    }

    getGenericFieldType(parameter){
        const {GenericField} = Stage.Basic;

        switch (parameter.type){
            case 'boolean':
                return GenericField.BOOLEAN_TYPE;
            case 'integer':
                return GenericField.NUMBER_TYPE;
            default:
                return GenericField.STRING_TYPE;
        }
    }

    getParameterPlaceholder(defaultValue){
        return _.isUndefined(defaultValue)
            ? null
            : Stage.Common.JsonUtils.getStringValue(defaultValue);
    }

    isParamRequired(parameter){
        return _.isUndefined(parameter.default);
    }

    handleInputChange(event, field) {
        this.setState({params: {...this.state.params, ...Stage.Basic.Form.fieldNameValue(field)}});
    }

    render() {
        let {Modal, Icon, Form, Message, ApproveButton, CancelButton, GenericField, RevertToDefaultIcon} = Stage.Basic;
        let {JsonUtils} = Stage.Common;

        const workflow = Object.assign({},{name:'', parameters:[]}, this.props.workflow);
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
                            _.map(workflow.parameters, (parameter, name) => {
                                // TODO: Add RevertToDefaultIcon
                                // const value = JsonUtils.getStringValue(this.state.params[name]);
                                // const defaultValue = JsonUtils.getStringValue(parameter.default);
                                // const revertToDefault = () => this.handleInputChange(null, {name, value: defaultValue});
                                //
                                // icon={<RevertToDefaultIcon value={value} defaultValue={defaultValue}
                                //                            onClick={revertToDefault} />}

                                return (
                                    <GenericField name={name}
                                                  label={name}
                                                  key={name}
                                                  error={!!this.state.errors[name]}
                                                  description={parameter.description}
                                                  type={this.getGenericFieldType(parameter)}
                                                  value={this.state.params[name]}
                                                  placeholder={this.getParameterPlaceholder(parameter.default)}
                                                  required={this.isParamRequired(parameter)}
                                                  onChange={this.handleInputChange.bind(this)} />
                                );
                            })
                        }

                        <GenericField name="force"
                                      label="force"
                                      key="force"
                                      description=""
                                      type={GenericField.BOOLEAN_TYPE}
                                      value={this.state.force}
                                      onChange={(event, field) => this.setState({force: field.checked})} />
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