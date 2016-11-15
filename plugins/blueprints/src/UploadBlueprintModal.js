/**
 * Created by kinneretzin on 05/10/2016.
 */

export default (pluginUtils)=> {

    return class extends React.Component {

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
            pluginUtils.jQuery('#blueprintFile').click();
            return false;
        }

        _uploadFileChanged(e){
            var fullPathFileName = pluginUtils.jQuery(e.currentTarget).val();
            var filename = fullPathFileName.split('\\').pop();

            pluginUtils.jQuery('input.uploadBlueprintFile').val(filename).attr('title',fullPathFileName);
        }

        _submitUpload(e) {
            e.preventDefault();

            var thi$ = this;

            var formObj = pluginUtils.jQuery(e.currentTarget);

            // Clear errors
            formObj.find('.error:not(.message)').removeClass('error');
            formObj.find('.ui.error.message').hide();

            // Get the data
            var blueprintName = formObj.find("input[name='blueprintName']").val();
            var blueprintFileName = formObj.find("input[name='blueprintFileName']").val();
            var blueprintFileUrl = formObj.find("input[name='blueprintFileUrl']").val();
            var file = document.getElementById('blueprintFile').files[0];

            // Check that we have all we need
            if (_.isEmpty(blueprintFileUrl) && !file) {
                formObj.addClass('error');
                formObj.find("input.uploadBlueprintFile").parents('.field').addClass('error');
                formObj.find("input[name='blueprintFileUrl']").parents('.field').addClass('error');
                formObj.find('.ui.error.message').show();

                return false;
            }

            if (_.isEmpty(blueprintName)) {
                formObj.addClass('error');
                formObj.find("input[name='blueprintName']").parents('.field').addClass('error');
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

            xhr.open('put',this.props.context.getManagerUrl(`/api/v2.1/blueprints/${blueprintName}` + (!_.isEmpty(blueprintFileName) ? '?application_file_name='+blueprintFileName+'.yaml' : '')));
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
                    <button className="ui labeled icon button uploadBlueprint" onClick={this._showModal.bind(this)}>
                        <i className="upload icon"></i>
                        Upload
                    </button>

                    <Modal show={this.state.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                        <Header>
                            <i className="upload icon"></i> Upload blueprint
                        </Header>

                        <Body>
                            <form className="ui form uploadForm" onSubmit={this._submitUpload.bind(this)} action="">
                                <div className="fields">
                                    <div className="field nine wide">
                                        <div className="ui labeled input">
                                            <div className="ui label">
                                                http://
                                            </div>
                                            <input type="text" name='blueprintFileUrl' placeholder="Enter blueprint url"></input>
                                        </div>
                                    </div>

                                    <div className="field one wide" style={{"position":"relative"}}>
                                        <div className="ui vertical divider">
                                            Or
                                        </div>
                                    </div>
                                    <div className="field eight wide">
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
                            <div className="ui ok green button">
                                <i className="upload icon"></i>
                                Upload
                            </div>
                        </Footer>
                    </Modal>
                </div>
            );
        }
    };
};
