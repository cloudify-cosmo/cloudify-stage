/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null,
            loading: false
        }
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

    componentWillUpdate(prevProps, prevState) {
        //same Modal instance is used multiple time so we need to reset states
        if (this.props.show && prevProps.show != this.props.show) {
            this.setState({error: null, loading: false});
            $("form input:text").val("");
        }
    }

    onApprove () {
        $(this.refs.submitDeployBtn).click();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    _submitDeploy (e) {
        e.preventDefault();

        if (!this.props.blueprint) {
            this.setState({error: Stage.Basic.ErrorMessage.error("Blueprint not selected", "Missing data")});
            return false;
        }

        var deploymentId = $('[name=deploymentName]').val();

        var inputs = {};

        $('[name=deploymentInput]').each((index,input)=>{
            var input = $(input);
            inputs[input.data('name')] = input.val();
        });

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doDeploy(this.props.blueprint, deploymentId, inputs)
            .then((/*deployment*/)=> {
                this.setState({loading: false});
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
                this.props.onHide();
            })
            .catch((err)=>{
                this.setState({loading: false, error: err.message});
            });

        return false;
    }
    render() {
        var Modal = Stage.Basic.Modal;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        var blueprint = Object.assign({},{id: '', plan: {inputs: {}}}, this.props.blueprint);

        return (
            <div>
                <Modal show={this.props.show} className='deploymentModal' onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Modal.Header>
                        <i className="rocket icon"></i> Deploy blueprint {blueprint.id}
                    </Modal.Header>

                    <Modal.Body>
                        <form className="ui form deployForm" onSubmit={this._submitDeploy.bind(this)} action="">
                            <div className="field">
                                <input type="text" required name='deploymentName' placeholder="Deployment name"/>
                            </div>

                            {
                                blueprint.id
                                &&
                                <h4 className="ui dividing header">Deployment inputs</h4>
                            }

                            {
                                blueprint.id && _.isEmpty(blueprint.plan.inputs)
                                &&
                                <div className="ui visible message">
                                    <p>No inputs available for the blueprint</p>
                                </div>
                            }

                            {
                                _.map(blueprint.plan.inputs, (input, name) => {
                                    return (
                                        <div className="field" key={name}>
                                            <label title={input.description || name }>{name}</label>
                                            <input name='deploymentInput' data-name={name} type="text"
                                                   defaultValue={input.default}/>
                                        </div>
                                    );
                                })
                            }

                            <ErrorMessage error={this.state.error}/>

                            <input type='submit' style={{"display": "none"}} ref='submitDeployBtn'/>
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Cancel/>
                        <Modal.Approve label="Deploy" icon="rocket" className="green"/>
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
};
