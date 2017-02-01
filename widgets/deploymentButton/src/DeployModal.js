/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

const EMPTY_BLUEPRINT = {id: '', plan: {inputs: {}}};

export default class DeployModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = DeployModal.initialState;
    }

    static initialState = {
        errors: {},
        loading: false,
        blueprint: EMPTY_BLUEPRINT,
        deploymentName: ""
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        show: PropTypes.bool.isRequired,
        blueprints: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState(DeployModal.initialState);
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

    _selectBlueprint(proxy, data){
        if (!_.isEmpty(data.value)) {
            this.setState({loading: true});

            var actions = new Actions(this.props.toolbox);
            actions.doGetFullBlueprintData(data.value).then((blueprint)=>{
                this.setState({blueprint, errors: {}, loading: false});
            }).catch((err)=> {
                this.setState({blueprint: EMPTY_BLUEPRINT, loading: false, errors: {error: err.message}});
            });
        } else {
            this.setState({blueprint: EMPTY_BLUEPRINT, errors: {}});
        }
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    _submitDeploy () {
        let errors = {};

        if (_.isEmpty(this.state.deploymentName)) {
            errors["deploymentName"]="Please provide deployment name";
        }

        if (_.isEmpty(this.state.blueprint.id)) {
            errors["blueprintName"]="Please select blueprint from the list";
        }

        var inputs = {};

        $('[name=deploymentInput]').each((index,input)=>{
            var input = $(input);
            inputs[input.data('name')] = input.val();
        });

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doDeploy(this.state.blueprint.id, this.state.deploymentName, inputs)
            .then((/*deployment*/)=> {
                this.setState({loading: false});
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.onHide();
            })
            .catch((err)=>{
                this.setState({loading: false, errors: {error: err.message}});
            });
    }

    render() {
        var {Modal, Icon, Form, Message} = Stage.Basic;

        let blueprints = Object.assign({},{items:[]}, this.props.blueprints);
        let options = _.map(blueprints.items, blueprint => { return { text: blueprint.id, value: blueprint.id } });

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                <Modal.Header>
                    <Icon name="rocket"/> Create new deployment
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this._submitDeploy.bind(this)} errors={this.state.errors} ref="deployForm">

                        <Form.Field error={this.state.errors.deploymentName}>
                            <Form.Input name='deploymentName' placeholder="Deployment name"
                                        value={this.state.deploymentName} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.blueprintName}>
                            <Form.Dropdown search selection value={this.state.blueprint.id} placeholder="Select Blueprint"
                                           name="blueprintName" options={options} onChange={this._selectBlueprint.bind(this)}/>
                        </Form.Field>

                        {
                            this.state.blueprint.id
                            &&
                            <Form.Divider>Deployment inputs</Form.Divider>
                        }

                        {
                            this.state.blueprint.id && _.isEmpty(this.state.blueprint.plan.inputs)
                            &&
                            <Message content="No inputs available for the selected blueprint"/>
                        }

                        {
                            _.map(this.state.blueprint.plan.inputs, (input, name) => {
                                return (
                                    <Form.Field key={name}>
                                        <label title={input.description || name }>{name}</label>
                                        <input name='deploymentInput' data-name={name} type="text"
                                               defaultValue={input.default}/>
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
