/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions.js';

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
        $('#pluginFile').click();
        return false;
    }

    _uploadFileChanged(e){
        var fullPathFileName = $(e.currentTarget).val();
        var filename = fullPathFileName.split('\\').pop();

        $('input.uploadPluginFile').val(filename).attr('title',fullPathFileName);
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
        var pluginFileUrl = formObj.find("input[name='pluginFileUrl']").val();
        var file = document.getElementById('pluginFile').files[0];

        // Check that we have all we need
        if (_.isEmpty(pluginFileUrl) && !file) {
            this.setState({error: Stage.Basic.ErrorMessage.error("Please fill in all the required fields", "Missing data")});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doUpload(file)
            .then(()=>{
                this.setState({loading: false, show: false});
                this.props.toolbox.refresh();
            })
            .catch(err=>{
                this.setState({error: err.message, loading: false});
            });

        return false;
    }

    render() {
        var Modal = Stage.Basic.Modal;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <button className="ui labeled icon button uploadPlugin" onClick={this._showModal.bind(this)}>
                    <i className="upload icon"></i>
                    Upload
                </button>

                <Modal show={this.state.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Modal.Header>
                        <i className="upload icon"></i> Upload plugin
                    </Modal.Header>

                    <Modal.Body>
                        <form className="ui form uploadForm" onSubmit={this._submitUpload.bind(this)} action="">
                            <div className="fields">
                                <div className="field nine wide">
                                    <div className="ui labeled input">
                                        <div className="ui label">
                                            http://
                                        </div>
                                        <input type="text" name='pluginFileUrl' placeholder="Enter plugin url"></input>
                                    </div>
                                </div>

                                <div className="field one wide" style={{"position":"relative"}}>
                                    <div className="ui vertical divider">
                                        Or
                                    </div>
                                </div>
                                <div className="field eight wide">
                                    <div className="ui action input">
                                        <input type="text" readOnly='true' value="" className="uploadPluginFile" onClick={this._openFileSelection}></input>
                                        <button className="ui icon button uploadPluginFile" onClick={this._openFileSelection}>
                                            <i className="attach icon"></i>
                                        </button>
                                    </div>
                                    <input type="file" name='pluginFile' id="pluginFile" style={{"display": "none"}} onChange={this._uploadFileChanged}/>
                                </div>
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
