/**
 * Created by jakubniezgoda on 28/02/2017.
 */

export default class BlueprintActionButtons extends React.Component {

    static DEPLOY_ACTION = 'deploy';
    static DELETE_ACTION = 'delete';

    static EMPTY_BLUEPRINT = {id: ''};

    constructor(props,context) {
        super(props,context);

        this.state = {
            showModal: false,
            modalType: '',
            blueprint: BlueprintActionButtons.EMPTY_BLUEPRINT,
            loading: false,
            error: null
        }
    }

    _showModal(type) {
        this.setState({modalType: type, showModal: true});
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    _isShowModal(type) {
        return this.state.modalType === type && this.state.showModal;
    }

    _showDeployBlueprintModal() {
        this.setState({loading: true});
        let actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doGetFullBlueprintDataById(this.props.blueprintId).then((blueprint) => {
            this.setState({loading: false, error: null, blueprint});
            this._showModal(BlueprintActionButtons.DEPLOY_ACTION);
        }).catch((err) => {
            this.setState({loading: false, blueprint: BlueprintActionButtons.EMPTY_BLUEPRINT, error: err.message});
        });
    }

    _deleteBlueprint() {
        this.setState({loading: true});
        let actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doDeleteById(this.props.blueprintId).then(()=> {
            this.props.toolbox.getEventBus().trigger('blueprints:refresh');
            this.setState({loading: false, error: null});
            this._hideModal();
        }).catch((err)=>{
            this.setState({loading: false, error: err.message});
            this._hideModal();
        });
        return false;
    }

    render() {
        let {ErrorMessage, Button, Confirm} = Stage.Basic;
        let {DeployBlueprintModal} = Stage.Common;

        let blueprintId = this.props.blueprintId;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Button className="labeled icon" color="teal" icon="rocket" disabled={!blueprintId} loading={this.state.loading}
                        onClick={this._showDeployBlueprintModal.bind(this)}
                        content="Create deployment"/>

                <Button className="labeled icon" color="teal" icon="trash" disabled={!blueprintId} loading={this.state.loading}
                        onClick={this._showModal.bind(this, BlueprintActionButtons.DELETE_ACTION)}
                        content="Delete blueprint"/>

                <DeployBlueprintModal show={this._isShowModal(BlueprintActionButtons.DEPLOY_ACTION)}
                                      blueprint={this.state.blueprint}
                                      onHide={this._hideModal.bind(this)}
                                      toolbox={this.props.toolbox}/>

                <Confirm title={`Are you sure you want to remove blueprint ${blueprintId}?`}
                         show={this._isShowModal(BlueprintActionButtons.DELETE_ACTION)}
                         onConfirm={this._deleteBlueprint.bind(this, blueprintId)}
                         onCancel={this._hideModal.bind(this)} />

            </div>
        );
    }
}