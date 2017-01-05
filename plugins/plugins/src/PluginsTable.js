/**
 * Created by kinneretzin on 02/10/2016.
 */

import Actions from './actions';
import UploadModal from './UploadPluginModal';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            confirmDelete:false
        }
    }

    _selectPlugin (item){
        var oldSelectedPluginId = this.props.toolbox.getContext().getValue('pluginId');
        this.props.toolbox.getContext().setValue('pluginId',item.id === oldSelectedPluginId ? null : item.id);
    }

    _deletePluginConfirm(item,event){
        event.stopPropagation();

        this.setState({
            confirmDelete : true,
            item: item
        });
    }

    _downloadPlugin(item,event) {
        event.stopPropagation();

        window.open(this.props.toolbox.getManager().getManagerUrl(`/plugins/${item.id}/archive`));
    }

    _deletePlugin() {
        if (!this.state.item) {
            this.setState({error: 'Something went wrong, no plugin was selected for delete'});
            return;
        }

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.item)
            .then(()=> {
                this.setState({confirmDelete: false});
                this.props.toolbox.getEventBus().trigger('plugins:refresh');
            })
            .catch(err=>{
                this.setState({confirmDelete: false, error: err.error});
            });
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('plugins:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('plugins:refresh',this._refreshData);
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
                            className="pluginsTable">

                    <Grid.Column label="Id" name="id" width="20%"/>
                    <Grid.Column label="Package name" name="package_name" width="15%"/>
                    <Grid.Column label="Package version" name="package_version" width="10%"/>
                    <Grid.Column label="Supported platform" name="supported_platform" width="10%"/>
                    <Grid.Column label="Distribution" name="distribution" width="10%"/>
                    <Grid.Column label="Distribute release" name="distribution_release" width="10%"/>
                    <Grid.Column label="Uploaded at" name="uploaded_at" width="15%"/>
                    <Grid.Column width="10%"/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <Grid.Row key={item.id} select={item.isSelected} onClick={this._selectPlugin.bind(this, item)}>
                                    <Grid.Data><a className='pluginName' href="javascript:void(0)">{item.id}</a></Grid.Data>
                                    <Grid.Data>{item.package_name}</Grid.Data>
                                    <Grid.Data>{item.package_version}</Grid.Data>
                                    <Grid.Data>{item.supported_platform}</Grid.Data>
                                    <Grid.Data>{item.distribution}</Grid.Data>
                                    <Grid.Data>{item.distribution_release}</Grid.Data>
                                    <Grid.Data>{item.uploaded_at}</Grid.Data>
                                    <Grid.Data className="center aligned rowActions">
                                        <i className="download icon link bordered" title="Download" onClick={this._downloadPlugin.bind(this,item)}></i>
                                        <i className="trash icon link bordered" title="Delete" onClick={this._deletePluginConfirm.bind(this,item)}></i>
                                    </Grid.Data>
                                </Grid.Row>
                            );
                        })
                    }

                    <Grid.Action>
                        <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                    </Grid.Action>

                </Grid.Table>

                <Confirm title='Are you sure you want to remove this plugin?'
                         show={this.state.confirmDelete}
                         onConfirm={this._deletePlugin.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />
            </div>

        );
    }
};
