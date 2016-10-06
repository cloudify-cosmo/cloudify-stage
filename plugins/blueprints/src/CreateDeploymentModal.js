/**
 * Created by kinneretzin on 05/10/2016.
 */

export default (pluginUtils)=> {

    return class extends React.Component {

        constructor(props,context) {
            super(props,context);

            this.state = {
                error: null
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
                    pluginUtils.jQuery('.submitBtn').click();
                    return false;
                }
            });

        }

        _showModal() {
            pluginUtils.jQuery('.uploadBlueprintModal').modal('show');
        }


        _submitHandler(e) {
            e.preventDefault();

            return false;
        }

        render() {
            return (
                <div>
                    <div className="ui modal deployBlueprintModal" ref='modalObj'>
                        <div className="header">
                            <i className="upload icon"></i> Deploy blueprint
                        </div>

                        <div className="content">
                            <form className="ui form deployForm" onSubmit={this._submitHandler.bind(this)} action="">
                                <div className="field">
                                    <input type="text" required name='blueprintName' id='blueprintName' placeholder="Blueprint name" required/>
                                </div>
                                <div className="field">
                                    <input type="text" name='blueprintFileName' id='blueprintFileName' placeholder="Blueprint filename e.g. blueprint"/>
                                </div>

                                <div className="ui error message" style={{"display":"none"}}>
                                    <div className="header">Missing data</div>
                                    <p>Please fill in all the required fields</p>
                                </div>
                                {
                                    this.state.uploadErr ?
                                        <div className="ui error message uploadFailed" style={{"display":"block"}}>
                                            <div className="header">Error uploading file</div>
                                            <p>{this.state.uploadErr}</p>
                                        </div>
                                        :
                                        ''
                                }

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
