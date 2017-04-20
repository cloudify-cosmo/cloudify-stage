/**
 * Created by jakubniezgoda on 28/02/2017.
 */

export default class BlueprintActionButtons extends React.Component {

    static DEPLOY_ACTION = 'deploy';
    static DELETE_ACTION = 'delete';

    static EMPTY_BLUEPRINT = {id: '', plan: {inputs: {}}};

    constructor(props,context) {
        super(props,context);

        this.state = {
            showModal: false,
            modalType: '',
            loading: false,
            error: null
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.blueprint, nextProps.blueprint);
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
        this.setState({loading: true});
        let actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doDelete(this.props.blueprint).then(()=> {
            this.props.toolbox.getEventBus().trigger('blueprints:refresh');
            this.setState({loading: false, error: null});
            this._hideModal();
            this.props.toolbox.loading(false);
        }).catch((err)=>{
            this.setState({loading: false, error: err.message});
            this._hideModal();
            this.props.toolbox.loading(false);
        });
        return false;
    }

    render() {
        let {ErrorMessage, Button, Confirm} = Stage.Basic;
        let {DeployBlueprintModal} = Stage.Common;

        let blueprintId = this.props.blueprint.id;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Button className="labeled icon" color="teal" icon="rocket" disabled={_.isEmpty(blueprintId) || this.state.loading}
                        onClick={this._showModal.bind(this, BlueprintActionButtons.DEPLOY_ACTION)}
                        content="Create deployment"/>

                <Button className="labeled icon" color="teal" icon="trash" disabled={_.isEmpty(blueprintId) || this.state.loading}
                        onClick={this._showModal.bind(this, BlueprintActionButtons.DELETE_ACTION)}
                        content="Delete blueprint"/>

                <DeployBlueprintModal open={this._isShowModal(BlueprintActionButtons.DEPLOY_ACTION)}
                                      blueprint={this.props.blueprint}
                                      onHide={this._hideModal.bind(this)}
                                      toolbox={this.props.toolbox}/>

                <Confirm content={`Are you sure you want to remove blueprint ${blueprintId}?`}
                         open={this._isShowModal(BlueprintActionButtons.DELETE_ACTION)}
                         onConfirm={this._deleteBlueprint.bind(this, blueprintId)}
                         onCancel={this._hideModal.bind(this)} />

            </div>
        );
    }
}