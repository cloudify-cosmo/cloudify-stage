/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions.js';

export default (pluginUtils)=> {

    return class extends React.Component {

        constructor(props,context) {
            super(props,context);

            this.state = {
                uploadErr: null
            }
        }

        componentDidMount() {
            this._initModal(this.refs.modalObj);
        }
        componentDidUpdate() {
            pluginUtils.jQuery(this.refs.modalObj).modal('refresh');
        }
        componentWillUnmount() {
            pluginUtils.jQuery(this.refs.modalObj).modal('destroy');
            pluginUtils.jQuery(this.refs.modalObj).remove();
        }

        _initModal(modalObj) {
            pluginUtils.jQuery(modalObj).modal({
                closable  : false,
                onDeny    : function(){
                    //window.alert('Wait not yet!');
                    //return false;
                },
                onApprove : function() {
                    pluginUtils.jQuery('.uploadFormSubmitBtn').click();
                    return false;
                }
            });

        }

        _showModal() {
            pluginUtils.jQuery('.uploadPluginModal').modal('show');
        }

        _openFileSelection(e) {
            e.preventDefault();
            pluginUtils.jQuery('#pluginFile').click();
            return false;
        }

        _uploadFileChanged(e){
            var fullPathFileName = pluginUtils.jQuery(e.currentTarget).val();
            var filename = fullPathFileName.split('\\').pop();

            pluginUtils.jQuery('input.uploadPluginFile').val(filename).attr('title',fullPathFileName);

        }

        _submitUpload(e) {
            e.preventDefault();

            var thi$ = this;

            var formObj = pluginUtils.jQuery(e.currentTarget);

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

            // Disalbe the form
            formObj.parents('.modal').find('.actions .button').attr('disabled','disabled').addClass('disabled loading');
            formObj.addClass('loading');

            (new Actions(this.props.context)).doUpload(file)
                .then(()=>{
                    formObj.parents('.modal').find('.actions .button').removeAttr('disabled').removeClass('disabled loading');
                    formObj.removeClass('loading');

                    formObj.parents('.modal').modal('hide');
                    this.props.context.refresh();
                })
                .catch(err=>{
                    this.setState({uploadErr: err.error});
                    formObj.find('.ui.error.message.uploadFailed').show();
                    formObj.parents('.modal').find('.actions .button').removeAttr('disabled').removeClass('disabled loading');
                    formObj.removeClass('loading');

                });

            return false;
        }

        render() {
            var ErrorMessage = Stage.Basic.ErrorMessage;

            return (
                <div>
                    <button className="ui labeled icon button uploadPlugin" onClick={this._showModal}>
                        <i className="upload icon"></i>
                        Upload
                    </button>

                    <div className="ui modal uploadPluginModal" ref='modalObj'>
                        <div className="header">
                            <i className="upload icon"></i> Upload plugin
                        </div>

                        <div className="content">
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

                                <ErrorMessage error={this.state.uploadErr} header="Error uploading file" className="uploadFailed"/>

                                <input type='submit' style={{"display": "none"}} className='uploadFormSubmitBtn'/>
                            </form>
                        </div>

                        <div className="actions">
                            <div className="ui cancel basic button">
                                <i className="remove icon"></i>
                                Cancel
                            </div>
                            <div className="ui ok green  button">
                                <i className="upload icon"></i>
                                Upload
                            </div>
                        </div>
                    </div>
                </div>

            );
        }
    };
};
