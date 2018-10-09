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

    getRevertToDefaultIcon(parameter, name) {
        let {RevertToDefaultIcon} = Stage.Basic;
        let {JsonUtils} = Stage.Common;

        const value = JsonUtils.getStringValue(this.state.params[name]);
        const defaultValue = JsonUtils.getStringValue(parameter.default);
        const revertToDefault = () => this.handleInputChange(null, {name, value: defaultValue});

        return _.isNil(parameter.default)
            ? undefined
            : <RevertToDefaultIcon value={value} defaultValue={defaultValue} onClick={revertToDefault} />;
    }

    render() {
        let {Modal, Icon, Form, Message, ApproveButton, CancelButton} = Stage.Basic;

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
                                const icon = this.getRevertToDefaultIcon(parameter, name);

                                switch (parameter.type){
                                    case 'boolean':
                                        return (
                                            <Form.Field required={this.isParamRequired(parameter)}
                                                        help={parameter.description}>
                                                <Form.Checkbox name={name} toggle label={name}
                                                               checked={this.state.params[name]}
                                                               onChange={this.handleInputChange.bind(this)} />
                                            </Form.Field>
                                        );
                                    case 'integer':
                                        return (
                                            <Form.Field required={this.isParamRequired(parameter)}
                                                        label={name}
                                                        help={parameter.description}
                                                        error={!!this.state.errors[name]}>
                                                <Form.Input name={name} type='number' fluid icon={icon}
                                                            value={this.state.params[name]}
                                                            onChange={this.handleInputChange.bind(this)} />
                                            </Form.Field>
                                        );
                                    default:
                                        return (
                                            <Form.Field required={this.isParamRequired(parameter)}
                                                        label={name}
                                                        help={parameter.description}
                                                        error={!!this.state.errors[name]}>
                                                <Form.Input name={name} fluid icon={icon}
                                                            value={this.state.params[name]}
                                                            onChange={this.handleInputChange.bind(this)}
                                                            placeholder={this.getParameterPlaceholder(parameter.default)} />
                                            </Form.Field>
                                        );
                                }
                            })
                        }

                        <Form.Field>
                            <Form.Checkbox name='force' toggle label='force'
                                           checked={this.state.force}
                                           onChange={(event, field) => this.setState({force: field.checked})} />
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