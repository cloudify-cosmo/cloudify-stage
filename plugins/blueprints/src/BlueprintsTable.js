/**
 * Created by kinneretzin on 02/10/2016.
 */

import DeployModal from './DeployBlueprintModal';
import Actions from './actions';
import UploadModal from './UploadBlueprintModal';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            confirmDelete:false
        }
    }

    _selectBlueprint (item){
        var oldSelectedBlueprintId = this.props.toolbox.getContext().getValue('blueprintId');
        this.props.toolbox.getContext().setValue('blueprintId',item.id === oldSelectedBlueprintId ? null : item.id);
    }

    _createDeployment(item,event){
        event.stopPropagation();

        // Get the full blueprint data (including plan for inputs)
        var actions = new Actions(this.props.toolbox);
        actions.doGetFullBlueprintData(item).then((fullBlueprint)=>{
            this.props.toolbox.getContext().setValue(this.props.widget.id + 'createDeploy',fullBlueprint);
        }).catch((err)=> {
            this.setState({error: err.error});
        });
    }

    _deleteBlueprintConfirm(item,event){
        event.stopPropagation();

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

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.item)
            .then(()=> {
                this.setState({confirmDelete: false});
                this.props.toolbox.getEventBus().trigger('blueprints:refresh');
            })
            .catch((err)=>{
                this.setState({confirmDelete: false, error: err.error});
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

    fetchGridData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    render() {
        var Confirm = Stage.Basic.Confirm;
        var ErrorMessage = Stage.Basic.ErrorMessage;
        var Grid = Stage.Basic.Grid;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Grid.Table fetchData={this.fetchGridData.bind(this)}
                            totalSize={this.props.data.total}
                            pageSize={this.props.widget.plugin.pageSize}
                            selectable={true}
                            className="blueprintsTable">

                    <Grid.Column label="Name" name="id" width="30%"/>
                    <Grid.Column label="Created" name="created_at" width="20%"/>
                    <Grid.Column label="Updated" name="updated_at" width="20%"/>
                    <Grid.Column label="# Deployments" width="20%"/>
                    <Grid.Column width="10%"/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <Grid.Row key={item.id} select={item.isSelected} onClick={this._selectBlueprint.bind(this, item)}>
                                    <Grid.Data><a className='blueprintName' href="javascript:void(0)">{item.id}</a></Grid.Data>
                                    <Grid.Data>{item.created_at}</Grid.Data>
                                    <Grid.Data>{item.updated_at}</Grid.Data>
                                    <Grid.Data><div className="ui green horizontal label">{item.depCount}</div></Grid.Data>
                                    <Grid.Data className="center aligned rowActions">
                                        <i className="rocket icon link bordered" title="Create deployment" onClick={this._createDeployment.bind(this,item)}></i>
                                        <i className="trash icon link bordered" title="Delete blueprint" onClick={this._deleteBlueprintConfirm.bind(this,item)}></i>
                                    </Grid.Data>
                                </Grid.Row>
                            );
                        })
                    }

                    <Grid.Action>
                        <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                    </Grid.Action>

                </Grid.Table>

                <Confirm title='Are you sure you want to remove this blueprint?'
                         show={this.state.confirmDelete}
                         onConfirm={this._deleteBlueprint.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />

                <DeployModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>

            </div>

        );
    }
};
