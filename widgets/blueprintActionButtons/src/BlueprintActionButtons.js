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

    _deleteBlueprint() {
        this.props.toolbox.loading(true);
        let actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doDeleteById(this.props.blueprintId).then(()=> {
            this.props.toolbox.getEventBus().trigger('blueprints:refresh');
            this.setState({error: null});
            this._hideModal();
            this.props.toolbox.loading(false);
        }).catch((err)=>{
            this.setState({error: err.message});
            this._hideModal();
            this.props.toolbox.loading(false);
        });
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.blueprintId !== nextProps.blueprintId) {
            this.props.toolbox.loading(true);
            let actions = new Stage.Common.BlueprintActions(this.props.toolbox);
            actions.doGetFullBlueprintDataById(nextProps.blueprintId).then((blueprint) => {
                this.props.toolbox.loading(false);
                this.setState({error: null, blueprint});
            }).catch((err) => {
                this.props.toolbox.loading(false);
                this.setState({error: err.message, blueprint: BlueprintActionButtons.EMPTY_BLUEPRINT});
            });
        }
    }

    render() {
        let {ErrorMessage, Button, Confirm} = Stage.Basic;
        let {DeployBlueprintModal} = Stage.Common;

        let blueprintId = this.props.blueprintId;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Button className="labeled icon" color="teal" icon="rocket" disabled={!blueprintId}
                        onClick={this._showModal.bind(this, BlueprintActionButtons.DEPLOY_ACTION)}
                        content="Create deployment"/>

                <Button className="labeled icon" color="teal" icon="trash" disabled={!blueprintId}
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