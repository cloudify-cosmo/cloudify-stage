/**
 * Created by kinneretzin on 19/10/2016.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class ExecuteModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = ExecuteModal.initialState;
    }

    static initialState = {
        errors: {},
        loading: false
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        show: PropTypes.bool.isRequired,
        deployment: PropTypes.object.isRequired,
        workflow: PropTypes.object.isRequired,
        onHide: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState(ExecuteModal.initialState);
        }
    }

    onApprove () {
        this.refs.executeForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    _submitExecute () {
        if (!this.props.deployment || !this.props.workflow) {
            this.setState({errors: {error: 'Missing workflow or deployment'}});
            return false;
        }

        this.setState({loading: true});

        var params = {};

        $(this.refs.executeForm).find('[name=executeInput]').each((index,input)=>{
            var input = $(input);
            params[input.data('name')] = input.val();
        });

        var actions = new Actions(this.props.toolbox);
        actions.doExecute(this.props.deployment, this.props.workflow, params).then(()=>{
            this.setState({loading: false});
            this.props.onHide();
            this.props.toolbox.getEventBus().trigger('executions:refresh');
        }).catch((err)=>{
            this.setState({loading: false, errors: {error: err.message}});
        })
    }

    render() {
        var {Modal, Icon, Form, Message} = Stage.Basic;

        var workflow = Object.assign({},{name:"", parameters:[]}, this.props.workflow);

        return (
            <Modal show={this.props.show} loading={this.state.loading} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)}>
                <Modal.Header>
                    <Icon name="road"/> Execute workflow {workflow.name}
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this._submitExecute.bind(this)} errors={this.state.errors} ref="executeForm">
                        {
                            _.isEmpty(workflow.parameters)
                            &&
                            <Message content="No parameters available for the execution"/>
                        }

                        {
                            _.map(workflow.parameters,(parameter,name)=>{
                                return (
                                    <Form.Field key={name}>
                                        <label title={parameter.description || name }>{name}</label>
                                        <input name='executeInput' data-name={name} type="text" defaultValue={parameter.default}/>
                                    </Form.Field>
                                );
                            })
                        }
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Cancel/>
                    <Modal.Approve label="Execute" icon="rocket" className="green"/>
                </Modal.Footer>
            </Modal>
        );
    }
};
