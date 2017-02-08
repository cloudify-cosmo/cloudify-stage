/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class DeployModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = DeployModal.initialState;
    }

    static DEPLOYMENT_INPUT_CLASSNAME = 'deploymentInput';

    static initialState = {
        loading: false,
        errors: {},
        deploymentName: '',
        deploymentInputs: []
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        show: PropTypes.bool.isRequired,
        blueprint: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            let deploymentInputs = {};

            _.forEach(nextProps.blueprint.plan.inputs,
                      (inputObj, inputName) =>
                          deploymentInputs[inputName] = this._getStringValue(inputObj.default));
            this.setState({...DeployModal.initialState, deploymentInputs});
        }
    }

    onApprove () {
        this.refs.deployForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    _submitDeploy() {
        let errors = {};

        if (!this.props.blueprint) {
            errors["error"] = "Blueprint not selected";
        }

        if (_.isEmpty(this.state.deploymentName)) {
            errors["deploymentName"]="Please provide deployment name";
        }

        _.forEach(this.state.deploymentInputs, (inputValue, inputName) => {
            if (_.isEmpty(inputValue)) {
                errors[inputName] = `Please provide ${inputName}`;
            }
        })

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doDeploy(this.props.blueprint, this.state.deploymentName, this.state.deploymentInputs)
            .then((/*deployment*/)=> {
                this.setState({loading: false});
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.onHide();
            })
            .catch((err)=>{
                this.setState({loading: false, errors: {error: err.message}});
            });
    }

    _handleInputChange(proxy, field) {
        let fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        if (field.className === DeployModal.DEPLOYMENT_INPUT_CLASSNAME) {
            this.setState({deploymentInputs: {...this.state.deploymentInputs, ...fieldNameValue}});
        } else {
            this.setState(fieldNameValue);
        }

    }

    _getStringValue(object) {
        if (_.isObject(object) || _.isArray(object) || _.isBoolean(object)) {
            return JSON.stringify(object);
        } else {
            return String(object || '');
        }
    }

    render() {
        var {Modal, Icon, Form, Message} = Stage.Basic;

        var blueprint = Object.assign({},{id: '', plan: {inputs: {}}}, this.props.blueprint);

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                <Modal.Header>
                    <Icon name="rocket"/> Deploy blueprint {blueprint.id}
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this._submitDeploy.bind(this)} errors={this.state.errors} ref="deployForm">

                        <Form.Field error={this.state.errors.deploymentName}>
                            <Form.Input name='deploymentName' placeholder="Deployment name"
                                        value={this.state.deploymentName} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        {
                            blueprint.id
                            &&
                            <Form.Divider>Deployment inputs</Form.Divider>
                        }

                        {
                            blueprint.id && _.isEmpty(blueprint.plan.inputs)
                            &&
                            <Message content="No inputs available for the blueprint"/>
                        }
                        {
                            _.map(blueprint.plan.inputs, (input, name) => {
                                return (
                                    <Form.Field key={name} error={this.state.errors[name]}>
                                        <label>{name}</label>
                                        <Form.Input name={name} placeholder={input.description} className={DeployModal.DEPLOYMENT_INPUT_CLASSNAME}
                                                    value={this.state.deploymentInputs[name]} onChange={this._handleInputChange.bind(this)}/>
                                    </Form.Field>
                                );
                            })
                        }
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Cancel/>
                    <Modal.Approve label="Deploy" icon="rocket" className="green"/>
                </Modal.Footer>
            </Modal>
        );
    }
};
