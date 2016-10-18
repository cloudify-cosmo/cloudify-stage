/**
 * Created by kinneretzin on 05/10/2016.
 */

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null
        }
    }

    onApprove () {
        $(this.refs.submitDeployBtn).click();
        return false;
    }

    _deploy() {
        var deployItem = this.props.context.getValue(this.props.widget.id + 'createDeploy');

        if (!deployItem) {
            this.setState({error: 'Blueprint not selected'});
            return false;
        }

        var blueprintId = deployItem.id;
        var deploymentId = $('[name=deploymentName]').val();

        var inputs = {};

        $('[name=deploymentInput]').each((index,input)=>{
            var input = $(input);
            inputs[input.data('name')] = input.val();
        });

        var thi$ = this;
        $.ajax({
            url: thi$.props.context.getManagerUrl() + '/api/v2.1/deployments/'+deploymentId,
            //dataType: 'json',
            "headers": {"content-type": "application/json"},
            method: 'put',
            data: JSON.stringify({
                'blueprint_id': blueprintId,
                inputs: inputs
            })
        })
            .done((deployment)=> {
                thi$.props.context.setValue(this.props.widget.id + 'createDeploy',null);

                thi$.props.context.getEventBus().trigger('deployment:refresh');

            })
            .fail((jqXHR, textStatus, errorThrown)=>{
                thi$.setState({error: (jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown)})
            });


        return false;
    }

    onDeny () {
        this.props.context.setValue(this.props.widget.id + 'createDeploy',null);
        return true;
    }

    _submitDeploy (e) {
        e.preventDefault();

        this._deploy();

        return false;
    }
    render() {
        var Modal = Stage.Basic.Modal;
        var Header = Stage.Basic.ModalHeader;
        var Body = Stage.Basic.ModalBody;
        var Footer = Stage.Basic.ModalFooter;

        var deployItem = this.props.context.getValue(this.props.widget.id + 'createDeploy');
        var shouldShow = !_.isEmpty(deployItem);
        deployItem = Object.assign({},{
                id: '',
                plan: {
                    inputs: {}
                }
            },
            deployItem
        );
        return (
            <div>
                <Modal show={shouldShow} className='deploymentModal' onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)}>
                    <Header>
                        <i className="rocket icon"></i> Deploy blueprint {deployItem.id}
                    </Header>

                    <Body>
                    <form className="ui form deployForm" onSubmit={this._submitDeploy.bind(this)} action="">
                        <div className="field">
                            <input type="text" required name='deploymentName' placeholder="Deployment name"/>
                        </div>

                        {
                            _.map(deployItem.plan.inputs,(input,name)=>{
                                return (
                                    <div className="field" key={name}>
                                        <label title={input.description || name }>{name}</label>
                                        <input name='deploymentInput' data-name={name} type="text" defaultValue={input.default}/>
                                    </div>
                                );
                            })
                        }

                        {
                            this.state.error ?
                                <div className="ui error message deployFailed" style={{"display":"block"}}>
                                    <div className="header">Error deploying blueprint</div>
                                    <p>{this.state.error}</p>
                                </div>
                                :
                                ''
                        }
                        <input type='submit' style={{"display": "none"}} ref='submitDeployBtn'/>
                    </form>
                    </Body>

                    <Footer>
                        <div className="ui cancel basic button">
                            <i className="remove icon"></i>
                            Cancel
                        </div>
                        <div className="ui ok green  button">
                            <i className="rocket icon"></i>
                            Deploy
                        </div>
                    </Footer>
                </Modal>
            </div>

        );
    }
};
