/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            uploadErr: null,
            showErr: false,
            show: false,
            loading: false
        }
    }

    onApprove () {
        $(this.refs.submitUploadBtn).click();
        return false;
    }

    onDeny () {
        this.setState({show: false});
        return true;
    }

    _showModal() {
        this.setState({show: true});
    }

    _openFileSelection(e) {
        e.preventDefault();
        $('#blueprintFile').click();
        return false;
    }

    componentWillUpdate(prevProps, prevState) {
        //same Modal instance is used multiple time so we need to reset states
        if (this.state.show && prevState.show != this.state.show) {
            this.setState({showErr:false, uploadErr:null, loading:false});
            $("form input:text").val("");
            $("form input:file").val("");
        }
    }

    _uploadFileChanged(e){
        var fullPathFileName = $(e.currentTarget).val();
        var filename = fullPathFileName.split('\\').pop();

        $('input.uploadBlueprintFile').val(filename).attr('title',fullPathFileName);
    }

    _submitUpload(e) {
        e.preventDefault();

        var formObj = $(e.currentTarget);

        // Clear errors
        this.setState({showErr: false});

        // Get the data
        var blueprintName = formObj.find("input[name='blueprintName']").val();
        var blueprintFileName = formObj.find("input[name='blueprintFileName']").val();
        var blueprintFileUrl = formObj.find("input[name='blueprintFileUrl']").val();
        var file = document.getElementById('blueprintFile').files[0];

        // Check that we have all we need
        if (_.isEmpty(blueprintFileUrl) && !file) {
            this.setState({showErr: true});
            return false;
        }

        if (_.isEmpty(blueprintName)) {
            this.setState({showErr: true});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doUpload(blueprintName, blueprintFileName, file).then(()=>{
            this.setState({loading: false,show: false});
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({uploadErr: err.error, loading: false});
        });

        return false;
    }

    render() {
        var Modal = Stage.Basic.Modal;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <button className="ui labeled icon button uploadBlueprint" onClick={this._showModal.bind(this)}>
                    <i className="upload icon"></i>
                    Upload
                </button>

                <Modal show={this.state.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Modal.Header>
                        <i className="upload icon"></i> Upload blueprint
                    </Modal.Header>

                    <Modal.Body>
                        <form className={`ui form uploadForm ${this.state.showErr?"error":""}`} onSubmit={this._submitUpload.bind(this)} action="">
                            <div className="fields">
                                <div className={`field nine wide ${this.state.showErr?"error":""}`}>
                                    <div className="ui labeled input">
                                        <div className="ui label">
                                            http://
                                        </div>
                                        <input type="text" name="blueprintFileUrl" placeholder="Enter blueprint url"></input>
                                    </div>
                                </div>

                                <div className="field one wide" style={{"position":"relative"}}>
                                    <div className="ui vertical divider">
                                        Or
                                    </div>
                                </div>
                                <div className={`field eight wide ${this.state.showErr?"error":""}`}>
                                    <div className="ui action input">
                                        <input type="text" readOnly='true' value="" className="uploadBlueprintFile" onClick={this._openFileSelection}></input>
                                        <button className="ui icon button uploadBlueprintFile" onClick={this._openFileSelection}>
                                            <i className="attach icon"></i>
                                        </button>
                                    </div>
                                    <input type="file" name='blueprintFile' id="blueprintFile" style={{"display": "none"}} onChange={this._uploadFileChanged}/>
                                </div>
                            </div>

                            <div className="field">
                                <input type="text" name='blueprintName' id='blueprintName' placeholder="Blueprint name" required/>
                            </div>
                            <div className="field">
                                <input type="text" name='blueprintFileName' id='blueprintFileName' placeholder="Blueprint filename e.g. blueprint"/>
                            </div>

                            <ErrorMessage error="Please fill in all the required fields" header="Missing data" show={this.state.showErr}/>

                            <ErrorMessage error={this.state.uploadErr} header="Error uploading file" className="uploadFailed"/>

                            <input type='submit' style={{"display": "none"}} ref='submitUploadBtn'/>
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Cancel/>
                        <Modal.Approve label="Upload" icon="upload" className="green"/>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};
