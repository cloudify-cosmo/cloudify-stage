/**
 * Created by pposel on 18/01/2017.
 */

import PropTypes from 'prop-types';

class UpdateDeploymentModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = UpdateDeploymentModal.initialState(props);
    }
    
    static DEFAULT_WORKFLOW = 'default';
    static CUSTOM_WORKFLOW = 'custom';

    static initialState = (props) => ({
        loading: false,
        errors: {},
        blueprints: [],
        yamlFile: null,
        fileLoading: false,
        blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT,
        deploymentInputs: {...props.deployment.inputs},
        runWorkflow: UpdateDeploymentModal.DEFAULT_WORKFLOW,
        installWorkflow: true,
        uninstallWorkflow: true,
        workflowId: '',
        force: false
    });

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        deployment: PropTypes.object.isRequired,
        onHide: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState({loading: true});
            var actions = new Stage.Common.BlueprintActions(this.props.toolbox);
            actions.doGetBlueprints().then((blueprints)=>{
                this.setState({...UpdateDeploymentModal.initialState(nextProps), blueprints});
            }).catch((err)=> {
                this.setState({loading: false, error: err.message});
            }).then(()=> {
                this._selectBlueprint({}, {value: nextProps.deployment.blueprint_id});
            });
        }
    }

    onApprove () {
        this._submitUpdate();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    _submitUpdate() {
        let errors = {};
        if (_.isEmpty(this.state.blueprint.id)) {
            errors['blueprintName']='Please select blueprint';
        }

        if (this.state.runWorkflow === UpdateDeploymentModal.CUSTOM_WORKFLOW && _.isEmpty(this.state.workflowId)) {
            errors['workflowId']='Please provide workflow id';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

         // Disable the form
        this.setState({loading: true});

        var actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doUpdate(this.props.deployment.id,
                         this.state.blueprint.id,
                         this.state.runWorkflow === UpdateDeploymentModal.DEFAULT_WORKFLOW,
                         this.state.installWorkflow,
                         this.state.uninstallWorkflow,
                         this.state.workflowId,
                         this.state.deploymentInputs,
                         this.state.force).then(()=>{
            this.setState({errors: {}, loading: false});
            this.props.toolbox.refresh();
            this.props.onHide();
            this.props.toolbox.getEventBus().trigger('nodes:refresh');
            this.props.toolbox.getEventBus().trigger('inputs:refresh');
            this.props.toolbox.getEventBus().trigger('outputs:refresh');
            this.props.toolbox.getEventBus().trigger('executions:refresh');
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        let fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        if (field.className === Stage.Common.DeployBlueprintModal.DEPLOYMENT_INPUT_CLASSNAME) {
            this.setState({deploymentInputs: {...this.state.deploymentInputs, ...fieldNameValue}});
        } else {
            this.setState(fieldNameValue);
        }
    }

    _getDeploymentInputs(blueprintPlanInputs) {
        let deploymentInputs = {};

        _.forEach(blueprintPlanInputs,
            (inputObj, inputName) => deploymentInputs[inputName] = '');

        return deploymentInputs;
    }

    _stringify(object) {
        if (_.isObject(object) || _.isArray(object) || _.isBoolean(object)) {
            return JSON.stringify(object);
        } else {
            return String(object || '');
        }
    }

    _handleYamlFileChange(file) {
        let blueprintPlanInputs = this.state.blueprint.plan.inputs;

        if (!file) {
            let deploymentInputs = this._getDeploymentInputs(blueprintPlanInputs);
            this.setState({errors: {}, deploymentInputs});
            return;
        }

        this.setState({fileLoading: true});
        let actions = new Stage.Common.FileActions(this.props.toolbox);
        actions.doGetYamlFileContent(file).then((inputs) => {
            let notFoundInputs = [];
            let deploymentInputs = {};

            _.forEach(blueprintPlanInputs, (inputObj, inputName) => {
                let inputValue = inputs[inputName];
                if (_.isEmpty(inputValue)) {
                    if (_.isNil(inputObj.default)) {
                        notFoundInputs.push(inputName);
                    }
                } else {
                    deploymentInputs[inputName] = inputValue;
                }
            });

            if (_.isEmpty(notFoundInputs)) {
                this.setState({errors: {}, deploymentInputs, fileLoading: false});
            } else {
                this.setState({errors: {yamlFile: `Mandatory input(s) (${notFoundInputs}) not provided in YAML file.`}, fileLoading: false});
            }
        }).catch((err)=>{
            this.setState({errors: {yamlFile: err.message}, fileLoading: false});
        });
    }

    _selectBlueprint(proxy, data){
        if (!_.isEmpty(data.value)) {
            this.setState({loading: true});

            let actions = new Stage.Common.BlueprintActions(this.props.toolbox);
            actions.doGetFullBlueprintData({id: data.value}).then((blueprint)=>{
                let deploymentInputs = {};
                if (_.isEqual(this.props.deployment.blueprint_id, blueprint.id)) {
                    deploymentInputs = {...this.props.deployment.inputs};
                } else {
                    _.forEach(blueprint.plan.inputs, (inputObj, inputName) => deploymentInputs[inputName] = '');
                }
                this.setState({deploymentInputs, blueprint, errors: {}, loading: false});
            }).catch((err)=> {
                this.setState({blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT, loading: false, errors: {error: err.message}});
            });
        } else {
            this.setState({blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT, errors: {}});
        }
    }

    render() {
        var {ApproveButton, CancelButton, Form, Header, Icon, Message, Modal, Popup} = Stage.Basic;

        let blueprints = Object.assign({},{items:[]}, this.state.blueprints);
        let options = _.map(blueprints.items, blueprint => { return { text: blueprint.id, value: blueprint.id } });

        let deploymentInputs = _.sortBy(_.map(this.state.blueprint.plan.inputs, (input, name) => ({'name': name, ...input})),
            [(input => !_.isNil(input.default)), 'name']);

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()} className="updateDeploymentModal">
                <Modal.Header>
                    <Icon name="edit"/> Update deployment {this.props.deployment.id}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        <Form.Field error={this.state.errors.blueprintName}>
                            <Form.Dropdown search selection value={this.state.blueprint.id} placeholder="Select Blueprint"
                                           name="blueprintName" options={options} onChange={this._selectBlueprint.bind(this)}/>
                        </Form.Field>

                        {
                            this.state.blueprint.id
                            &&
                            <Form.Divider>
                                <Header size="tiny">
                                    Deployment inputs
                                    <Header.Subheader>
                                        Use "" for an empty string
                                    </Header.Subheader>
                                </Header>
                            </Form.Divider>
                        }

                        {
                            this.state.blueprint.id &&
                            (
                                _.isEmpty(this.state.blueprint.plan.inputs)
                                    ?
                                    <Message content="No inputs available for the selected blueprint"/>
                                    :
                                    <Popup position='top right' wide>
                                        <Popup.Trigger>
                                            <Form.Field error={this.state.errors.yamlFile}>
                                                <Form.File name="yamlFile" placeholder="YAML file" ref="yamlFile"
                                                           onChange={this._handleYamlFileChange.bind(this)} loading={this.state.fileLoading}
                                                           disabled={this.state.fileLoading} />
                                            </Form.Field>
                                        </Popup.Trigger>
                                        <Popup.Content>
                                            <Icon name="info circle"/>Provide YAML file with all deployments inputs to automatically fill in the form.
                                        </Popup.Content>
                                    </Popup>
                            )
                        }

                        {
                            _.map(deploymentInputs, (input) => {
                                let formInput = () =>
                                    <Form.Input name={input.name} placeholder={this._stringify(input.default)}
                                                value={this.state.deploymentInputs[input.name]}
                                                onChange={this._handleInputChange.bind(this)}
                                                className={Stage.Common.DeployBlueprintModal.DEPLOYMENT_INPUT_CLASSNAME} />
                                return (
                                    <Form.Field key={input.name} error={this.state.errors[input.name]}>
                                        <label>
                                            {input.name}&nbsp;
                                            {
                                                _.isNil(input.default)
                                                    ? <Icon name='asterisk' color='red' size='tiny' className='superscripted' />
                                                    : null
                                            }
                                        </label>
                                        {
                                            !_.isNil(input.description)
                                                ? <Popup trigger={formInput()} position='top right' wide >
                                                    <Popup.Content>
                                                        <Icon name="info circle"/>{input.description}
                                                    </Popup.Content>
                                                </Popup>
                                                : formInput()
                                        }
                                    </Form.Field>
                                );
                            })
                        }

                        <Form.Divider>
                            <Form.Radio label="Run default workflow" name="runWorkflow" checked={this.state.runWorkflow === UpdateDeploymentModal.DEFAULT_WORKFLOW}
                                        onChange={this._handleInputChange.bind(this)} value={UpdateDeploymentModal.DEFAULT_WORKFLOW}/>
                        </Form.Divider>

                        <Form.Field>
                            <Form.Checkbox label="Run install workflow on added nodes" toggle
                                           name="installWorkflow" disabled={this.state.runWorkflow !== UpdateDeploymentModal.DEFAULT_WORKFLOW}
                                           checked={this.state.installWorkflow} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox label="Run uninstall workflow on removed nodes" toggle
                                           name="uninstallWorkflow" disabled={this.state.runWorkflow !== UpdateDeploymentModal.DEFAULT_WORKFLOW}
                                           checked={this.state.uninstallWorkflow} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Divider>
                            <Form.Radio label="Run custom workflow" name="runWorkflow" checked={this.state.runWorkflow === UpdateDeploymentModal.CUSTOM_WORKFLOW}
                                        onChange={this._handleInputChange.bind(this)} value={UpdateDeploymentModal.CUSTOM_WORKFLOW}/>
                        </Form.Divider>

                        <Form.Field error={this.state.errors.workflowId}>
                            <Form.Input name='workflowId' placeholder="Workflow ID" disabled={this.state.runWorkflow !== UpdateDeploymentModal.CUSTOM_WORKFLOW}
                                        value={this.state.workflowId} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox label="Force" name="force" toggle
                                           checked={this.state.force} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Update" icon="edit" color="green" />
                </Modal.Actions>
            </Modal>
        );
    }
};

Stage.defineCommon({
    name: 'UpdateDeploymentModal',
    common: UpdateDeploymentModal
});
