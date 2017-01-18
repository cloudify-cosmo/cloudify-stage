/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

export default class extends React.Component {

    constructor(props,context) {
        super(props, context);

        this.state = {
            createErr: null,
            show: false,
            loading: false
        }
    }

    onApprove () {
        $(this.refs.submitCreateBtn).click();
        return false;
    }

    onDeny () {
        this.setState({show: false});
        return true;
    }

    _showModal() {
        this.setState({show: true});
    }

    _submitCreate(e) {
        e.preventDefault();

        var formObj = $(e.currentTarget);

        // Get the data
        var snapshotId = formObj.find("input[name='snapshotId']").val();

        // Disable the form
        this.setState({loading: true, createErr: null});

        // Call create method
        var actions = new Actions(this.props.toolbox);
        actions.doCreate(snapshotId)
            .then(()=>{
                this.props.toolbox.getContext().setValue(this.props.widget.id + 'createSnapshot',null);
                this.props.toolbox.getEventBus().trigger('snapshots:refresh');
                this.setState({loading: false, show: false});
            })
            .catch((err)=>{
                this.setState({loading: false, createErr: err.error});
            });

        return false;
    }

    render() {
        var Modal = Stage.Basic.Modal;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <button className="ui labeled icon button createSnapshot" onClick={this._showModal.bind(this)}>
                    <i className="add icon"></i>
                    Create
                </button>

                <Modal show={this.state.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Modal.Header>
                        <i className="add icon"></i> Create snapshot
                    </Modal.Header>
                    <Modal.Body>
                        <form className="ui form createForm" onSubmit={this._submitCreate.bind(this)} action="">
                            <div className="field">
                                <input type="text" name='snapshotId' id='snapshotId' placeholder="Snapshot ID" required/>
                            </div>

                            <ErrorMessage error={this.state.createErr} header="Error creating file" className="createFailed"/>

                            <input type='submit' style={{"display": "none"}} ref='submitCreateBtn'/>
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Cancel/>
                        <Modal.Approve label="Create" icon="add" className="green"/>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};
