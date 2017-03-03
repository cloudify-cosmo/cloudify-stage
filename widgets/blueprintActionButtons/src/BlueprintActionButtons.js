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

    _deleteBlueprint() {
        let actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        this._hideModal();
        actions.doDelete(this.state.blueprint).then(()=> {
            this.props.toolbox.getEventBus().trigger('blueprints:refresh');
        }).catch((err)=>{
            this.setState({error: err.message});
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps.blueprintId)) {
            let actions = new Stage.Common.BlueprintActions(nextProps.toolbox);
            actions.doGetFullBlueprintDataById(nextProps.blueprintId).then((blueprint) => {
                this.setState({blueprint});
            }).catch((err) => {
                this.setState({blueprint: BlueprintActionButtons.EMPTY_BLUEPRINT, error: err.message});
            });
        } else {
            this.setState({blueprint: BlueprintActionButtons.EMPTY_BLUEPRINT});
        }
    }

    render() {
        let {ErrorMessage, Button, Confirm} = Stage.Basic;
        let {DeployBlueprintModal} = Stage.Common;

        let blueprintId = this.state.blueprint.id;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Button className="labeled icon" color="teal" icon="rocket" disabled={!blueprintId}
                        onClick={this._showModal.bind(this, BlueprintActionButtons.DEPLOY_ACTION)}
                        content="Create deployment"/>

                <Button className="labeled icon" color="teal" icon="trash" disabled={!blueprintId}
                        onClick={this._showModal.bind(this, BlueprintActionButtons.DELETE_ACTION)}
                        content="Delete blueprint"/>

                <DeployBlueprintModal show={this.state.modalType === BlueprintActionButtons.DEPLOY_ACTION && this.state.showModal}
                                      blueprint={this.state.blueprint}
                                      onHide={this._hideModal.bind(this)}
                                      toolbox={this.props.toolbox}/>

                <Confirm title={`Are you sure you want to remove blueprint ${blueprintId}?`}
                         show={this.state.modalType === BlueprintActionButtons.DELETE_ACTION && this.state.showModal}
                         onConfirm={this._deleteBlueprint.bind(this, blueprintId)}
                         onCancel={this._hideModal.bind(this)} />

            </div>
        );
    }
}