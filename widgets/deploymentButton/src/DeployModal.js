
/**
 * Created by kinneretzin on 05/10/2016.
 */

import PropTypes from 'prop-types';

export default class DeployModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = DeployModal.initialState;
    }

    static initialState = {
        loading: false,
        errors: {},
        blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT,
        deploymentName: '',
        yamlFile: null,
        fileLoading: false,
        deploymentInputs: [],
        visibility: Stage.Common.Consts.defaultVisibility,
        skipPluginsValidation: false
    };

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        blueprints: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState(DeployModal.initialState);
        }
    }

    onApprove () {
        this._submitDeploy();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    _selectBlueprint(proxy, data){
        if (!_.isEmpty(data.value)) {
            this.setState({loading: true});

            var actions = new Stage.Common.BlueprintActions(this.props.toolbox);
            actions.doGetFullBlueprintData({id: data.value}).then((blueprint)=>{
                let deploymentInputs = Stage.Common.InputsUtils.getInputsFromPlan(blueprint.plan.inputs);
                this.setState({deploymentInputs, blueprint, errors: {}, loading: false});
            }).catch((err)=> {
                this.setState({blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT, loading: false, errors: {error: err.message}});
            });
        } else {
            this.setState({blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT, errors: {}});
        }
    }

    _handleInputChange(proxy, field) {
        let fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState(fieldNameValue);
    }

    _handleDeploymentInputChange(proxy, field) {
        let fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState({deploymentInputs: {...this.state.deploymentInputs, ...fieldNameValue}});
    }

    _submitDeploy () {
        let {InputsUtils} = Stage.Common;
        let errors = {};

        if (_.isEmpty(this.state.blueprint.id)) {
            errors['blueprintName']='Please select blueprint from the list';
        }

        if (_.isEmpty(this.state.deploymentName)) {
            errors['deploymentName']='Please provide deployment name';
        }

        let inputsWithoutValue = {};
        const deploymentInputs = InputsUtils.getInputsToSend(this.state.blueprint.plan.inputs,
                                                             this.state.deploymentInputs,
                                                             inputsWithoutValue);
        InputsUtils.addErrors(inputsWithoutValue, errors);

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doDeploy(this.state.blueprint, this.state.deploymentName, deploymentInputs, this.state.visibility, this.state.skipPluginsValidation)
            .then((/*deployment*/)=> {
                this.setState({loading: false, errors: {}});
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.onHide();
            })
            .catch((err)=>{
                this.setState({loading: false, errors: {error: err.message}});
            });
    }

    _handleYamlFileChange(file) {
        let {FileActions, InputsUtils} = Stage.Common;
        let blueprintPlanInputs = this.state.blueprint.plan.inputs;

        if (!file) {
            let deploymentInputs = InputsUtils.getInputsFromPlan(blueprintPlanInputs);
            this.setState({errors: {}, deploymentInputs});
            return;
        }

        this.setState({fileLoading: true});
        let actions = new FileActions(this.props.toolbox);
        actions.doGetYamlFileContent(file).then((inputs) => {
            let notFoundInputs = [];
            let deploymentInputs = InputsUtils.getInputsFromYaml(blueprintPlanInputs, inputs, notFoundInputs);

            if (_.isEmpty(notFoundInputs)) {
                this.setState({errors: {}, deploymentInputs, fileLoading: false});
            } else {
                this.setState({errors: {yamlFile: `Mandatory input(s) (${notFoundInputs}) not provided in YAML file.`}, fileLoading: false});
            }
        }).catch((err)=>{
            this.setState({errors: {yamlFile: err.message}, fileLoading: false});
        });
    }

    render() {
        let {ApproveButton, CancelButton, Form, Icon, Message, Modal, VisibilityField} = Stage.Basic;
        let {InputsHeader, InputsUtils} = Stage.Common;

        let blueprints = Object.assign({},{items:[]}, this.props.blueprints);
        let options = _.map(blueprints.items, blueprint => { return { text: blueprint.id, value: blueprint.id } });

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()}>
                <Modal.Header>
                    <Icon name="rocket"/> Create new deployment
                    <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                  onVisibilityChange={(visibility)=>this.setState({visibility:visibility})} disallowGlobal={true}/>
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        <Form.Field error={this.state.errors.deploymentName} label='Deployment name' required>
                            <Form.Input name='deploymentName'
                                        value={this.state.deploymentName}
                                        onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.blueprintName} label='Blueprint' required>
                            <Form.Dropdown search selection value={this.state.blueprint.id}
                                           name="blueprintName" options={options} onChange={this._selectBlueprint.bind(this)}/>
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
                                                help='Provide YAML file with all deployments inputs to automatically fill in the form.'>
                                        <Form.File name="yamlFile" ref="yamlFile"
                                                   onChange={this._handleYamlFileChange.bind(this)} loading={this.state.fileLoading}
                                                   disabled={this.state.fileLoading} />
                                    </Form.Field>
                            )
                        }

                        {
                            InputsUtils.getInputFields(this.state.blueprint.plan.inputs,
                                    this._handleDeploymentInputChange.bind(this),
                                    this.state.deploymentInputs,
                                    this.state.errors)
                        }
                        <Form.Field className='skipPluginsValidationCheckbox'>
                            <Form.Checkbox toggle
                                           label="Skip plugins validation"
                                           name='skipPluginsValidation'
                                           checked={this.state.skipPluginsValidation}
                                           onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        {
                            this.state.skipPluginsValidation && <Message>The recommended path is uploading plugins as wagons to Cloudify. This option is designed for plugin development and advanced users only.</Message>
                        }
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Deploy" icon="rocket" className="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
