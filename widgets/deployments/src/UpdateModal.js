/**
 * Created by pposel on 18/01/2017.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class UpdateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null,
            loading: false,
            defaultWorkflow: true,
            installWorkflow: true,
            uninstallWorkflow: true,
            blueprintFileName: "",
            inputsFileName: "",
        }
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        show: PropTypes.bool.isRequired,
        deployment: PropTypes.object.isRequired,
        onHide: PropTypes.func.isRequired
    };

    onApprove () {
        $(this.refs.submitUpdateBtn).click();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    componentWillUpdate(prevProps, prevState) {
        //same Modal instance is used multiple time so we need to reset states
        if (this.props.show && prevProps.show != this.props.show) {
            this.setState({error:null, loading:false, defaultWorkflow:true,
                           installWorkflow:true, uninstallWorkflow:true,
                           inputsFileName: "", blueprintFileName: ""});
            $("form input:text").val("");
            $("form input:file").val("");
        }
    }

    _openFileSelection(e, selector) {
        e.preventDefault();
        $(selector).click();
        return false;
    }

    _blueprintFileChanged(e){
        var fullPathFileName = $(e.currentTarget).val();
        if (!fullPathFileName) {
            return;
        }

        $('.updateDeploymentModal #blueprintFile').attr('title', fullPathFileName);
        var filename = fullPathFileName.split('\\').pop();
        this.setState({blueprintFileName:filename});
    }

    _inputsFileChanged(e){
        var fullPathFileName = $(e.currentTarget).val();
        if (!fullPathFileName) {
            return;
        }

        $('.updateDeploymentModal #nputsFile').attr('title', fullPathFileName);
        var filename = fullPathFileName.split('\\').pop();
        this.setState({inputsFileName:filename});
    }

    _submitUpload(e) {
        e.preventDefault();

        var formObj = $(e.currentTarget);

        // Get the data
        var applicationFileName = formObj.find("#applicationFileName").val();
        var blueprintUrl = formObj.find("#blueprintUrl").val();
        var blueprintFile = document.getElementById('blueprintFile').files[0];
        var inputsFile = document.getElementById('inputsFile').files[0];
        var workflowId = formObj.find("#workflowId").val();

        if (_.isEmpty(blueprintUrl) && !blueprintFile) {
            this.setState({error: Stage.Basic.ErrorMessage.error("Please select blueprint file or url", "Missing data")});
            return false;
        }

        if (!this.state.defaultWorkflow && _.isEmpty(workflowId)) {
            this.setState({error: Stage.Basic.ErrorMessage.error("Please provide Workflow ID", "Missing data")});
            return false;
        }

            // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doUpdate(this.props.deployment.id, applicationFileName, blueprintUrl,
                         this.state.defaultWorkflow, this.state.installWorkflow,
                         this.state.uninstallWorkflow, workflowId, blueprintFile, inputsFile).then(()=>{
            this.setState({loading: false});
            this.props.toolbox.refresh();
            this.props.onHide();
        }).catch((err)=>{
            this.setState({error: err.error, loading: false});
        });

        return false;
    }

    render() {
        var Modal = Stage.Basic.Modal;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <Modal className="updateDeploymentModal" show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                <Modal.Header>
                    <i className="edit icon"></i> Update deployment {this.props.deployment.id}
                </Modal.Header>

                <Modal.Body>
                    <form className="ui form updateForm" onSubmit={this._submitUpload.bind(this)} action="">
                        <div className="fields">
                            <div className="field nine wide">
                                <div className="ui labeled input">
                                    <div className="ui label">
                                        http://
                                    </div>
                                    <input type="text" id="blueprintUrl" placeholder="Enter new blueprint url"></input>
                                </div>
                            </div>

                            <div className="field one wide" style={{"position":"relative"}}>
                                <div className="ui vertical divider">
                                    Or
                                </div>
                            </div>
                            <div className="field eight wide">
                                <div className="ui action input">
                                    <input type="text" readOnly='true' value={this.state.blueprintFileName} id="blueprintFileName"
                                           placeholder="Select new blueprint file" onClick={(e)=>this._openFileSelection(e, '#blueprintFile')}></input>
                                    <button className="ui icon button" onClick={(e)=>this._openFileSelection(e, '#blueprintFile')}>
                                        <i className="attach icon"></i>
                                    </button>
                                </div>
                                <input type="file" id="blueprintFile" style={{"display": "none"}} onChange={this._blueprintFileChanged.bind(this)}/>
                            </div>
                        </div>

                        <div className="field">
                            <div className="ui action input">
                                <input type="text" readOnly='true' value={this.state.inputsFileName} id="inputsFileName"
                                       placeholder="Select inputs file" onClick={(e)=>this._openFileSelection(e, '#inputsFile')}></input>
                                <button className="ui icon button" onClick={(e)=>this._openFileSelection(e, '#inputsFile')}>
                                    <i className="attach icon"></i>
                                </button>
                            </div>
                            <input type="file" id="inputsFile" style={{"display": "none"}} onChange={this._inputsFileChanged.bind(this)}/>
                        </div>

                        <div className="field">
                            <input type="text" id='applicationFileName' required placeholder="Blueprint filename e.g. blueprint"/>
                        </div>

                        <h4 className="ui dividing header">
                            <div className='ui radio checkbox'
                                 ref={(radio)=>$(radio).checkbox({onChecked:()=>this.setState({defaultWorkflow:true})})}>
                                <label>Run default workflow</label>
                                <input type="radio" name="runWorkflow" className="hidden" checked={this.state.defaultWorkflow} onChange={()=>{}}/>
                            </div>
                        </h4>

                        <div className="field">
                            <div className={`ui checkbox ${this.state.defaultWorkflow?'':'disabled'}`}
                                 ref={(checkbox)=>$(checkbox).checkbox({onChange:()=>this.setState({installWorkflow: $(checkbox).checkbox("is checked")})})}>
                                <input type="checkbox" className="hidden" checked={this.state.installWorkflow} onChange={()=>{}}/>
                                <label>Run install workflow on added nodes</label>
                            </div>
                        </div>

                        <div className="field">
                            <div className={`ui checkbox ${this.state.defaultWorkflow?'':'disabled'}`}
                                 ref={(checkbox)=>$(checkbox).checkbox({onChange:()=>this.setState({uninstallWorkflow: $(checkbox).checkbox("is checked")})})}>
                                <input type="checkbox" className="hidden" checked={this.state.uninstallWorkflow} onChange={()=>{}}/>
                                <label>Run uninstall workflow on removed nodes</label>
                            </div>
                        </div>

                        <h4 className="ui dividing header">
                            <div className='ui radio checkbox'
                                 ref={(radio)=>$(radio).checkbox({onChecked:()=>this.setState({defaultWorkflow:false})})}>
                                <label>Run custom workflow</label>
                                <input type="radio" name="runWorkflow" className="hidden" checked={!this.state.defaultWorkflow} onChange={()=>{}}/>
                            </div>
                        </h4>

                        <div className={`field ${this.state.defaultWorkflow?'disabled':''}`}>
                            <input type="text" id='workflowId' placeholder="Workflow ID"/>
                        </div>

                        <ErrorMessage error={this.state.error}/>

                        <input type='submit' style={{"display": "none"}} ref='submitUpdateBtn'/>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Cancel/>
                    <Modal.Approve label="Update" icon="edit" className="green"/>
                </Modal.Footer>
            </Modal>
        );
    }
};
