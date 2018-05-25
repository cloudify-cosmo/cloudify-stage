/**
 * Created by kinneretzin on 02/10/2016.
 */

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null,
            confirmDelete: false,
            showUploadModal: false,
            idPopupOpened: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _selectPlugin (item){
        var oldSelectedPluginId = this.props.toolbox.getContext().getValue('pluginId');
        if (item.id === oldSelectedPluginId) {
            this.props.toolbox.getContext().setValue('pluginId', null);
            this._hideIdPopup();
        } else {
            this.props.toolbox.getContext().setValue('pluginId', item.id);
            this._showIdPopup();
        }
    }

    _deletePluginConfirm(item,event){
        event.stopPropagation();

        this.setState({
            confirmDelete: true,
            item: item
        });
    }

    _downloadPlugin(item,event) {
        event.stopPropagation();

        let actions = new Stage.Common.PluginActions(this.props.toolbox);
        actions.doDownload(item)
               .then(() => {this.setState({error: null})})
               .catch((err) => {this.setState({error: err.message})});
    }

    _deletePlugin() {
        if (!this.state.item) {
            this.setState({error: 'Something went wrong, no plugin was selected for delete'});
            return;
        }

        var actions = new Stage.Common.PluginActions(this.props.toolbox);
        actions.doDelete(this.state.item)
            .then(()=> {
                this.setState({confirmDelete: false, error: null});
                this.props.toolbox.getEventBus().trigger('plugins:refresh');
            })
            .catch(err=>{
                this.setState({confirmDelete: false, error: err.message});
            });
    }

    _setPluginVisibility(pluginId, visibility) {
        var actions = new Stage.Common.PluginActions(this.props.toolbox);
        this.props.toolbox.loading(true);
        actions.doSetVisibility(pluginId, visibility)
            .then(()=> {
                this.props.toolbox.loading(false);
                this.props.toolbox.refresh();
            })
            .catch((err)=>{
                this.props.toolbox.loading(false);
                this.setState({error: err.message});
            });
    }

    _showUploadModal() {
        this.setState({showUploadModal: true});
    }

    _hideUploadModal() {
        this.setState({showUploadModal: false});
    }

    _showIdPopup() {
        this.setState({idPopupOpened: true});
    }

    _hideIdPopup() {
        this.setState({idPopupOpened: false});
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
        return this.props.toolbox.refresh(fetchParams);
    }

    render() {
        let {Button, Confirm, CopyToClipboardButton, ErrorMessage, DataTable, Popup, ResourceVisibility} = Stage.Basic;
        let {UploadPluginModal} = Stage.Common;

        return (
            <div>
                <div style={{width: '400px', height: '500px;'}}>
                    <CopyToClipboardButton text={'Text to copy'} />
                </div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <DataTable fetchData={this.fetchGridData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           searchable={true}
                           className="pluginsTable">

                    <DataTable.Column label="Package name" name="package_name" width="20%"/>
                    <DataTable.Column label="Package version" name="package_version" width="10%"/>
                    <DataTable.Column label="Supported platform" name="supported_platform" width="10%"/>
                    <DataTable.Column label="Distribution" name="distribution" width="10%"/>
                    <DataTable.Column label="Distribute release" name="distribution_release" width="10%"/>
                    <DataTable.Column label="Uploaded at" name="uploaded_at" width="15%"/>
                    <DataTable.Column label="Creator" name='created_by' width="15%"/>
                    <DataTable.Column width="10%"/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <DataTable.Row key={item.id} selected={item.isSelected} onClick={this._selectPlugin.bind(this, item)}>
                                    <DataTable.Data>
                                        {
                                            <Popup wide open={this.state.idPopupOpened && item.isSelected}
                                                   trigger={<span>{item.package_name}</span>}>
                                                <span className='noWrap'>
                                                    Plugin ID: <strong>{item.id}</strong>
                                                    <CopyToClipboardButton text={item.id} />
                                                </span>
                                            </Popup>
                                        }
                                        <ResourceVisibility visibility={item.visibility} onSetVisibility={(visibility) => this._setPluginVisibility(item.id, visibility)} allowedSettingTo={['tenant', 'global']} className="rightFloated"/>
                                    </DataTable.Data>
                                    <DataTable.Data>{item.package_version}</DataTable.Data>
                                    <DataTable.Data>{item.supported_platform}</DataTable.Data>
                                    <DataTable.Data>{item.distribution}</DataTable.Data>
                                    <DataTable.Data>{item.distribution_release}</DataTable.Data>
                                    <DataTable.Data>{item.uploaded_at}</DataTable.Data>
                                    <DataTable.Data>{item.created_by}</DataTable.Data>
                                    <DataTable.Data className="center aligned rowActions">
                                        <i className="download icon link bordered" title="Download" onClick={this._downloadPlugin.bind(this,item)}></i>
                                        <i className="trash icon link bordered" title="Delete" onClick={this._deletePluginConfirm.bind(this,item)}></i>
                                    </DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }

                    <DataTable.Action>
                        <Button content='Upload' icon='upload' labelPosition='left' onClick={this._showUploadModal.bind(this)}/>
                    </DataTable.Action>

                </DataTable>

                <UploadPluginModal open={this.state.showUploadModal} toolbox={this.props.toolbox} onHide={this._hideUploadModal.bind(this)} />
                
                <Confirm content='Are you sure you want to remove this plugin?'
                         open={this.state.confirmDelete}
                         onConfirm={this._deletePlugin.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />
            </div>

        );
    }
};
