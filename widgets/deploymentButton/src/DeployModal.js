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
            loading: false,
            blueprint: this._emptyBlueprint()
        }
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

    _emptyBlueprint() {
        return {
            id: '',
            plan: {
                inputs: {}
            }
        }
    }

    componentWillUpdate(prevProps, prevState) {
        //same Modal instance is used multiple time so we need to reset states
        if (this.props.show && prevProps.show != this.props.show) {
            this.setState({error: null, loading: false, blueprint: {id: '', plan: {inputs: {}}}});
            $("form input:text").val("");
            $("form input:hidden").val("");
        }
    }

    onApprove () {
        $(this.refs.submitDeployBtn).click();
        return false;
    }

    _selectBlueprint(blueprintId){
        if (!_.isEmpty(blueprintId)) {
            this.setState({loading: true});

            var actions = new Actions(this.props.toolbox);
            actions.doGetFullBlueprintData(blueprintId).then((blueprint)=>{
                this.setState({blueprint, error: null, loading: false});
            }).catch((err)=> {
                this.setState({blueprint: this._emptyBlueprint(), loading: false, error: err.message});
            });
        } else {
            this.setState({blueprint: this._emptyBlueprint(), error: null});
        }
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    _submitDeploy (e) {
        e.preventDefault();

        var formObj = $(e.currentTarget);

        var deploymentId = formObj.find("input[name=deploymentName]").val();
        var blueprintId = formObj.find("input[name=blueprintId]").val();

        if (_.isEmpty(blueprintId)) {
            this.setState({error: Stage.Basic.ErrorMessage.error("Please select blueprint from the list", "Missing data")});
            return false;
        }

        var inputs = {};

        $('[name=deploymentInput]').each((index,input)=>{
            var input = $(input);
            inputs[input.data('name')] = input.val();
        });

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doDeploy(blueprintId,deploymentId,inputs)
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

        var blueprints = Object.assign({},{items:[]}, this.props.blueprints);

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                <Modal.Header>
                    <i className="rocket icon"></i> Create new deployment
                </Modal.Header>

                <Modal.Body>
                    <form className="ui form deployForm" onSubmit={this._submitDeploy.bind(this)} action="">
                        <div className="field">
                            <input type="text" required name='deploymentName' placeholder="Deployment name"/>
                        </div>

                        <div className="field">
                            <div className="ui search selection dropdown" ref={(select)=>$(select).dropdown({onChange: this._selectBlueprint.bind(this)})}>
                                <input type="hidden" name="blueprintId" value={this.state.blueprint.id}/>
                                <i className="dropdown icon"></i>
                                <div className="default text">Select Blueprint</div>
                                <div className="menu">
                                    <div className='item' data-value="">Select Blueprint</div>
                                    {
                                        blueprints.items.map((blueprint)=>{
                                            return <div key={blueprint.id} className="item" data-value={blueprint.id}>{blueprint.id}</div>;
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                        {
                            this.state.blueprint.id
                            &&
                            <h4 className="ui dividing header">Deployment inputs</h4>
                        }

                        {
                            this.state.blueprint.id && _.isEmpty(this.state.blueprint.plan.inputs)
                            &&
                            <div className="ui visible message">
                                <p>No inputs available for the selected blueprint</p>
                            </div>
                        }

                        {
                            _.map(this.state.blueprint.plan.inputs, (input, name) => {
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
        );
    }
};
