/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null,
            loading: false
        }
    }

    onApprove () {
        $(this.refs.submitDeployBtn).click();
        return false;
    }

    _deploy() {
        var deployItem = this.props.toolbox.getContext().getValue(this.props.widget.id + 'createDeploy');

        if (!deployItem) {
            this.setState({error: 'Blueprint not selected'});
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
        actions.doDeploy(deployItem,deploymentId,inputs)
            .then((/*deployment*/)=> {
                this.setState({loading: false});
                this.props.toolbox.getContext().setValue(this.props.widget.id + 'createDeploy',null);
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
            })
            .catch((err)=>{
                this.setState({loading: false, error: err.error});
            });

        return false;
    }

    onDeny () {
        this.props.toolbox.getContext().setValue(this.props.widget.id + 'createDeploy',null);
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
        var ErrorMessage = Stage.Basic.ErrorMessage;

        var deployItem = this.props.toolbox.getContext().getValue(this.props.widget.id + 'createDeploy');
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
                <Modal show={shouldShow} className='deploymentModal' onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
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

                        <ErrorMessage error={this.state.error} header="Error deploying blueprint" className="deployFailed"/>

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
