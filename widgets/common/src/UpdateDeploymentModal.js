/**
 * Created by pposel on 18/01/2017.
 */

import PropTypes from 'prop-types';

class UpdateDeploymentModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = UpdateDeploymentModal.initialState(props);
    }
    
    static initialState = (props) => ({
        loading: false,
        errors: {},
        blueprints: [],
        yamlFile: null,
        fileLoading: false,
        blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT,
        deploymentInputs: {...props.deployment.inputs},
        installWorkflow: true,
        uninstallWorkflow: true,
        installWorkflowFirst: false,
        ignoreFailure: false,
        automaticReinstall: true,
        reinstallList: [],
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
            let actions = new Stage.Common.BlueprintActions(this.props.toolbox);
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

        let deploymentInputs = {};
        _.forEach(this.state.blueprint.plan.inputs, (inputObj, inputName) => {
            let stringInputValue = this.state.deploymentInputs[inputName];
            let typedInputValue = Stage.Common.JsonUtils.getTypedValue(stringInputValue);

            if (_.isEmpty(stringInputValue)) {
                if (_.isNil(inputObj.default)) {
                    errors[inputName] = `Please provide ${inputName}`;
                }
            } else if (_.first(stringInputValue) === '"' && _.last(stringInputValue) === '"') {
                deploymentInputs[inputName] = _.trim(stringInputValue, '"');
            } else {
                deploymentInputs[inputName] = typedInputValue;
            }
        });

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

         // Disable the form
        this.setState({loading: true});

        let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions.doUpdate(this.props.deployment.id,
                         this.state.blueprint.id,
                         deploymentInputs,
                         this.state.installWorkflow,
                         this.state.uninstallWorkflow,
                         this.state.installWorkflowFirst,
                         this.state.ignoreFailure,
                         this.state.automaticReinstall,
                         this.state.reinstallList,
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
        this.setState(fieldNameValue);
    }

    _handleDeploymentInputChange(proxy, field) {
        let fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState({deploymentInputs: {...this.state.deploymentInputs, ...fieldNameValue}});
    }

    _getDeploymentInputs(blueprintPlanInputs) {
        let deploymentInputs = {};

        _.forEach(blueprintPlanInputs,
            (inputObj, inputName) => deploymentInputs[inputName] = '');

        return deploymentInputs;
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
                let stringValue = Stage.Common.JsonUtils.getStringValue(inputs[inputName]);

                if (_.isNil(inputs[inputName])) {
                    // Input not present in YAML file
                    if (_.isNil(inputObj.default)) {
                        // Mandatory input
                        notFoundInputs.push(inputName);
                    } else {
                        // Optional input
                        deploymentInputs[inputName] = '';
                    }
                } else if (_.first(stringValue) === '"' && _.last(stringValue) === '"') {
                    deploymentInputs[inputName] = _.trim(stringValue, '"');
                } else {
                    deploymentInputs[inputName] = stringValue;
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
                let currentDeploymentInputs = this.props.deployment.inputs;

                _.forEach(blueprint.plan.inputs, (inputObj, inputName) => {
                    if (!_.isUndefined(currentDeploymentInputs[inputName])) {
                        let stringValue = Stage.Common.JsonUtils.getStringValue(currentDeploymentInputs[inputName]);

                        if (stringValue === '') {
                            deploymentInputs[inputName] = Stage.Common.DeployBlueprintModal.EMPTY_STRING;
                        } else {
                            let valueType = Stage.Common.JsonUtils.toType(deploymentInputs[inputName]);
                            let castedValue = Stage.Common.JsonUtils.getTypedValue(stringValue);
                            let castedValueType = Stage.Common.JsonUtils.toType(castedValue);
                            if (valueType !== castedValueType) {
                                stringValue = `"${stringValue}"`;
                            }
                            deploymentInputs[inputName] = stringValue;
                        }
                    } else {
                        deploymentInputs[inputName] = '';
                    }
                });

                this.setState({deploymentInputs, blueprint, errors: {}, loading: false});
            }).catch((err)=> {
                this.setState({blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT, loading: false, errors: {error: err.message}});
            });
        } else {
            this.setState({blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT, errors: {}});
        }
    }

    render() {
        let {ApproveButton, CancelButton, Form, Header, Icon, Message, Modal, NodeInstancesFilter} = Stage.Basic;
        let {InputsHeader} = Stage.Common;

        let blueprints = Object.assign({},{items:[]}, this.state.blueprints);
        let blueprintsOptions = _.map(blueprints.items, blueprint => { return { text: blueprint.id, value: blueprint.id } });

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

                        <Form.Field error={this.state.errors.blueprintName} label='Blueprint' required>
                            <Form.Dropdown search selection value={this.state.blueprint.id} placeholder="Select Blueprint"
                                           name="blueprintName" options={blueprintsOptions} onChange={this._selectBlueprint.bind(this)}/>
                        </Form.Field>

                        {
                            this.state.blueprint.id
                            &&
                            <InputsHeader />
                        }

                        {
                            this.state.blueprint.id &&
                            (
                                _.isEmpty(this.state.blueprint.plan.inputs)
                                    ?
                                    <Message content="No inputs available for the selected blueprint"/>
                                    :

                                    <Form.Field error={this.state.errors.yamlFile} label='YAML file'
                                                help='Provide YAML file with all deployments inputs
                                                      to automatically fill in the form.'>
                                        <Form.File name="yamlFile" ref="yamlFile"
                                                   onChange={this._handleYamlFileChange.bind(this)} loading={this.state.fileLoading}
                                                   disabled={this.state.fileLoading} />
                                    </Form.Field>
                            )
                        }

                        {
                            _.map(deploymentInputs, (input) => {
                                return (
                                    <Form.Field key={input.name} error={this.state.errors[input.name]} help={input.description}
                                                label={input.name} required={_.isNil(input.default)}>
                                        <Form.Input name={input.name} placeholder={Stage.Common.JsonUtils.getStringValue(input.default || '')}
                                                    value={this.state.deploymentInputs[input.name]}
                                                    onChange={this._handleDeploymentInputChange.bind(this)} />
                                    </Form.Field>
                                );
                            })
                        }

                        <Form.Divider>
                            <Header size="tiny">
                                Actions
                            </Header>
                        </Form.Divider>

                        <Form.Field>
                            <Form.Checkbox label="Run install workflow" toggle name="installWorkflow"
                                           help='Run install lifecycle operations'
                                           checked={this.state.installWorkflow} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox label="Run uninstall workflow" toggle name="uninstallWorkflow"
                                           help='Run uninstall lifecycle operations'
                                           checked={this.state.uninstallWorkflow} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox label="Run install workflow first"
                                           help='Run install workflow first and then uninstall workflow.
                                                 Default: first uninstall and then install'
                                           toggle name="installWorkflowFirst"
                                           checked={this.state.installWorkflowFirst} onChange={this._handleInputChange.bind(this)} />
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox label="Ignore failures in uninstall workflow" toggle name="ignoreFailure"
                                           help='Supply the parameter `ignore_failure` with
                                                 the value `true` to the uninstall workflow'
                                           checked={this.state.ignoreFailure} onChange={this._handleInputChange.bind(this)} />
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox label="Run automatic reinstall" name="automaticReinstall" toggle
                                           help='Automatically reinstall node instances
                                                 that their properties has been modified, as
                                                 part of a deployment update. If not set, then node instances
                                                 that were explicitly given to "Reinstall
                                                 node instances list" will still be reinstalled'
                                           checked={this.state.automaticReinstall}
                                           onChange={this._handleInputChange.bind(this)}  />
                        </Form.Field>

                        <NodeInstancesFilter name='reinstallList' deploymentId={this.props.deployment.id}
                                             label='Reinstall node instances list' value={this.state.reinstallList}
                                             placeholder='Choose node instances to reinstall' upward
                                             onChange={this._handleInputChange.bind(this)}
                                             help='Node instances ids to be reinstalled as part
                                                   of deployment update. They will be
                                                   reinstalled even if "Run automatic reinstall"
                                                   is not set' />


                        <Form.Field>
                            <Form.Checkbox label="Force update" name="force" toggle
                                           help='Force running update in case a previous
                                                 update on this deployment has failed to
                                                 finished successfully'
                                           checked={this.state.force} onChange={this._handleInputChange.bind(this)} />
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
