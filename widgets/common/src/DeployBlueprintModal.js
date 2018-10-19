/**
 * Created by kinneretzin on 05/10/2016.
 */

import PropTypes from 'prop-types';

class DeployBlueprintModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = DeployBlueprintModal.initialState;
    }

    static EMPTY_BLUEPRINT = {id: '', plan: {inputs: {}}};

    static initialState = {
        loading: false,
        errors: {},
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
        blueprint: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            let deploymentInputs = Stage.Common.InputsUtils.getInputsFromPlan(nextProps.blueprint.plan.inputs);
            this.setState({...DeployBlueprintModal.initialState, deploymentInputs});
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

    _submitDeploy() {
        let {InputsUtils} = Stage.Common;
        let errors = {};

        if (!this.props.blueprint) {
            errors['error'] = 'Blueprint not selected';
        }

        if (_.isEmpty(this.state.deploymentName)) {
            errors['deploymentName']='Please provide deployment name';
        }

        let inputsWithoutValue = {};
        const deploymentInputs = InputsUtils.getInputsToSend(this.props.blueprint.plan.inputs,
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
        actions.doDeploy(this.props.blueprint, this.state.deploymentName, deploymentInputs, this.state.visibility, this.state.skipPluginsValidation)
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
        let blueprintPlanInputs = this.props.blueprint.plan.inputs;

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

    _handleInputChange(proxy, field) {
        let fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState(fieldNameValue);
    }

    _handleDeploymentInputChange(proxy, field) {
        let fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState({deploymentInputs: {...this.state.deploymentInputs, ...fieldNameValue}});
    }

    render() {
        let {ApproveButton, CancelButton, Form, Icon, Message, Modal, VisibilityField} = Stage.Basic;
        let {InputsHeader, InputsUtils} = Stage.Common;

        let blueprint = Object.assign({}, DeployBlueprintModal.EMPTY_BLUEPRINT, this.props.blueprint);

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()} className="deployBlueprintModal">
                <Modal.Header>
                    <Icon name="rocket"/> Deploy blueprint {blueprint.id}
                    <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                  onVisibilityChange={(visibility)=>this.setState({visibility: visibility})} disallowGlobal={true}/>
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        <Form.Field error={this.state.errors.deploymentName} label="Deployment name" required>
                            <Form.Input name='deploymentName'
                                        value={this.state.deploymentName}
                                        onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        {
                            blueprint.id
                            &&
                            <InputsHeader />
                        }

                        {
                            blueprint.id &&
                            (
                                _.isEmpty(blueprint.plan.inputs)
                                ?
                                    <Message content="No inputs available for the blueprint"/>
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
                            InputsUtils.getInputFields(blueprint.plan.inputs,
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
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Deploy" icon="rocket" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};

Stage.defineCommon({
    name: 'DeployBlueprintModal',
    common: DeployBlueprintModal
});