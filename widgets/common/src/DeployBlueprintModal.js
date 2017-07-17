/**
 * Created by kinneretzin on 05/10/2016.
 */

let PropTypes = React.PropTypes;

export default class DeployBlueprintModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = DeployBlueprintModal.initialState;
    }

    static DEPLOYMENT_INPUT_CLASSNAME = 'deploymentInput';

    static initialState = {
        loading: false,
        errors: {},
        deploymentName: '',
        deploymentInputs: [],
        privateResource: false,
        skipPluginsValidation: false
    }

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
            let deploymentInputs = {};

            _.forEach(nextProps.blueprint.plan.inputs,
                      (inputObj, inputName) => deploymentInputs[inputName] = '');
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
        let errors = {};
        const EMPTY_STRING = '""';

        if (!this.props.blueprint) {
            errors["error"] = "Blueprint not selected";
        }

        if (_.isEmpty(this.state.deploymentName)) {
            errors["deploymentName"]="Please provide deployment name";
        }

        let deploymentInputs = {};
        _.forEach(this.props.blueprint.plan.inputs, (inputObj, inputName) => {
            let inputValue = this.state.deploymentInputs[inputName];
            if (_.isEmpty(inputValue)) {
                if (_.isNil(inputObj.default)) {
                    errors[inputName] = `Please provide ${inputName}`;
                }
            } else if (inputValue === EMPTY_STRING) {
                deploymentInputs[inputName] = '';
            } else {
                deploymentInputs[inputName] = inputValue;
            }
        });

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doDeploy(this.props.blueprint, this.state.deploymentName, deploymentInputs, this.state.privateResource, this.state.skipPluginsValidation)
            .then((/*deployment*/)=> {
                this.setState({loading: false, errors: {}});
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.onHide();
            })
            .catch((err)=>{
                this.setState({loading: false, errors: {error: err.message}});
            });
    }

    _handleInputChange(proxy, field) {
        let fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        if (field.className === DeployBlueprintModal.DEPLOYMENT_INPUT_CLASSNAME) {
            this.setState({deploymentInputs: {...this.state.deploymentInputs, ...fieldNameValue}});
        } else {
            this.setState(fieldNameValue);
        }
    }

    _stringify(object) {
        if (_.isObject(object) || _.isArray(object) || _.isBoolean(object)) {
            return JSON.stringify(object);
        } else {
            return String(object || '');
        }
    }

    render() {
        var {Modal, Icon, Form, Message, Popup, Header, ApproveButton, CancelButton, PrivateField} = Stage.Basic;

        let blueprint = Object.assign({},{id: '', plan: {inputs: {}}}, this.props.blueprint);
        let deploymentInputs = _.sortBy(_.map(blueprint.plan.inputs, (input, name) => ({'name': name, ...input})),
                                        [(input => !_.isNil(input.default)), 'name']);

        return (
            <Modal open={this.props.open} className="deployBlueprintModal">
                <Modal.Header>
                    <Icon name="rocket"/> Deploy blueprint {blueprint.id}
                    <PrivateField lock={this.state.privateResource} title="Private resource" className="rightFloated"
                             onClick={()=>this.setState({privateResource:!this.state.privateResource})}/>
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        <Form.Field error={this.state.errors.deploymentName}>
                            <Form.Input name='deploymentName' placeholder="Deployment name"
                                        value={this.state.deploymentName}
                                        onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        {
                            blueprint.id
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
                            blueprint.id && _.isEmpty(deploymentInputs)
                            &&
                            <Message content="No inputs available for the blueprint"/>
                        }
                        {
                            _.map(deploymentInputs, (input) => {
                                let formInput = () =>
                                    <Form.Input name={input.name} placeholder={input.description}
                                                value={this.state.deploymentInputs[input.name]}
                                                onChange={this._handleInputChange.bind(this)}
                                                className={DeployBlueprintModal.DEPLOYMENT_INPUT_CLASSNAME} />
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
                                            !_.isNil(input.default)
                                            ? <Popup trigger={formInput()} header="Default value"
                                                     content={this._stringify(input.default)}
                                                     position='top right' wide />
                                            : formInput()
                                        }
                                    </Form.Field>
                                );
                            })
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