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
        var Table = Stage.Basic.Table;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Table fetchData={this.fetchGridData.bind(this)}
                            totalSize={this.props.data.total}
                            pageSize={this.props.widget.pageSize}
                            selectable={true}
                            className="pluginsTable">

                    <Table.Column label="Id" name="id" width="20%"/>
                    <Table.Column label="Package name" name="package_name" width="15%"/>
                    <Table.Column label="Package version" name="package_version" width="10%"/>
                    <Table.Column label="Supported platform" name="supported_platform" width="10%"/>
                    <Table.Column label="Distribution" name="distribution" width="10%"/>
                    <Table.Column label="Distribute release" name="distribution_release" width="10%"/>
                    <Table.Column label="Uploaded at" name="uploaded_at" width="15%"/>
                    <Table.Column width="10%"/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <Table.Row key={item.id} selected={item.isSelected} onClick={this._selectPlugin.bind(this, item)}>
                                    <Table.Data><a className='pluginName' href="javascript:void(0)">{item.id}</a></Table.Data>
                                    <Table.Data>{item.package_name}</Table.Data>
                                    <Table.Data>{item.package_version}</Table.Data>
                                    <Table.Data>{item.supported_platform}</Table.Data>
                                    <Table.Data>{item.distribution}</Table.Data>
                                    <Table.Data>{item.distribution_release}</Table.Data>
                                    <Table.Data>{item.uploaded_at}</Table.Data>
                                    <Table.Data className="center aligned rowActions">
                                        <i className="download icon link bordered" title="Download" onClick={this._downloadPlugin.bind(this,item)}></i>
                                        <i className="trash icon link bordered" title="Delete" onClick={this._deletePluginConfirm.bind(this,item)}></i>
                                    </Table.Data>
                                </Table.Row>
                            );
                        })
                    }

                    <Table.Action>
                        <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                    </Table.Action>

                </Table>

                <Confirm title='Are you sure you want to remove this plugin?'
                         show={this.state.confirmDelete}
                         onConfirm={this._deletePlugin.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />
            </div>

        );
    }
};
