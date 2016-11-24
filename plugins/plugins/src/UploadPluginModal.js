/**
 * Created by kinneretzin on 05/10/2016.
 */

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            uploadErr: null,
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

    _submitUpload(e) {
        e.preventDefault();

        var thi$ = this;

        var formObj = $(e.currentTarget);

        // Clear errors
        formObj.find('.error:not(.message)').removeClass('error');
        formObj.find('.ui.error.message').hide();

        // Get the data
        var pluginFileUrl = formObj.find("input[name='pluginFileUrl']").val();
        var file = document.getElementById('pluginFile').files[0];

        // Check that we have all we need
        if (_.isEmpty(pluginFileUrl) && !file) {
            formObj.addClass('error');
            formObj.find("input.uploadPluginFile").parents('.field').addClass('error');
            formObj.find("input[name='pluginFileUrl']").parents('.field').addClass('error');
            formObj.find('.ui.error.message').show();

            return false;
        }

        // Disable the form
        this.setState({loading: true});

        // Call upload method
        var xhr = new XMLHttpRequest();
        (xhr.upload || xhr).addEventListener('progress', function(e) {
            var done = e.position || e.loaded
            var total = e.totalSize || e.total;
            console.log('xhr progress: ' + Math.round(done/total*100) + '%');
        });
        xhr.addEventListener("error", function(e){
            console.log('xhr upload error', e, this.responseText);
            thi$._processUploadErrIfNeeded(this);
            thi$.setState({loading: false});
        });
        xhr.addEventListener('load', function(e) {
            console.log('xhr upload complete', e, this.responseText);
            thi$.setState({loading: false});

            if (!thi$._processUploadErrIfNeeded(this)) {
                thi$.setState({show: false});
                thi$.props.context.refresh();
            } else {
                formObj.find('.ui.error.message.uploadFailed').show();
            }
        });

        xhr.open('post',this.props.context.getManagerUrl('/api/v2.1/plugins'));
        var securityHeaders = this.props.context.getSecurityHeaders();
        if (securityHeaders) {
            xhr.setRequestHeader("Authentication-Token", securityHeaders["Authentication-Token"]);
        }

        xhr.send(file);

        return false;
    }

    _processUploadErrIfNeeded(xhr) {
        try {
            var response = JSON.parse(xhr.responseText);
            if (response.message) {
                this.setState({uploadErr: response.message});
                return true;
            }
        } catch (err) {
            console.err('Cannot parse upload response',err);
            return false;
        }
    }
    render() {
        var Modal = Stage.Basic.Modal;
        var Header = Stage.Basic.ModalHeader;
        var Body = Stage.Basic.ModalBody;
        var Footer = Stage.Basic.ModalFooter;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <button className="ui labeled icon button uploadPlugin" onClick={this._showModal.bind(this)}>
                    <i className="upload icon"></i>
                    Upload
                </button>

                <Modal show={this.state.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Header>
                        <i className="upload icon"></i> Upload plugin
                    </Header>

                    <Body>
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

                            <ErrorMessage error="Please fill in all the required fields" header="Missing data" show={false}/>

                            <ErrorMessage error={this.state.uploadErr} header="Error uploading file" className="uploadFailed"/>

                            <input type='submit' style={{"display": "none"}} ref='submitUploadBtn'/>
                        </form>
                    </Body>

                    <Footer>
                        <div className="ui cancel basic button">
                            <i className="remove icon"></i>
                            Cancel
                        </div>
                        <div className="ui ok green  button">
                            <i className="upload icon"></i>
                            Upload
                        </div>
                    </Footer>
                </Modal>
            </div>

        );
    }
};
