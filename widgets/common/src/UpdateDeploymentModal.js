/**
 * Created by pposel on 18/01/2017.
 */

import PropTypes from 'prop-types';
import {Component} from 'react';

class UpdateDeploymentModal extends Component {

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
        skipReinstall: false,
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
            } else if (stringInputValue === Stage.Common.DeployBlueprintModal.EMPTY_STRING) {
                deploymentInputs[inputName] = '';
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
                         this.state.skipReinstall,
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
        if (field.className === Stage.Common.DeployBlueprintModal.DEPLOYMENT_INPUT_CLASSNAME) {
            this.setState({deploymentInputs: {...this.state.deploymentInputs, ...fieldNameValue}});
        } else {
            this.setState(fieldNameValue, () => {
                switch (field.name) {
                    case 'uninstallWorkflow':
                        !field.checked && this.setState({installWorkflowFirst: false, ignoreFailure: false});
                        break;
                }
            });
        }
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
                } else if (stringValue === '') {
                    deploymentInputs[inputName] = Stage.Common.DeployBlueprintModal.EMPTY_STRING;
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

                        <Form.Divider>
                            <Header size="tiny">
                                Blueprint
                            </Header>
                        </Form.Divider>

                        <Form.Field error={this.state.errors.blueprintName}>
                            <Form.Dropdown search selection value={this.state.blueprint.id} placeholder="Select Blueprint"
                                           name="blueprintName" options={blueprintsOptions} onChange={this._selectBlueprint.bind(this)}/>
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

                                    <Form.Field error={this.state.errors.yamlFile}
                                                help='Provide YAML file with all deployments inputs
                                                      to automatically fill in the form.'>
                                        <Form.File name="yamlFile" placeholder="YAML file" ref="yamlFile"
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
                                                    onChange={this._handleInputChange.bind(this)}
                                                    className={Stage.Common.DeployBlueprintModal.DEPLOYMENT_INPUT_CLASSNAME} />
                                    </Form.Field>
                                );
                            })
                        }

                        <Form.Divider>
                            <Header size="tiny">
                                Actions
                            </Header>
                        </Form.Divider>

                        <Form.Field help='Run install lifecycle operations'>
                            <Form.Checkbox label="Run install workflow" toggle name="installWorkflow"
                                           checked={this.state.installWorkflow} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field help='Run uninstall lifecycle operations'>
                            <Form.Checkbox label="Run uninstall workflow" toggle name="uninstallWorkflow"
                                           checked={this.state.uninstallWorkflow} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field help='Run install workflow first and then uninstall workflow.
                                          Default: first uninstall and then install'>
                            <Form.Checkbox label="Run install workflow first" toggle name="installWorkflowFirst"
                                           checked={this.state.installWorkflowFirst} onChange={this._handleInputChange.bind(this)}
                                           disabled={!this.state.uninstallWorkflow} />
                        </Form.Field>


                        <Form.Field help='Supply the parameter `ignore_failure` with
                                          the value `true` to the uninstall workflow'>
                            <Form.Checkbox label="Ignore failures in uninstall workflow" toggle name="ignoreFailure"
                                           checked={this.state.ignoreFailure} onChange={this._handleInputChange.bind(this)}
                                           disabled={!this.state.uninstallWorkflow} />
                        </Form.Field>

                        <NodeInstancesFilter name='reinstallList' deploymentId={this.props.deployment.id}
                                             label='Reinstall list' value={this.state.reinstallList}
                                             placeholder='Choose node instances to reinstall' upward
                                             onChange={this._handleInputChange.bind(this)}
                                             help='Node instances ids to be reinstalled as part
                                                   of deployment update. They will be
                                                   reinstalled even if "Skip reinstall" is set' />

                        <Form.Field help='Skip automatically reinstall node instances
                                          that their properties has been modified, as
                                          part of a deployment update. Node instances
                                          that were explicitly given to the reinstall
                                          list will still be reinstalled'>
                            <Form.Checkbox label="Skip reinstall" name="skipReinstall" toggle
                                           checked={this.state.skipReinstall}
                                           onChange={this._handleInputChange.bind(this)}  />
                        </Form.Field>

                        <Form.Field help='Force running update in case a previous
                                          update on this deployment has failed to
                                          finished successfully'>
                            <Form.Checkbox label="Force update" name="force" toggle
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
