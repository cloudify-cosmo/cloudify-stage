/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null
        }
    }

    onApprove () {
        $(this.refs.submitExecuteBtn).click();
        return false;
    }

    _execute() {
        if (!this.props.deployment || !this.props.workflow) {
            this.setState({error: 'Missing workflow or deployment'});
            return false;
        }

        var params = {};

        $(this.refs.executeForm).find('[name=executeInput]').each((index,input)=>{
            var input = $(input);
            params[input.data('name')] = input.val();
        });

        this.props.onExecute && this.props.onExecute(this.props.deployment,this.props.workflow,params);


        return false;
    }

    onDeny () {
        //this.props.context.setValue(this.props.widget.id + 'createDeploy',null);
        this.props.onCancel && this.props.onCancel();
        return true;
    }

    _submitExecute (e) {
        e.preventDefault();

        this._execute();

        return false;
    }


    render() {
        var Modal = Stage.Basic.Modal;
        var Header = Stage.Basic.ModalHeader;
        var Body = Stage.Basic.ModalBody;
        var Footer = Stage.Basic.ModalFooter;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <Modal show={this.props.show} className='executeModal' onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)}>
                <Header>
                    <i className="road icon"></i> Execute workflow {this.props.workflow ? this.props.workflow.name : ""}
                </Header>

                <Body>
                <form className="ui form executeForm" onSubmit={this._submitExecute.bind(this)} action="" ref='executeForm'>
                        {this.props.workflow &&
                            _.map(this.props.workflow.parameters,(parameter,name)=>{
                                return (
                                    <div className="field" key={name}>
                                        <label title={parameter.description || name }>{name}</label>
                                        <input name='executeInput' data-name={name} type="text" defaultValue={parameter.default}/>
                                    </div>
                                );
                            })
                        }

                        <ErrorMessage error={this.state.error} header="Error executing blueprint" className="executeFailed"/>

                        <input type='submit' style={{"display": "none"}} ref='submitExecuteBtn'/>
                    </form>
                </Body>

                <Footer>
                    <div className="ui cancel basic button">
                        <i className="remove icon"></i>
                        Cancel
                    </div>
                    <div className="ui ok green  button">
                        <i className="rocket icon"></i>
                        Execute
                    </div>
                </Footer>
            </Modal>
        );
    }
};
