/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null,
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
        $('#snapshotFile').click();
        return false;
    }

    _uploadFileChanged(e){
        var fullPathFileName = $(e.currentTarget).val();
        var filename = fullPathFileName.split('\\').pop();

        $('input.uploadSnapshotFile').val(filename).attr('title',fullPathFileName);
    }

    componentWillUpdate(prevProps, prevState) {
        //same Modal instance is used multiple time so we need to reset states
        if (this.state.show && prevState.show != this.state.show) {
            this.setState({error:null, loading:false});
            $("form input:text").val("");
            $("form input:file").val("");
        }
    }

    _submitUpload(e) {
        e.preventDefault();

        var formObj = $(e.currentTarget);

        // Get the data
        var snapshotId = formObj.find("input[name='snapshotId']").val();
        var snapshotFileUrl = formObj.find("input[name='snapshotFileUrl']").val();
        var file = document.getElementById('snapshotFile').files[0];

        // Check that we have all we need
        if (_.isEmpty(snapshotFileUrl) && !file) {
            this.setState({error: Stage.Basic.ErrorMessage.errot()});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doUpload(snapshotId,file)
            .then(()=>{
                this.setState({loading: false, show: false});
                this.props.toolbox.refresh();
            })
            .catch(err=>{
                this.setState({loading: false, uploadErr: err.message});
            });

        return false;
    }

    render() {
        var Modal = Stage.Basic.Modal;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <button className="ui labeled icon button uploadSnapshot" onClick={this._showModal.bind(this)}>
                    <i className="upload icon"></i>
                    Upload
                </button>

                <Modal show={this.state.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Modal.Header>
                        <i className="upload icon"></i> Upload snapshot
                    </Modal.Header>
                    <Modal.Body>
                        <form className="ui form uploadForm" onSubmit={this._submitUpload.bind(this)} action="">
                            <div className="fields">
                                <div className="field nine wide">
                                    <div className="ui labeled input">
                                        <div className="ui label">
                                            http://
                                        </div>
                                        <input type="text" name='snapshotFileUrl' placeholder="Enter snapshot url"></input>
                                    </div>
                                </div>

                                <div className="field one wide" style={{"position":"relative"}}>
                                    <div className="ui vertical divider">
                                        Or
                                    </div>
                                </div>
                                <div className="field eight wide">
                                    <div className="ui action input">
                                        <input type="text" readOnly='true' value="" className="uploadSnapshotFile" onClick={this._openFileSelection}></input>
                                        <button className="ui icon button uploadSnapshotFile" onClick={this._openFileSelection}>
                                            <i className="attach icon"></i>
                                        </button>
                                    </div>
                                    <input type="file" name='snapshotFile' id="snapshotFile" style={{"display": "none"}} onChange={this._uploadFileChanged}/>
                                </div>
                            </div>

                            <div className="field">
                                <input type="text" name='snapshotId' id='snapshotId' placeholder="Snapshot ID" required/>
                            </div>

                            <ErrorMessage error={this.state.error}/>

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
