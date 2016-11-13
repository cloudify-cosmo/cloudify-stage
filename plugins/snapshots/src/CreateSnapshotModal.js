/**
 * Created by kinneretzin on 05/10/2016.
 */

export default (snapshotUtils)=> {

    return class extends React.Component {

        constructor(props,context) {
            super(props,context);

            this.state = {
                createErr: null
            }
        }

        componentDidMount() {
            this._initModal(this.refs.modalObj);
        }
        componentDidUpdate() {
            snapshotUtils.jQuery(this.refs.modalObj).modal('refresh');
        }
        componentWillUnmount() {
            snapshotUtils.jQuery(this.refs.modalObj).modal('destroy');
            snapshotUtils.jQuery(this.refs.modalObj).remove();
        }

        _initModal(modalObj) {
            snapshotUtils.jQuery(modalObj).modal({
                closable  : false,
                onDeny    : function(){
                    //window.alert('Wait not yet!');
                    //return false;
                },
                onApprove : function() {
                    snapshotUtils.jQuery('.createFormSubmitBtn').click();
                    return false;
                }
            });

        }

        _showModal() {
            snapshotUtils.jQuery('.createSnapshotModal').modal('show');
        }

        _openFileSelection(e) {
            e.preventDefault();
            snapshotUtils.jQuery('#snapshotFile').click();
            return false;
        }

        _createFileChanged(e){
            var fullPathFileName = snapshotUtils.jQuery(e.currentTarget).val();
            var filename = fullPathFileName.split('\\').pop();

            snapshotUtils.jQuery('input.createSnapshotFile').val(filename).attr('title',fullPathFileName);

        }

        _submitCreate(e) {
            e.preventDefault();

            var thi$ = this;

            var formObj = snapshotUtils.jQuery(e.currentTarget);

            // Clear errors
            formObj.find('.error:not(.message)').removeClass('error');
            formObj.find('.ui.error.message').hide();

            // Get the data
            var snapshotId = formObj.find("input[name='snapshotId']").val();

            // Disalbe the form
            formObj.parents('.modal').find('.actions .button').attr('disabled','disabled').addClass('disabled loading');
            formObj.addClass('loading');

            // Call create method
        $.ajax({
            url: thi$.props.context.getManagerUrl(`/api/v2.1/snapshots/${snapshotId}`),
            //dataType: 'json',
            "headers": Object.assign({"content-type": "application/json"},thi$.props.context.getSecurityHeaders()),
            method: 'put',
            data: JSON.stringify({
                'snapshot_id': snapshotId
            })
        })
            .done((snapshot)=> {
                thi$.props.context.setValue(this.props.widget.id + 'createSnapshot',null);

                thi$.props.context.getEventBus().trigger('snapshots:refresh');

            })
            .fail((jqXHR, textStatus, errorThrown)=>{
                thi$.setState({error: (jqXHR.responseJSON && jqXHR.responseJSON.message ? jqXHR.responseJSON.message : errorThrown)})
            });

            formObj.parents('.modal').find('.actions .button').removeAttr('disabled').removeClass('disabled loading');
            formObj.removeClass('loading');

            return false;
        }

        _processCreateErrIfNeeded(xhr) {
            try {
                var response = JSON.parse(xhr.responseText);
                if (response.message) {
                    this.setState({createErr: response.message});
                    return true;
                }
            } catch (err) {
                console.err('Cannot parse create response',err);
                return false;
            }
        }
        render() {
            return (
                <div>
                    <button className="ui labeled icon button createSnapshot" onClick={this._showModal}>
                        <i className="add icon"></i>
                        Create
                    </button>

                    <div className="ui modal createSnapshotModal" ref='modalObj'>
                        <div className="header">
                            <i className="add icon"></i> Create snapshot
                        </div>
                        <div className="content">
                            <form className="ui form createForm" onSubmit={this._submitCreate.bind(this)} action="">
                                <div className="field">
                                    <input type="text" name='snapshotId' id='snapshotId' placeholder="Snapshot ID" required/>
                                </div>
                                {
                                    this.state.createErr ?
                                        <div className="ui error message createFailed" style={{"display":"block"}}>
                                            <div className="header">Error createing file</div>
                                            <p>{this.state.createErr}</p>
                                        </div>
                                        :
                                        ''
                                }

                                <input type='submit' style={{"display": "none"}} className='createFormSubmitBtn'/>
                            </form>
                        </div>

                        <div className="actions">
                            <div className="ui cancel basic button">
                                <i className="remove icon"></i>
                                Cancel
                            </div>
                            <div className="ui ok green  button">
                                <i className="add icon"></i>
                                Create
                            </div>
                        </div>
                    </div>
                </div>

            );
        }
    };
};
