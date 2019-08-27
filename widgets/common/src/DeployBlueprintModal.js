/**
 * Created by kinneretzin on 05/10/2016.
 */

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
        skipPluginsValidation: false,
        siteName: '',
        sites: {items:[]},
        functionsEager: true
    };

    /**
     * propTypes
     * @property {object} toolbox Toolbox object
     * @property {boolean} open specifies whether the deploy modal is displayed
     * @property {object} blueprints holds list of blueprints
     * @property {function} onHide function to be called when the modal is closed
     */
    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        blueprint: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            let deploymentInputs = Stage.Common.InputsUtils.getInputsInitialValuesFrom(this.props.blueprint.plan);
            let actions = new Stage.Common.DeploymentActions(this.props.toolbox);
            actions.doGetSites().then((sites) => {
                this.setState({...DeployBlueprintModal.initialState, deploymentInputs, sites});
            }).catch((err)=> {
                this.setState({loading: false, error: err.message});
            });
        }
    }

    onApprove () {
        this.setState({errors: {}}, this._submitDeploy);
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

        let actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doDeploy(this.props.blueprint, this.state.deploymentName, deploymentInputs, this.state.visibility,
                         this.state.skipPluginsValidation, this.state.siteName, this.state.functionsEager)
            .then((/*deployment*/)=> {
                this.setState({loading: false, errors: {}});
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.onHide();
            })
            .catch((err) => {
                const errors = InputsUtils.getErrorObject(err.message);
                this.setState({loading: false, errors});
            });
    }

    _handleYamlFileChange(file) {
        if (!file) {
            return;
        }

        let {FileActions, InputsUtils} = Stage.Common;
        let actions = new FileActions(this.props.toolbox);
        this.setState({fileLoading: true});

        actions.doGetYamlFileContent(file).then((yamlInputs) => {
            let deploymentInputs = InputsUtils.getUpdatedInputs(this.props.blueprint.plan.inputs, this.state.deploymentInputs, yamlInputs);
            this.setState({errors: {}, deploymentInputs, fileLoading: false});
        }).catch((err) => {
            const errorMessage = `Loading values from YAML file failed: ${_.isString(err) ? err : err.message}`;
            this.setState({errors: {yamlFile: errorMessage}, fileLoading: false});
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
        let {DataTypesButton, InputsHeader, InputsUtils, YamlFileButton} = Stage.Common;

        let blueprint = Object.assign({}, DeployBlueprintModal.EMPTY_BLUEPRINT, this.props.blueprint);
        let site_options = _.map(this.state.sites.items, site => { return { text: site.name, value: site.name } });

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()} closeOnEscape={false}
                   className="deployBlueprintModal">
                <Modal.Header>
                    <Icon name="rocket"/> Deploy blueprint {blueprint.id}
                    <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                     onVisibilityChange={(visibility)=>this.setState({visibility: visibility})} />
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors} scrollToError
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        <Form.Field error={this.state.errors.deploymentName} label='Deployment name' required
                                    help='Specify a name for this deployment instance.'>
                            <Form.Input name='deploymentName'
                                        value={this.state.deploymentName}
                                        onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.siteName} label='Site name'
                                    help='(Optional) Specify a site to which this deployment will be assigned.'>
                            <Form.Dropdown search selection value={this.state.siteName} name='siteName'
                                           options={site_options} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        {
                            blueprint.id &&
                            <React.Fragment>
                                {
                                    !_.isEmpty(blueprint.plan.inputs) &&
                                    <YamlFileButton onChange={this._handleYamlFileChange.bind(this)}
                                                    dataType="deployment's inputs"
                                                    fileLoading={this.state.fileLoading}/>
                                }
                                {
                                    !_.isEmpty(blueprint.plan.data_types) &&
                                    <DataTypesButton types={blueprint.plan.data_types} />
                                }
                                <InputsHeader/>
                                {
                                    _.isEmpty(blueprint.plan.inputs) &&
                                    <Message content="No inputs available for the blueprint"/>
                                }
                            </React.Fragment>
                        }

                        {
                            InputsUtils.getInputFields(blueprint.plan.inputs,
                                                       this._handleDeploymentInputChange.bind(this),
                                                       this.state.deploymentInputs,
                                                       this.state.errors,
                                                       blueprint.plan.data_types)
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

                        <Form.Field help='If set, then get_property and get_input intrinsic functions will be evaluated
                                          at deployment creation time. If not set evaluation will be done on demand at runtime.'>
                            <Form.Checkbox toggle
                                           label="Evaluate functions at runtime"
                                           name='functionsEager'
                                           checked={this.state.functionsEager}
                                           onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>
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