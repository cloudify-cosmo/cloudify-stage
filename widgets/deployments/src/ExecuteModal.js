/**
 * Created by kinneretzin on 19/10/2016.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class ExecuteModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null
        }
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        show: PropTypes.bool.isRequired,
        deployment: PropTypes.object.isRequired,
        workflow: PropTypes.object.isRequired,
        onHide: PropTypes.func.isRequired
    };

    onApprove () {
        $(this.refs.submitExecuteBtn).click();
        return false;
    }

    _submitExecute (e) {
        e.preventDefault();

        if (!this.props.deployment || !this.props.workflow) {
            this.setState({error: 'Missing workflow or deployment'});
            return false;
        }

        var params = {};

        $(this.refs.executeForm).find('[name=executeInput]').each((index,input)=>{
            var input = $(input);
            params[input.data('name')] = input.val();
        });

        var actions = new Actions(this.props.toolbox);
        actions.doExecute(this.props.deployment, this.props.workflow, params).then(()=>{
            this.props.onHide();
            this.props.toolbox.getEventBus().trigger('executions:refresh');
        }).catch((err)=>{
            this.setState({error: err.message});
        })

        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    render() {
        var Modal = Stage.Basic.Modal;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        var workflow = Object.assign({},{name:"", parameters:[]}, this.props.workflow);

        return (
            <Modal show={this.props.show} className='executeModal' onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)}>
                <Modal.Header>
                    <i className="road icon"></i> Execute workflow {workflow.name}
                </Modal.Header>

                <Modal.Body>
                    <form className="ui form executeForm" onSubmit={this._submitExecute.bind(this)} action="" ref='executeForm'>
                        {
                            _.map(workflow.parameters,(parameter,name)=>{
                                return (
                                    <div className="field" key={name}>
                                        <label title={parameter.description || name }>{name}</label>
                                        <input name='executeInput' data-name={name} type="text" defaultValue={parameter.default}/>
                                    </div>
                                );
                            })
                        }

                        <ErrorMessage error={this.state.error}/>

                        <input type='submit' style={{"display": "none"}} ref='submitExecuteBtn'/>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Cancel/>
                    <Modal.Approve label="Execute" icon="rocket" className="green"/>
                </Modal.Footer>
            </Modal>
        );
    }
};
