/**
 * Created by kinneretzin on 02/10/2016.
 */

import BlueprintsTable from './BlueprintsTable';
import BlueprintsCatalog from './BlueprintsCatalog';

export default class BlueprintList extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            showDeploymentModal: false,
            blueprint: {},
            confirmDelete:false,
            error: null
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _selectBlueprint (item){
        if (this.props.widget.configuration.clickToDrillDown) {
            this.props.toolbox.drillDown(this.props.widget,'blueprint',{blueprintId: item.id}, item.id);
        } else {
            var oldSelectedBlueprintId = this.props.toolbox.getContext().getValue('blueprintId');
            this.props.toolbox.getContext().setValue('blueprintId',item.id === oldSelectedBlueprintId ? null : item.id);
        }
    }

    _createDeployment(item){
        // Get the full blueprint data (including plan for inputs)
        var actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doGetFullBlueprintData(item).then((blueprint)=>{
            this.setState({error: null, blueprint, showDeploymentModal: true});
        }).catch((err)=> {
            this.setState({error: err.message});
        });
    }

    _deleteBlueprintConfirm(item){
        this.setState({
            confirmDelete : true,
            item: item
        });
    }

    _deleteBlueprint() {
        if (!this.state.item) {
            this.setState({error: 'Something went wrong, no blueprint was selected for delete'});
            return;
        }

        var actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        this.setState({confirmDelete: false});
        actions.doDelete(this.state.item)
            .then(()=> {
                this.props.toolbox.getEventBus().trigger('blueprints:refresh');
            })
            .catch((err)=>{
                this.setState({error: err.message});
            });
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('blueprints:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('blueprints:refresh',this._refreshData);
    }

    _hideDeploymentModal() {
        this.setState({showDeploymentModal: false});
    }

    fetchGridData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    render() {
        let {ErrorMessage, Confirm} = Stage.Basic;
        let DeployModal = Stage.Common.DeployBlueprintModal;

        var shouldShowTable = this.props.widget.configuration['displayStyle'] === 'table';

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                {
                    shouldShowTable ?
                        <BlueprintsTable
                            widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}
                            fetchGridData={this.fetchGridData.bind(this)}
                            onSelectBlueprint={this._selectBlueprint.bind(this)}
                            onDeleteBlueprint={this._deleteBlueprintConfirm.bind(this)}
                            onCreateDeployment={this._createDeployment.bind(this)}
                            />
                        :
                        <BlueprintsCatalog
                            widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}
                            fetchData={this.fetchGridData.bind(this)}
                            onSelectBlueprint={this._selectBlueprint.bind(this)}
                            onDeleteBlueprint={this._deleteBlueprintConfirm.bind(this)}
                            onCreateDeployment={this._createDeployment.bind(this)}
                            />

                }

                <Confirm content='Are you sure you want to remove this blueprint?'
                         open={this.state.confirmDelete}
                         onConfirm={this._deleteBlueprint.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />

                <DeployModal open={this.state.showDeploymentModal}
                             blueprint={this.state.blueprint}
                             onHide={this._hideDeploymentModal.bind(this)}
                             toolbox={this.props.toolbox}/>

            </div>

        );
    }
};
